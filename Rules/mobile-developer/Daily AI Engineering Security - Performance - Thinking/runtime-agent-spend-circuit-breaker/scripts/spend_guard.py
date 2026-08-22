#!/usr/bin/env python3
"""Deterministic reserve/reconcile spend guard for agent model calls.

Usage:
  python spend_guard.py reserve --config config/budget.json --state state.json \
      --task task-1 --agent agent-a --source parent --model example-model \
      --input-tokens 12000 --max-output-tokens 4096

  python spend_guard.py reconcile --config config/budget.json --state state.json \
      --reservation-id <id> --actual-input-tokens 11800 --actual-cached-input-tokens 5000 \
      --actual-output-tokens 1200

Exit codes: 0 allow/reconciled, 3 wrap-up, 4 blocked, 2 invalid input/state.
State writes are atomic on the local filesystem. For multi-process use, place this behind a
single-writer service or transactional store; do not rely on this file implementation for
concurrent writers.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import tempfile
import time
from pathlib import Path

OK, INVALID, WRAP, BLOCK = 0, 2, 3, 4


def read_obj(path: Path, required: bool = True) -> dict:
    if not path.exists():
        if required:
            raise ValueError(f"missing file: {path}")
        return {"version": 1, "actual_usd": 0.0, "reserved_usd": 0.0, "agent_daily": {}, "reservations": {}, "events": []}
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return obj


def atomic_write(path: Path, obj: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=path.name + ".", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(obj, f, indent=2, sort_keys=True)
            f.write("\n")
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, path)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def nonneg(value: int, name: str) -> int:
    if value < 0:
        raise ValueError(f"{name} must be non-negative")
    return value


def price(config: dict, model: str, input_tokens: int, cached_tokens: int, output_tokens: int) -> float:
    table = config.get("pricing_per_million_tokens", {})
    p = table.get(model)
    if not isinstance(p, dict):
        if config.get("unknown_model_policy", "block") == "block":
            raise ValueError(f"unknown model pricing: {model}")
        p = {"input": 0.0, "cached_input": 0.0, "output": 0.0}
    uncached = max(0, input_tokens - cached_tokens)
    return ((uncached * float(p.get("input", 0))) + (cached_tokens * float(p.get("cached_input", p.get("input", 0)))) + (output_tokens * float(p.get("output", 0)))) / 1_000_000.0


def day_key() -> str:
    return time.strftime("%Y-%m-%d", time.gmtime())


def reserve(args: argparse.Namespace, config: dict, state: dict) -> int:
    input_tokens = nonneg(args.input_tokens, "input_tokens")
    max_output = nonneg(args.max_output_tokens, "max_output_tokens")
    estimate = price(config, args.model, input_tokens, 0, max_output)
    reserve_usd = estimate * float(config.get("reservation_safety_factor", 1.15))
    actual = float(state.get("actual_usd", 0.0))
    reserved = float(state.get("reserved_usd", 0.0))
    projected = actual + reserved + reserve_usd
    task_hard = float(config["task_hard_limit_usd"])
    wrap = float(config.get("task_wrap_up_threshold_usd", task_hard))
    agent_daily = state.setdefault("agent_daily", {})
    key = f"{day_key()}:{args.agent}"
    agent_spend = float(agent_daily.get(key, 0.0))
    agent_limit = float(config.get("agent_daily_hard_limit_usd", task_hard))

    decision = "allow"
    code = OK
    reasons = []
    if projected > task_hard:
        decision, code = "block", BLOCK
        reasons.append("task hard limit would be exceeded")
    if agent_spend + reserve_usd > agent_limit:
        decision, code = "block", BLOCK
        reasons.append("agent daily hard limit would be exceeded")
    if decision == "allow" and projected >= wrap:
        decision, code = "wrap_up", WRAP
        reasons.append("wrap-up threshold reached")

    event = {"ts": time.time(), "type": "reserve_decision", "task": args.task, "agent": args.agent, "source": args.source, "model": args.model, "decision": decision, "estimated_usd": estimate, "reservation_usd": reserve_usd, "projected_task_usd": projected, "reasons": reasons}
    state.setdefault("events", []).append(event)
    result = dict(event)
    if decision != "block":
        raw = f"{args.task}|{args.agent}|{args.source}|{args.model}|{time.time_ns()}".encode()
        rid = hashlib.sha256(raw).hexdigest()[:24]
        state.setdefault("reservations", {})[rid] = {"task": args.task, "agent": args.agent, "source": args.source, "model": args.model, "usd": reserve_usd, "created_at": time.time()}
        state["reserved_usd"] = reserved + reserve_usd
        result["reservation_id"] = rid
    atomic_write(args.state, state)
    print(json.dumps(result, indent=2))
    return code


def reconcile(args: argparse.Namespace, config: dict, state: dict) -> int:
    reservations = state.setdefault("reservations", {})
    reservation = reservations.get(args.reservation_id)
    if not isinstance(reservation, dict):
        raise ValueError("unknown reservation_id")
    inp = nonneg(args.actual_input_tokens, "actual_input_tokens")
    cached = nonneg(args.actual_cached_input_tokens, "actual_cached_input_tokens")
    out = nonneg(args.actual_output_tokens, "actual_output_tokens")
    if cached > inp:
        raise ValueError("cached input tokens cannot exceed total input tokens")
    actual_usd = price(config, reservation["model"], inp, cached, out)
    reserved_usd = float(reservation["usd"])
    state["reserved_usd"] = max(0.0, float(state.get("reserved_usd", 0.0)) - reserved_usd)
    state["actual_usd"] = float(state.get("actual_usd", 0.0)) + actual_usd
    key = f"{day_key()}:{reservation['agent']}"
    daily = state.setdefault("agent_daily", {})
    daily[key] = float(daily.get(key, 0.0)) + actual_usd
    del reservations[args.reservation_id]
    event = {"ts": time.time(), "type": "reconcile", "reservation_id": args.reservation_id, "task": reservation["task"], "agent": reservation["agent"], "source": reservation["source"], "model": reservation["model"], "reserved_usd": reserved_usd, "actual_usd": actual_usd, "input_tokens": inp, "cached_input_tokens": cached, "output_tokens": out}
    state.setdefault("events", []).append(event)
    atomic_write(args.state, state)
    print(json.dumps(event, indent=2))
    return OK


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser()
    p.add_argument("command", choices=["reserve", "reconcile"])
    p.add_argument("--config", type=Path, required=True)
    p.add_argument("--state", type=Path, required=True)
    p.add_argument("--task")
    p.add_argument("--agent")
    p.add_argument("--source")
    p.add_argument("--model")
    p.add_argument("--input-tokens", type=int, default=0)
    p.add_argument("--max-output-tokens", type=int, default=0)
    p.add_argument("--reservation-id")
    p.add_argument("--actual-input-tokens", type=int, default=0)
    p.add_argument("--actual-cached-input-tokens", type=int, default=0)
    p.add_argument("--actual-output-tokens", type=int, default=0)
    return p


def main() -> int:
    args = parser().parse_args()
    try:
        config = read_obj(args.config)
        state = read_obj(args.state, required=False)
        if args.command == "reserve":
            if not all(isinstance(x, str) and x.strip() for x in (args.task, args.agent, args.source, args.model)):
                raise ValueError("reserve requires --task --agent --source --model")
            return reserve(args, config, state)
        if not isinstance(args.reservation_id, str) or not args.reservation_id:
            raise ValueError("reconcile requires --reservation-id")
        return reconcile(args, config, state)
    except (ValueError, KeyError, TypeError, OSError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())

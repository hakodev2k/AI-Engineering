#!/usr/bin/env python3
"""Evaluate heterogeneous agent tool-call burst budgets from JSONL events.
Exit 0=continue, 2=invalid input/config, 3=checkpoint required in strict mode.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from typing import Any


def load_policy(path: Path) -> dict[str, Any]:
    try:
        p = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read policy: {exc}") from exc
    required = ["max_calls", "max_prompt_tokens", "max_elapsed_ms", "max_same_target_calls"]
    if not isinstance(p, dict) or any(not isinstance(p.get(k), int) or p[k] < 1 for k in required):
        raise ValueError("policy limits must be positive integers")
    return p


def load_events(path: Path) -> list[dict[str, Any]]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read events: {exc}") from exc
    out = []
    for n, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            e = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {n}: invalid JSON: {exc}") from exc
        if not isinstance(e, dict) or not isinstance(e.get("step"), int) or e["step"] < 1:
            raise ValueError(f"line {n}: positive integer step required")
        if not isinstance(e.get("tool"), str) or not e["tool"]:
            raise ValueError(f"line {n}: tool required")
        for k in ("prompt_tokens", "elapsed_ms"):
            if k in e and (not isinstance(e[k], int) or e[k] < 0):
                raise ValueError(f"line {n}: {k} must be non-negative int")
        out.append(e)
    if not out:
        raise ValueError("no events")
    return out


def analyze(events: list[dict[str, Any]], p: dict[str, Any]) -> dict[str, Any]:
    burst = []
    for e in events:
        if e.get("checkpoint") is True:
            burst = []
            continue
        burst.append(e)
    calls = len(burst)
    tokens = sum(int(e.get("prompt_tokens", 0)) for e in burst)
    elapsed = sum(int(e.get("elapsed_ms", 0)) for e in burst)
    target_counts: dict[str, int] = {}
    for e in burst:
        t = e.get("target") or e.get("domain") or ""
        if isinstance(t, str) and t:
            key = t.casefold()
            target_counts[key] = target_counts.get(key, 0) + 1
    same_target = max(target_counts.values(), default=0)
    reasons = []
    if calls >= p["max_calls"]: reasons.append("call_budget")
    if tokens >= p["max_prompt_tokens"]: reasons.append("prompt_token_budget")
    if elapsed >= p["max_elapsed_ms"]: reasons.append("elapsed_time_budget")
    if same_target >= p["max_same_target_calls"]: reasons.append("target_locality_budget")
    decision = "checkpoint_required" if reasons else "continue"
    return {"decision": decision, "reasons": reasons, "calls": calls, "prompt_tokens": tokens,
            "elapsed_ms": elapsed, "max_same_target_calls": same_target,
            "last_steps": [e["step"] for e in burst[-5:]]}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("events", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()
    try:
        report = analyze(load_events(args.events), load_policy(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 3 if args.strict and report["decision"] == "checkpoint_required" else 0

if __name__ == "__main__":
    raise SystemExit(main())

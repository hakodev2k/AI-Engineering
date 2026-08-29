#!/usr/bin/env python3
"""Detect deterministic no-progress patterns in agent tool traces.

Input is JSONL. Each row requires `tool` and may include `args`, `result`,
`error`, `state_fingerprint`, `latency_ms`, and `tokens`.

Exit codes: 0 = continue, 1 = invalid input/config, 2 = stop detected.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

DEFAULTS = {
    "max_total_steps": 40,
    "max_exact_repeat_streak": 3,
    "max_cycle_period": 3,
    "max_cycle_repetitions": 3,
    "max_stagnant_state_steps": 4,
    "side_effecting_tools": [],
    "require_state_fingerprint_for_side_effecting_retries": True,
}


def canonical(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False, default=str)


def fingerprint(step: dict[str, Any]) -> str:
    outcome = {"error": step.get("error"), "result": step.get("result")}
    payload = {"tool": step.get("tool"), "args": step.get("args", {}), "outcome": outcome}
    return hashlib.sha256(canonical(payload).encode("utf-8")).hexdigest()


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as fh:
        for line_no, line in enumerate(fh, 1):
            if not line.strip():
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"line {line_no}: invalid JSON: {exc}") from exc
            if not isinstance(row, dict) or not isinstance(row.get("tool"), str) or not row["tool"].strip():
                raise ValueError(f"line {line_no}: non-empty string 'tool' is required")
            rows.append(row)
    return rows


def load_config(path: Path | None) -> dict[str, Any]:
    cfg = dict(DEFAULTS)
    if path:
        raw = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(raw, dict):
            raise ValueError("config must be a JSON object")
        cfg.update(raw)
    integer_keys = ["max_total_steps", "max_exact_repeat_streak", "max_cycle_period", "max_cycle_repetitions", "max_stagnant_state_steps"]
    for key in integer_keys:
        if not isinstance(cfg.get(key), int) or cfg[key] < 1:
            raise ValueError(f"{key} must be a positive integer")
    if not isinstance(cfg.get("side_effecting_tools"), list):
        raise ValueError("side_effecting_tools must be a list")
    return cfg


def analyze(rows: list[dict[str, Any]], cfg: dict[str, Any]) -> dict[str, Any]:
    fps = [fingerprint(row) for row in rows]
    reasons: list[dict[str, Any]] = []

    if len(rows) >= cfg["max_total_steps"]:
        reasons.append({"type": "hard_limit_reached", "steps": len(rows)})

    if fps:
        streak = 1
        for i in range(len(fps) - 2, -1, -1):
            if fps[i] == fps[-1]:
                streak += 1
            else:
                break
        if streak >= cfg["max_exact_repeat_streak"]:
            reasons.append({"type": "exact_repeat", "streak": streak, "fingerprint": fps[-1]})

    max_period = min(cfg["max_cycle_period"], len(fps) // cfg["max_cycle_repetitions"])
    for period in range(2, max_period + 1):
        width = period * cfg["max_cycle_repetitions"]
        tail = fps[-width:]
        pattern = tail[:period]
        if tail and all(tail[i] == pattern[i % period] for i in range(len(tail))):
            reasons.append({"type": "short_cycle", "period": period, "repetitions": cfg["max_cycle_repetitions"]})
            break

    states = [r.get("state_fingerprint") for r in rows]
    n = cfg["max_stagnant_state_steps"]
    if len(states) >= n and states[-1] is not None and len(set(states[-n:])) == 1:
        reasons.append({"type": "state_stagnation", "steps": n, "state_fingerprint": states[-1]})

    side_effecting = set(str(x) for x in cfg["side_effecting_tools"])
    if cfg.get("require_state_fingerprint_for_side_effecting_retries", True) and len(rows) >= 2:
        a, b = rows[-2], rows[-1]
        if a["tool"] == b["tool"] and b["tool"] in side_effecting and canonical(a.get("args", {})) == canonical(b.get("args", {})):
            if not a.get("state_fingerprint") or not b.get("state_fingerprint") or a.get("state_fingerprint") == b.get("state_fingerprint"):
                reasons.append({"type": "unsafe_side_effect_retry", "tool": b["tool"]})

    total_tokens = sum(int(r.get("tokens", 0) or 0) for r in rows)
    total_latency = sum(float(r.get("latency_ms", 0) or 0) for r in rows)
    return {
        "decision": "stop" if reasons else "continue",
        "steps": len(rows),
        "total_tokens": total_tokens,
        "total_latency_ms": total_latency,
        "reasons": reasons,
        "last_fingerprint": fps[-1] if fps else None,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("trace", type=Path)
    parser.add_argument("--config", type=Path)
    parser.add_argument("--json-out", type=Path)
    args = parser.parse_args()
    try:
        cfg = load_config(args.config)
        rows = load_jsonl(args.trace)
        report = analyze(rows, cfg)
        rendered = json.dumps(report, indent=2, sort_keys=True)
        if args.json_out:
            args.json_out.write_text(rendered + "\n", encoding="utf-8")
        print(rendered)
        return 2 if report["decision"] == "stop" else 0
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"progress_guard: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

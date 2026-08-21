#!/usr/bin/env python3
"""Evaluate a JSONL usage ledger against a deterministic token budget policy.

Exit codes: 0 allow, 3 warning, 4 stop, 2 invalid input.
No network access or destructive actions are performed.
"""
from __future__ import annotations
import argparse, json, sys
from datetime import datetime, timezone
from pathlib import Path


def load_json(path: Path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy must be a JSON object")
    return data


def load_events(path: Path):
    out = []
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    for i, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            e = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid JSON at line {i}: {exc}") from exc
        required = ["task_id", "source", "input_tokens", "output_tokens", "cached_tokens", "timestamp"]
        if not isinstance(e, dict) or any(k not in e for k in required):
            raise ValueError(f"line {i}: missing required fields")
        for k in ("input_tokens", "output_tokens", "cached_tokens"):
            if not isinstance(e[k], int) or e[k] < 0:
                raise ValueError(f"line {i}: {k} must be non-negative integer")
        try:
            e["_ts"] = datetime.fromisoformat(e["timestamp"].replace("Z", "+00:00")).astimezone(timezone.utc)
        except Exception as exc:
            raise ValueError(f"line {i}: invalid timestamp") from exc
        out.append(e)
    if not out:
        raise ValueError("ledger contains no events")
    return out


def evaluate(events, p):
    total = sum(e["input_tokens"] + e["output_tokens"] for e in events)
    retry = sum(e["input_tokens"] + e["output_tokens"] for e in events if e.get("retry") or e.get("source") == "retry")
    cost = sum(float(e.get("estimated_cost_usd", 0) or 0) for e in events)
    last_progress_idx = -1
    for i, e in enumerate(events):
        if e.get("progress_marker"):
            last_progress_idx = i
    tail = events[last_progress_idx + 1:]
    no_progress = sum(e["input_tokens"] + e["output_tokens"] for e in tail)
    elapsed = max((max(e["_ts"] for e in events) - min(e["_ts"] for e in events)).total_seconds() / 60.0, 1.0)
    velocity = total / elapsed
    retry_ratio = retry / total if total else 0.0
    reasons = []
    hard = {
        "total_tokens": (total, int(p["max_total_tokens"])),
        "estimated_cost_usd": (cost, float(p["max_estimated_cost_usd"])),
        "token_velocity_per_minute": (velocity, float(p["max_token_velocity_per_minute"])),
        "retry_token_ratio": (retry_ratio, float(p["max_retry_token_ratio"])),
        "no_progress_tokens": (no_progress, int(p["max_no_progress_tokens"]))
    }
    for name, (value, limit) in hard.items():
        if value >= limit:
            reasons.append(f"{name}={value:.4g} >= {limit:.4g}")
    warn_ratio = float(p.get("warning_ratio", 0.8))
    warnings = []
    for name, (value, limit) in hard.items():
        if limit > 0 and value >= limit * warn_ratio and value < limit:
            warnings.append(f"{name} at {value / limit:.0%} of limit")
    return {
        "decision": "stop" if reasons else ("warn" if warnings else "allow"),
        "metrics": {"total_tokens": total, "retry_tokens": retry, "retry_ratio": retry_ratio, "estimated_cost_usd": cost, "no_progress_tokens": no_progress, "token_velocity_per_minute": velocity},
        "reasons": reasons,
        "warnings": warnings
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ledger", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    args = ap.parse_args()
    try:
        policy = load_json(args.policy).get("default_task_budget", {})
        required = ["max_total_tokens", "max_estimated_cost_usd", "max_token_velocity_per_minute", "max_retry_token_ratio", "max_no_progress_tokens"]
        if any(k not in policy for k in required):
            raise ValueError("policy missing required budget fields")
        result = evaluate(load_events(args.ledger), policy)
    except (ValueError, TypeError, KeyError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2))
    return {"allow": 0, "warn": 3, "stop": 4}[result["decision"]]


if __name__ == "__main__":
    raise SystemExit(main())

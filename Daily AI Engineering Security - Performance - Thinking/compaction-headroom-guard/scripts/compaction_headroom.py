#!/usr/bin/env python3
"""Classify context headroom before compaction/recovery reserves are consumed.

Exit codes: 0 safe, 1 warn, 2 compact-now, 3 block-growth, 4 invalid input.
All units are caller-defined token/context units but must be consistent.
"""
from __future__ import annotations
import argparse, json, sys


def classify(capacity: int, used: int, expected_growth: int, compaction_reserve: int, recovery_reserve: int, warn_margin: int) -> dict:
    values = [capacity, used, expected_growth, compaction_reserve, recovery_reserve, warn_margin]
    if any(v < 0 for v in values) or capacity <= 0:
        raise ValueError("all values must be non-negative and capacity must be > 0")
    if used > capacity:
        status = "block-growth"
    else:
        hard_work_limit = capacity - compaction_reserve - recovery_reserve
        if hard_work_limit < 0:
            raise ValueError("reserves exceed capacity")
        projected = used + expected_growth
        warn_limit = max(0, hard_work_limit - warn_margin)
        if used >= hard_work_limit:
            status = "block-growth"
        elif projected >= hard_work_limit:
            status = "compact-now"
        elif projected >= warn_limit:
            status = "warn"
        else:
            status = "safe"
    projected = used + expected_growth
    return {
        "status": status,
        "capacity": capacity,
        "used": used,
        "expected_growth": expected_growth,
        "projected_used": projected,
        "compaction_reserve": compaction_reserve,
        "recovery_reserve": recovery_reserve,
        "warn_margin": warn_margin,
        "free_now": max(0, capacity - used),
        "free_after_projected_growth": max(0, capacity - projected),
        "work_limit": capacity - compaction_reserve - recovery_reserve,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--capacity", type=int, required=True)
    ap.add_argument("--used", type=int, required=True)
    ap.add_argument("--expected-growth", type=int, default=0)
    ap.add_argument("--compaction-reserve", type=int, required=True)
    ap.add_argument("--recovery-reserve", type=int, required=True)
    ap.add_argument("--warn-margin", type=int, default=0)
    args = ap.parse_args()
    try:
        result = classify(args.capacity, args.used, args.expected_growth, args.compaction_reserve, args.recovery_reserve, args.warn_margin)
        print(json.dumps(result, sort_keys=True))
        return {"safe": 0, "warn": 1, "compact-now": 2, "block-growth": 3}[result["status"]]
    except ValueError as exc:
        print(json.dumps({"status": "invalid", "error": str(exc)}), file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())

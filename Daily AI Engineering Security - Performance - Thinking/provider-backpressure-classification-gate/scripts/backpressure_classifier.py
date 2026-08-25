#!/usr/bin/env python3
"""Classify provider backpressure into bounded wait/backoff/fallback/fail actions."""
from __future__ import annotations

import argparse
import json
import math
import random
import sys
from pathlib import Path
from typing import Any

LOCAL_ADMISSION_CODES = {"chat_admission_busy", "admission_busy", "queue_full_local"}
BURST_CODES = {"limit_burst_rate", "burst_rate_limit", "burst_limit"}
RATE_CODES = {"rate_limit_exceeded", "rate_limited", "too_many_requests"}
CAPACITY_CODES = {"server_overloaded", "overloaded", "capacity", "unavailable", "high_demand"}


def _num(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def classify(event: dict[str, Any], jitter: float = 0.0) -> dict[str, Any]:
    status = int(_num(event.get("status"), 0))
    code = str(event.get("code") or "").strip().lower()
    attempt = int(_num(event.get("attempt"), 1))
    elapsed = _num(event.get("elapsed_seconds"), 0)
    max_attempts = int(_num(event.get("max_attempts"), 4))
    max_elapsed = _num(event.get("max_elapsed_seconds"), 90)
    retry_after = max(0.0, _num(event.get("retry_after"), 0))
    fallback_available = bool(event.get("fallback_available", False))

    if attempt >= max_attempts or elapsed >= max_elapsed:
        return {"action": "fail", "reason": "RECOVERY_BUDGET_EXHAUSTED", "delay_seconds": 0.0}

    if code in LOCAL_ADMISSION_CODES:
        base = retry_after if retry_after > 0 else min(2 ** max(attempt - 1, 0), 8)
        delay = min(base + jitter, max(0.0, max_elapsed - elapsed))
        return {"action": "wait", "reason": "LOCAL_ADMISSION_BACKPRESSURE", "delay_seconds": round(delay, 3)}

    if code in BURST_CODES:
        base = retry_after if retry_after > 0 else min(2 ** attempt, 30)
        delay = min(base + jitter, max(0.0, max_elapsed - elapsed))
        return {"action": "backoff", "reason": "BURST_RATE_SMOOTHING", "delay_seconds": round(delay, 3), "reduce_concurrency": True}

    if status == 429 or code in RATE_CODES:
        base = retry_after if retry_after > 0 else min(2 ** attempt, 30)
        delay = min(base + jitter, max(0.0, max_elapsed - elapsed))
        return {"action": "backoff", "reason": "RATE_LIMIT", "delay_seconds": round(delay, 3)}

    if status in {503, 529} or code in CAPACITY_CODES:
        if fallback_available and attempt >= 2:
            return {"action": "fallback", "reason": "PROVIDER_CAPACITY", "delay_seconds": 0.0}
        base = retry_after if retry_after > 0 else min(2 ** attempt, 20)
        delay = min(base + jitter, max(0.0, max_elapsed - elapsed))
        return {"action": "backoff", "reason": "PROVIDER_CAPACITY", "delay_seconds": round(delay, 3)}

    if 500 <= status <= 599:
        base = retry_after if retry_after > 0 else min(2 ** attempt, 10)
        delay = min(base + jitter, max(0.0, max_elapsed - elapsed))
        return {"action": "backoff", "reason": "UNKNOWN_5XX", "delay_seconds": round(delay, 3)}

    return {"action": "fail", "reason": "NON_RETRYABLE", "delay_seconds": 0.0}


def load(path: str) -> dict[str, Any]:
    raw = sys.stdin.read() if path == "-" else Path(path).read_text(encoding="utf-8")
    obj = json.loads(raw)
    if not isinstance(obj, dict):
        raise ValueError("input must be a JSON object")
    return obj


def main() -> int:
    parser = argparse.ArgumentParser(description="Classify LLM/provider backpressure before retry or fallback.")
    parser.add_argument("--input", required=True, help="JSON file or '-' for stdin")
    parser.add_argument("--jitter-seed", type=int, help="Optional deterministic seed for test/replay jitter")
    parser.add_argument("--max-jitter", type=float, default=0.0, help="Maximum added jitter seconds")
    args = parser.parse_args()
    try:
        event = load(args.input)
        if args.max_jitter < 0:
            raise ValueError("--max-jitter must be >= 0")
        rnd = random.Random(args.jitter_seed)
        jitter = rnd.uniform(0, args.max_jitter) if args.max_jitter else 0.0
        result = classify(event, jitter=jitter)
        print(json.dumps(result, sort_keys=True))
        return 2 if result["action"] == "fail" else 0
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"action": "fail", "error": str(exc)}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

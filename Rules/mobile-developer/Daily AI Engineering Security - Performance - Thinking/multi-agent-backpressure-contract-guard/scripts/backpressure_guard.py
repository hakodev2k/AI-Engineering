#!/usr/bin/env python3
"""Deterministic provider-aware dispatch guard.

Input JSON fields:
  inflight, queue_depth, queue_age_ms, retry_count, calls_used,
  estimated_tokens_used, deadline_remaining_ms, error_class
Exit: 0 allow, 2 invalid, 3 delay, 4 shed/stop.
"""
from __future__ import annotations
import argparse, json, math, sys
from pathlib import Path


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def number(data: dict, key: str, default=0) -> float:
    value = data.get(key, default)
    if isinstance(value, bool) or not isinstance(value, (int, float)) or value < 0:
        raise ValueError(f"{key} must be a non-negative number")
    return float(value)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("request", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        req, policy = load(args.request), load(args.policy)
        inflight = number(req, "inflight")
        depth = number(req, "queue_depth")
        age = number(req, "queue_age_ms")
        retries = int(number(req, "retry_count"))
        calls = number(req, "calls_used")
        tokens = number(req, "estimated_tokens_used")
        deadline = number(req, "deadline_remaining_ms", 1)
        error_class = req.get("error_class", "none")
        if not isinstance(error_class, str):
            raise ValueError("error_class must be a string")

        max_retries = int(policy["max_retries"])
        permanent = {"auth", "authorization", "validation", "permanent"}
        reasons = []
        decision, code, delay = "allow", 0, 0

        if error_class in permanent:
            decision, code = "stop", 4
            reasons.append("permanent error is not retryable")
        elif calls >= number(policy, "max_calls_per_task"):
            decision, code = "stop", 4
            reasons.append("logical task call budget exhausted")
        elif tokens >= number(policy, "max_estimated_tokens_per_task"):
            decision, code = "stop", 4
            reasons.append("logical task token budget exhausted")
        elif policy.get("stop_on_deadline_expired", True) and deadline <= 0:
            decision, code = "stop", 4
            reasons.append("task deadline expired")
        elif age >= number(policy, "max_queue_age_ms"):
            decision, code = "shed", 4
            reasons.append("queue age limit exceeded")
        elif depth >= number(policy, "max_queue_depth"):
            decision, code = ("shed", 4) if policy.get("shed_when_queue_full", True) else ("delay", 3)
            reasons.append("queue depth limit reached")
        elif retries >= max_retries:
            decision, code = "stop", 4
            reasons.append("retry budget exhausted")
        elif inflight >= number(policy, "max_concurrent"):
            initial = number(policy, "initial_backoff_ms")
            maximum = number(policy, "max_backoff_ms")
            multiplier = number(policy, "backoff_multiplier")
            delay = min(maximum, initial * math.pow(multiplier, retries))
            if deadline and delay >= deadline:
                decision, code = "stop", 4
                reasons.append("next backoff would exceed task deadline")
            else:
                decision, code = "delay", 3
                reasons.append("provider concurrency capacity reached")

        print(json.dumps({
            "decision": decision,
            "delay_ms": round(delay),
            "retry_count": retries,
            "remaining_retries": max(0, max_retries - retries),
            "reasons": reasons,
        }, indent=2))
        return code
    except (KeyError, ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

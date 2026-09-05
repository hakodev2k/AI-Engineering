#!/usr/bin/env python3
"""Deterministic retryability and retry-budget gate."""
import json
import sys
from pathlib import Path


def read_json(path):
    try:
        value = json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}")
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def validate_policy(p):
    errors = []
    for key in ("max_attempts", "max_same_fingerprint"):
        value = p.get(key)
        if not isinstance(value, int) or isinstance(value, bool) or value < 1:
            errors.append(f"{key} must be an integer >= 1")
    for key in ("max_elapsed_seconds", "backoff_base_seconds", "backoff_max_seconds"):
        value = p.get(key)
        if not isinstance(value, (int, float)) or isinstance(value, bool) or value <= 0:
            errors.append(f"{key} must be > 0")
    retryable = p.get("retryable_classes")
    nonretryable = p.get("non_retryable_classes")
    for key, value in (("retryable_classes", retryable), ("non_retryable_classes", nonretryable)):
        if not isinstance(value, list) or not all(isinstance(x, str) and x for x in value):
            errors.append(f"{key} must be a list of non-empty strings")
    if isinstance(retryable, list) and isinstance(nonretryable, list):
        overlap = sorted(set(retryable) & set(nonretryable))
        if overlap:
            errors.append("retryable/non-retryable classes overlap: " + ", ".join(overlap))
    if isinstance(p.get("backoff_base_seconds"), (int, float)) and isinstance(p.get("backoff_max_seconds"), (int, float)):
        if p["backoff_base_seconds"] > p["backoff_max_seconds"]:
            errors.append("backoff_base_seconds must be <= backoff_max_seconds")
    return errors


def validate_event(e):
    errors = []
    attempt = e.get("attempt")
    same = e.get("same_fingerprint_count")
    elapsed = e.get("elapsed_seconds")
    if not isinstance(attempt, int) or isinstance(attempt, bool) or attempt < 1:
        errors.append("attempt must be an integer >= 1")
    if not isinstance(same, int) or isinstance(same, bool) or same < 1:
        errors.append("same_fingerprint_count must be an integer >= 1")
    if not isinstance(elapsed, (int, float)) or isinstance(elapsed, bool) or elapsed < 0:
        errors.append("elapsed_seconds must be >= 0")
    for key in ("error_class", "fingerprint"):
        if not isinstance(e.get(key), str) or not e.get(key):
            errors.append(f"{key} must be a non-empty string")
    if not isinstance(e.get("state_changed_since_last_attempt"), bool):
        errors.append("state_changed_since_last_attempt must be boolean")
    return errors


def evaluate(p, e):
    cls = e["error_class"]
    if cls in p["non_retryable_classes"]:
        return {"verdict": "STOP", "reason": "non_retryable_class", "delay_seconds": 0}
    if e["attempt"] >= p["max_attempts"]:
        return {"verdict": "STOP", "reason": "attempt_budget_exhausted", "delay_seconds": 0}
    if e["elapsed_seconds"] >= p["max_elapsed_seconds"]:
        return {"verdict": "STOP", "reason": "elapsed_budget_exhausted", "delay_seconds": 0}
    if (e["same_fingerprint_count"] >= p["max_same_fingerprint"]
            and not e["state_changed_since_last_attempt"]):
        return {"verdict": "STOP", "reason": "repeated_error_without_progress", "delay_seconds": 0}
    if cls in p["retryable_classes"]:
        delay = min(
            p["backoff_max_seconds"],
            p["backoff_base_seconds"] * (2 ** (e["attempt"] - 1)),
        )
        return {"verdict": "RETRY", "reason": "retryable_class", "delay_seconds": delay}
    return {"verdict": "STOP", "reason": "unknown_error_class", "delay_seconds": 0}


def main(argv):
    if len(argv) != 3:
        print(f"usage: {argv[0]} <policy.json> <event.json>", file=sys.stderr)
        return 1
    try:
        policy = read_json(argv[1])
        event = read_json(argv[2])
        errors = validate_policy(policy) + validate_event(event)
        if errors:
            raise ValueError("; ".join(errors))
        verdict = evaluate(policy, event)
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    print(json.dumps(verdict, sort_keys=True))
    return 0 if verdict["verdict"] == "RETRY" else 4


if __name__ == "__main__":
    sys.exit(main(sys.argv))

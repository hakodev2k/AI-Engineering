#!/usr/bin/env python3
"""Workflow-level retry pressure circuit breaker for JSONL event traces."""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

RETRYABLE = {"429", "500", "502", "503", "504", "timeout", "connect_error"}


def load_json(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"config not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid config JSON: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("config must be an object")
    for key in ("window_events", "max_retryable_failures", "max_total_attempts", "half_open_probe_concurrency"):
        value = data.get(key)
        if isinstance(value, bool) or not isinstance(value, int) or value < 1:
            raise ValueError(f"{key} must be a positive integer")
    ratio = data.get("open_failure_ratio")
    if isinstance(ratio, bool) or not isinstance(ratio, (int, float)) or not (0 < ratio <= 1):
        raise ValueError("open_failure_ratio must be in (0,1]")
    floor = data.get("minimum_retry_delay_ms")
    if isinstance(floor, bool) or not isinstance(floor, int) or floor < 1:
        raise ValueError("minimum_retry_delay_ms must be a positive integer")
    return data


def load_events(path: Path) -> list[dict]:
    events = []
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except FileNotFoundError as exc:
        raise ValueError(f"events not found: {path}") from exc
    for line_no, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid JSONL line {line_no}: {exc}") from exc
        if not isinstance(event, dict):
            raise ValueError(f"line {line_no} must be an object")
        events.append(event)
    return events


def evaluate(cfg: dict, events: list[dict]) -> dict:
    attempts = len(events)
    recent = events[-cfg["window_events"]:]
    failures = [e for e in recent if str(e.get("outcome", "")) in RETRYABLE]
    retryable_count = len(failures)
    ratio = retryable_count / len(recent) if recent else 0.0
    zero_delay = sum(1 for e in failures if int(e.get("retry_delay_ms", 0) or 0) < cfg["minimum_retry_delay_ms"])
    if attempts >= cfg["max_total_attempts"] or retryable_count >= cfg["max_retryable_failures"] or (recent and ratio >= cfg["open_failure_ratio"]):
        state, code = "OPEN", 4
    elif retryable_count > 0:
        state, code = "HALF_OPEN", 3
    else:
        state, code = "CLOSED", 0
    return {
        "state": state,
        "exit_code": code,
        "total_attempts": attempts,
        "recent_events": len(recent),
        "recent_retryable_failures": retryable_count,
        "recent_failure_ratio": round(ratio, 6),
        "retry_delays_below_floor": zero_delay,
        "recommended_concurrency": cfg["half_open_probe_concurrency"] if state != "CLOSED" else None,
        "minimum_retry_delay_ms": cfg["minimum_retry_delay_ms"],
    }


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--config", required=True)
    p.add_argument("--events", required=True)
    args = p.parse_args()
    try:
        result = evaluate(load_json(Path(args.config)), load_events(Path(args.events)))
    except (OSError, ValueError, TypeError) as exc:
        print(json.dumps({"state": "ERROR", "error": str(exc)}))
        return 1
    print(json.dumps(result, sort_keys=True))
    return result["exit_code"]


if __name__ == "__main__":
    sys.exit(main())

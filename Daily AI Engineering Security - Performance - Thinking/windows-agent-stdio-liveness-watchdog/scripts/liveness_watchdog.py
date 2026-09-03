#!/usr/bin/env python3
"""Analyze Windows agent-child liveness samples without killing processes.

Input is JSON with `samples` (timestamp epoch seconds + cpu_percent),
`last_progress_timestamp`, optional `resume_timestamp`, and optional
`restart_attempts`. Exit: 0 healthy, 2 suspect, 3 restart recommended,
64 invalid input/config.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def load(path: str) -> dict:
    try:
        value = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError("JSON root must be an object")
    return value


def analyze(cfg: dict, state: dict) -> dict:
    for key in ("cpu_threshold_percent", "required_consecutive_high_cpu_samples", "max_progress_age_seconds", "post_resume_grace_seconds", "max_restart_attempts"):
        if key not in cfg:
            raise ValueError(f"missing config key: {key}")
    samples = state.get("samples")
    if not isinstance(samples, list) or not samples:
        raise ValueError("samples must be a non-empty list")
    normalized = []
    for item in samples:
        if not isinstance(item, dict) or "timestamp" not in item or "cpu_percent" not in item:
            raise ValueError("each sample needs timestamp and cpu_percent")
        ts, cpu = float(item["timestamp"]), float(item["cpu_percent"])
        if cpu < 0:
            raise ValueError("cpu_percent must be >= 0")
        normalized.append((ts, cpu))
    normalized.sort()
    now = normalized[-1][0]
    last_progress = float(state.get("last_progress_timestamp", now))
    progress_age = max(0.0, now - last_progress)
    resume = state.get("resume_timestamp")
    in_grace = resume is not None and now - float(resume) < float(cfg["post_resume_grace_seconds"])
    threshold = float(cfg["cpu_threshold_percent"])
    needed = int(cfg["required_consecutive_high_cpu_samples"])
    if needed < 1:
        raise ValueError("required_consecutive_high_cpu_samples must be >= 1")
    consecutive = 0
    for _, cpu in reversed(normalized):
        if cpu >= threshold:
            consecutive += 1
        else:
            break
    stale = progress_age >= float(cfg["max_progress_age_seconds"])
    attempts = int(state.get("restart_attempts", 0))
    max_attempts = int(cfg["max_restart_attempts"])

    if in_grace:
        status, reason = "healthy", "post_resume_grace"
    elif consecutive >= needed and stale:
        if attempts >= max_attempts:
            status, reason = "suspect", "restart_budget_exhausted"
        else:
            status, reason = "restart_recommended", "sustained_high_cpu_and_stale_progress"
    elif stale:
        status, reason = "suspect", "stale_progress_without_cpu_confirmation"
    elif consecutive >= needed:
        status, reason = "suspect", "high_cpu_but_progress_is_recent"
    else:
        status, reason = "healthy", "within_liveness_bounds"

    return {
        "status": status,
        "reason": reason,
        "progress_age_seconds": round(progress_age, 3),
        "consecutive_high_cpu_samples": consecutive,
        "restart_attempts": attempts,
        "max_restart_attempts": max_attempts,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    parser.add_argument("--state", required=True)
    args = parser.parse_args()
    try:
        result = analyze(load(args.config), load(args.state))
    except ValueError as exc:
        print(json.dumps({"status":"invalid","error":str(exc)}))
        return 64
    print(json.dumps(result, sort_keys=True))
    return {"healthy":0, "suspect":2, "restart_recommended":3}[result["status"]]


if __name__ == "__main__":
    sys.exit(main())

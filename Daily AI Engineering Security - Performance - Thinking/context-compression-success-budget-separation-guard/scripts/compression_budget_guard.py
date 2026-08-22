#!/usr/bin/env python3
"""Evaluate context-compression budget state from JSONL events.

Each event must contain:
  kind: "compression" or "model_result"
Compression events also require path (maintenance|reactive), before_tokens, after_tokens,
and status (completed|failed). Reactive events require error_id.
Model result events require status (success|error).

Exit codes: 0 continue, 2 invalid, 3 handoff/stop.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

CONTINUE, INVALID, STOP = 0, 2, 3


def load_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy must be a JSON object")
    return data


def load_events(path: Path) -> list[dict[str, Any]]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read events: {exc}") from exc
    events: list[dict[str, Any]] = []
    for index, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {index}: invalid JSON: {exc}") from exc
        if not isinstance(event, dict):
            raise ValueError(f"line {index}: event must be an object")
        events.append(event)
    if not events:
        raise ValueError("no events")
    return events


def positive_int(policy: dict[str, Any], key: str) -> int:
    value = policy.get(key)
    if not isinstance(value, int) or value < 1:
        raise ValueError(f"{key} must be a positive integer")
    return value


def analyze(events: list[dict[str, Any]], policy: dict[str, Any]) -> dict[str, Any]:
    min_progress = policy.get("minimum_progress_ratio", 0.05)
    if not isinstance(min_progress, (int, float)) or not 0 < float(min_progress) < 1:
        raise ValueError("minimum_progress_ratio must be between 0 and 1")
    min_progress = float(min_progress)
    max_failures = positive_int(policy, "max_consecutive_failures")
    max_reactive = positive_int(policy, "max_reactive_retries_per_error")
    max_total = positive_int(policy, "max_total_compression_events_per_turn")
    require_model_success = bool(policy.get("require_post_compression_model_success", True))

    failure_streak = 0
    total_compressions = 0
    verified_successes = 0
    pending_progress = False
    reactive_counts: dict[str, int] = {}
    decision = "continue"
    reason = "within_budget"

    for idx, event in enumerate(events, 1):
        kind = event.get("kind")
        if kind == "compression":
            path = event.get("path")
            status = event.get("status")
            if path not in {"maintenance", "reactive"}:
                raise ValueError(f"event {idx}: path must be maintenance|reactive")
            if status not in {"completed", "failed"}:
                raise ValueError(f"event {idx}: compression status must be completed|failed")
            before = event.get("before_tokens")
            after = event.get("after_tokens")
            if not isinstance(before, int) or before <= 0 or not isinstance(after, int) or after < 0:
                raise ValueError(f"event {idx}: invalid before_tokens/after_tokens")

            total_compressions += 1
            if total_compressions > max_total:
                decision = "handoff" if policy.get("handoff_on_absolute_cap", True) else "stop"
                reason = "absolute_compression_cap_exceeded"
                break

            if path == "reactive":
                error_id = event.get("error_id")
                if not isinstance(error_id, str) or not error_id:
                    raise ValueError(f"event {idx}: reactive compression requires error_id")
                reactive_counts[error_id] = reactive_counts.get(error_id, 0) + 1
                if reactive_counts[error_id] > max_reactive:
                    decision, reason = "stop", "reactive_retry_budget_exhausted"
                    break

            progress_ratio = max(0.0, (before - after) / before)
            materially_reduced = status == "completed" and progress_ratio >= min_progress
            pending_progress = materially_reduced
            if not materially_reduced:
                failure_streak += 1
                if failure_streak >= max_failures:
                    decision, reason = "stop", "consecutive_no_progress_failures"
                    break
            elif not require_model_success:
                verified_successes += 1
                if policy.get("allow_failure_streak_reset_after_verified_success", True):
                    failure_streak = 0

        elif kind == "model_result":
            status = event.get("status")
            if status not in {"success", "error"}:
                raise ValueError(f"event {idx}: model_result status must be success|error")
            if pending_progress:
                if status == "success":
                    verified_successes += 1
                    if policy.get("allow_failure_streak_reset_after_verified_success", True):
                        failure_streak = 0
                else:
                    failure_streak += 1
                    if failure_streak >= max_failures:
                        decision, reason = "stop", "post_compression_model_failures"
                        break
                pending_progress = False
        else:
            raise ValueError(f"event {idx}: kind must be compression|model_result")

    if decision == "continue" and pending_progress and require_model_success:
        reason = "awaiting_post_compression_model_result"

    return {
        "decision": decision,
        "reason": reason,
        "total_compressions": total_compressions,
        "verified_successful_maintenance": verified_successes,
        "consecutive_failures": failure_streak,
        "reactive_retry_counts": reactive_counts,
        "pending_progress_verification": pending_progress,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("events", type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    args = parser.parse_args()
    try:
        result = analyze(load_events(args.events), load_json(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2))
    return STOP if result["decision"] in {"stop", "handoff"} else CONTINUE


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Validate context-compaction retry/rearm behavior from an ordered JSONL trace."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def read_events(path: str) -> list[dict[str, Any]]:
    events: list[dict[str, Any]] = []
    try:
        for line_no, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
            if not line.strip():
                continue
            value = json.loads(line)
            if not isinstance(value, dict):
                raise ValueError(f"line {line_no} is not a JSON object")
            events.append(value)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"invalid trace: {exc}") from exc
    return events


def analyze(events: list[dict[str, Any]], max_failures: int) -> dict[str, Any]:
    failures = 0
    violations: list[dict[str, Any]] = []
    pending_progress: dict[str, Any] | None = None
    successful_rearms = 0

    for index, event in enumerate(events):
        kind = event.get("type")
        if kind == "compaction_result":
            before = event.get("before_tokens")
            after = event.get("after_tokens")
            threshold = event.get("threshold_tokens")
            outcome = event.get("outcome")
            if not all(isinstance(x, int) and x >= 0 for x in (before, after, threshold)):
                violations.append({"index": index, "reason": "invalid_token_telemetry"})
                pending_progress = None
                continue

            progressed = outcome == "success" and after < before
            cleared = after < threshold
            if progressed and cleared:
                pending_progress = {"index": index, "before": before, "after": after}
            else:
                pending_progress = None
                failures += 1
                if failures > max_failures:
                    violations.append({"index": index, "reason": "failure_budget_exceeded", "failures": failures})

        elif kind == "model_request":
            success = event.get("success") is True
            prompt_tokens = event.get("prompt_tokens")
            threshold = event.get("threshold_tokens")
            if pending_progress is not None:
                if success and isinstance(prompt_tokens, int) and isinstance(threshold, int) and prompt_tokens < threshold:
                    failures = 0
                    successful_rearms += 1
                    pending_progress = None
                elif success:
                    violations.append({"index": index, "reason": "progress_not_confirmed_below_threshold"})
                    pending_progress = None

        elif kind == "budget_rearm":
            if pending_progress is None:
                violations.append({"index": index, "reason": "unsafe_rearm_without_pending_progress"})

        elif kind == "turn_end":
            if event.get("reason") == "max_compression_attempts" and failures <= max_failures and successful_rearms > 0:
                violations.append({"index": index, "reason": "max_attempt_termination_after_verified_rearm"})

    return {
        "passed": not violations,
        "violations": violations,
        "successful_rearms": successful_rearms,
        "ending_failure_count": failures,
        "events": len(events),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--trace", required=True)
    parser.add_argument("--max-failures", type=int, default=3)
    args = parser.parse_args()
    if args.max_failures < 1:
        print(json.dumps({"passed": False, "reason": "max_failures_must_be_positive"}))
        return 3
    try:
        events = read_events(args.trace)
    except ValueError as exc:
        print(json.dumps({"passed": False, "reason": "invalid_input", "error": str(exc)}))
        return 3
    result = analyze(events, args.max_failures)
    print(json.dumps(result, sort_keys=True))
    return 0 if result["passed"] else 2


if __name__ == "__main__":
    sys.exit(main())

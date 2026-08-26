#!/usr/bin/env python3
"""Classify observable model responses and enforce bounded retry policy."""
import argparse
import json
import sys
from pathlib import Path

REQUIRED = (
    "finish_reason", "visible_content_chars", "tool_call_count",
    "reasoning_tokens", "output_tokens", "latency_ms", "attempt"
)


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def classify(event, policy):
    missing = [key for key in REQUIRED if key not in event]
    if missing:
        raise ValueError("missing fields: " + ",".join(missing))
    for key in ("visible_content_chars", "tool_call_count", "reasoning_tokens", "output_tokens", "latency_ms", "attempt"):
        if not isinstance(event[key], int) or event[key] < 0:
            raise ValueError(f"{key} must be a non-negative integer")

    attempt = event["attempt"]
    if attempt >= int(policy.get("max_total_model_attempts", 4)):
        return {"ok": False, "decision": "fail", "reason": "total_attempt_budget_exhausted"}

    visible = event["visible_content_chars"]
    tools = event["tool_call_count"]
    finish = event["finish_reason"]
    reasoning = event["reasoning_tokens"]
    output = event["output_tokens"]

    if finish == "length" and visible == 0 and tools == 0 and reasoning > 0:
        return {
            "ok": False,
            "decision": policy.get("reasoning_only_length_action", "stop_and_adjust_budget"),
            "reason": "reasoning_only_output_budget_exhaustion",
            "retry_recommended": False,
        }

    if visible == 0 and tools == 0 and output == 0 and reasoning == 0:
        retries = int(event.get("same_class_retry_count", 0))
        cap = int(policy.get("max_transient_empty_retries", 2))
        if retries < cap:
            return {
                "ok": False,
                "decision": policy.get("zero_usage_empty_action", "retry_transient"),
                "reason": "zero_usage_empty_response",
                "retry_recommended": True,
                "retries_remaining": cap - retries,
            }
        return {
            "ok": False,
            "decision": "fail",
            "reason": "transient_empty_retry_budget_exhausted",
            "retry_recommended": False,
        }

    if finish == "length" and (visible > 0 or tools > 0):
        retries = int(event.get("same_class_retry_count", 0))
        cap = int(policy.get("max_partial_continuations", 1))
        if retries < cap:
            return {
                "ok": False,
                "decision": "continue_partial",
                "reason": "partial_output_truncated",
                "retry_recommended": True,
                "retries_remaining": cap - retries,
            }
        return {
            "ok": False,
            "decision": "fail",
            "reason": "partial_continuation_budget_exhausted",
            "retry_recommended": False,
        }

    if visible > 0 or tools > 0:
        return {"ok": True, "decision": "accept", "reason": "usable_output"}

    return {
        "ok": False,
        "decision": "fail",
        "reason": "unclassified_empty_response",
        "retry_recommended": False,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--event", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = classify(load(args.event), load(args.policy))
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0 if result["ok"] else (4 if result.get("retry_recommended") else 3)
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

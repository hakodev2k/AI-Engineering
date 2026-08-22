#!/usr/bin/env python3
"""Validate terminal output admission and session integrity.

Trace example:
{
  "terminal_reason": "max_turns",
  "delivery_intended": true,
  "guardrail_verdict": "allow",
  "candidate_output_persisted_as_accepted": true,
  "session_items": [
    {"type":"function_call","call_id":"c1"},
    {"type":"function_call_output","call_id":"c1"},
    {"type":"assistant","accepted":true}
  ]
}

Exit codes: 0 allow, 2 invalid input/config, 3 block in --strict mode.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from typing import Any


def read_obj(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def analyze(trace: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    reason = trace.get("terminal_reason")
    if not isinstance(reason, str) or not reason:
        raise ValueError("terminal_reason is required")
    configured = set(policy.get("terminal_reasons", []))
    if configured and reason not in configured:
        raise ValueError(f"unsupported terminal_reason: {reason}")

    delivery = trace.get("delivery_intended")
    if not isinstance(delivery, bool):
        raise ValueError("delivery_intended must be boolean")

    verdict = trace.get("guardrail_verdict")
    allowed_verdicts = set(policy.get("allowed_guardrail_verdicts", ["allow", "block"]))
    violations: list[str] = []

    if delivery and policy.get("require_guardrail_verdict_for_all_terminal_outputs", True):
        if verdict not in allowed_verdicts:
            violations.append("missing_or_invalid_guardrail_verdict")
        elif verdict == "block":
            violations.append("blocked_output_must_not_be_delivered")

    if verdict == "block" and trace.get("candidate_output_persisted_as_accepted") is True:
        violations.append("rejected_output_persisted_as_accepted")

    items = trace.get("session_items", [])
    if not isinstance(items, list):
        raise ValueError("session_items must be a list")
    calls: dict[str, int] = {}
    outputs: dict[str, int] = {}
    for index, item in enumerate(items):
        if not isinstance(item, dict):
            raise ValueError(f"session_items[{index}] must be an object")
        typ = item.get("type")
        call_id = item.get("call_id")
        if typ in {"function_call", "function_call_output"}:
            if not isinstance(call_id, str) or not call_id:
                raise ValueError(f"session_items[{index}].call_id required for {typ}")
            target = calls if typ == "function_call" else outputs
            target[call_id] = target.get(call_id, 0) + 1

    orphan_calls = sorted(call_id for call_id, count in calls.items() if outputs.get(call_id, 0) != count)
    orphan_outputs = sorted(call_id for call_id, count in outputs.items() if calls.get(call_id, 0) != count)
    if policy.get("require_terminal_session_integrity", True) and (orphan_calls or orphan_outputs):
        violations.append("tool_call_output_pairing_violation")

    return {
        "decision": "block" if violations else "allow",
        "terminal_reason": reason,
        "guardrail_verdict": verdict,
        "orphan_calls": orphan_calls,
        "orphan_outputs": orphan_outputs,
        "violations": violations,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("trace", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    try:
        report = analyze(read_obj(args.trace), read_obj(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 3 if args.strict and report["decision"] == "block" else 0


if __name__ == "__main__":
    raise SystemExit(main())

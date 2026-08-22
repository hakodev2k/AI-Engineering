#!/usr/bin/env python3
"""Validate terminal agent-session integrity without replaying tools.

Expected JSON object:
{
  "terminal_reason": "success|guardrail_tripwire|guardrail_exception|max_turns|cancellation|failure",
  "guardrail_status": "none|allow|tripwire|exception",
  "items": [
    {"type":"function_call","call_id":"c1","side_effecting":true,"executed":true},
    {"type":"function_call_output","call_id":"c1","content":"...","commit_evidence":true}
  ]
}

Exit: 0 valid, 2 invalid input/config, 3 integrity violation, 4 manual review.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

VALID_REASONS = {"success", "guardrail_tripwire", "guardrail_exception", "max_turns", "cancellation", "failure"}
VALID_TYPES = {"user", "assistant", "function_call", "function_call_output", "reasoning", "metadata"}


def load(path: Path) -> dict[str, Any]:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return obj


def normalize_items(items: list[dict[str, Any]]) -> list[tuple[str, str, str]]:
    normalized: list[tuple[str, str, str]] = []
    for item in items:
        typ = item.get("type")
        call_id = item.get("call_id", "")
        content = item.get("content", "")
        if isinstance(content, (dict, list)):
            content = json.dumps(content, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
        normalized.append((str(typ), str(call_id), str(content)))
    return normalized


def analyze(session: dict[str, Any], policy: dict[str, Any], compare: dict[str, Any] | None = None) -> tuple[dict[str, Any], int]:
    reason = session.get("terminal_reason")
    if policy.get("require_terminal_reason", True) and reason not in VALID_REASONS:
        raise ValueError("terminal_reason missing or unsupported")
    guardrail_status = session.get("guardrail_status", "none")
    if guardrail_status not in {"none", "allow", "tripwire", "exception"}:
        raise ValueError("guardrail_status unsupported")
    items = session.get("items")
    if not isinstance(items, list):
        raise ValueError("items must be a list")
    typed: list[dict[str, Any]] = []
    for i, item in enumerate(items):
        if not isinstance(item, dict):
            raise ValueError(f"items[{i}] must be an object")
        typ = item.get("type")
        if typ not in VALID_TYPES:
            raise ValueError(f"items[{i}].type unsupported")
        typed.append(item)

    calls: dict[str, dict[str, Any]] = {}
    outputs: dict[str, list[dict[str, Any]]] = {}
    violations: list[str] = []
    manual: list[str] = []

    for item in typed:
        typ = item["type"]
        if typ == "function_call":
            call_id = item.get("call_id")
            if not isinstance(call_id, str) or not call_id:
                raise ValueError("function_call requires call_id")
            if call_id in calls:
                violations.append(f"duplicate function_call:{call_id}")
            calls[call_id] = item
        elif typ == "function_call_output":
            call_id = item.get("call_id")
            if not isinstance(call_id, str) or not call_id:
                raise ValueError("function_call_output requires call_id")
            outputs.setdefault(call_id, []).append(item)

    for call_id, call in calls.items():
        matched = outputs.get(call_id, [])
        if len(matched) == 0:
            if call.get("executed") is True and call.get("side_effecting") is True:
                manual.append(f"executed side effect lacks durable output:{call_id}")
            elif policy.get("allow_orphan_calls", False) is not True:
                violations.append(f"orphan function_call:{call_id}")
        elif len(matched) > 1:
            violations.append(f"multiple outputs for call:{call_id}")
        if call.get("executed") is True and call.get("side_effecting") is True and matched:
            if policy.get("require_side_effect_commit_evidence", True) and matched[0].get("commit_evidence") is not True:
                manual.append(f"side-effect commit evidence missing:{call_id}")

    for call_id, matched in outputs.items():
        if call_id not in calls and policy.get("allow_orphan_outputs", False) is not True:
            violations.append(f"orphan function_call_output:{call_id}")

    if guardrail_status == "tripwire" and reason == "guardrail_tripwire":
        marker = str(policy.get("blocked_output_marker", "Output withheld by an output guardrail."))
        if policy.get("require_redaction_marker_for_blocked_terminal_tool_output", True):
            for call_id, call in calls.items():
                if call.get("terminal_output") is True and outputs.get(call_id):
                    content = outputs[call_id][0].get("content")
                    if content != marker:
                        violations.append(f"blocked terminal tool output not redacted:{call_id}")

    parity = None
    if compare is not None and policy.get("require_streaming_parity_when_comparison_supplied", True):
        other_items = compare.get("items")
        if not isinstance(other_items, list) or not all(isinstance(x, dict) for x in other_items):
            raise ValueError("comparison items must be a list of objects")
        parity = normalize_items(typed) == normalize_items(other_items)
        if not parity:
            violations.append("normalized streaming/non-streaming history mismatch")

    verdict = "valid"
    code = 0
    if manual:
        verdict, code = "manual_review", 4
    if violations:
        verdict, code = "invalid", 3
    return {
        "verdict": verdict,
        "terminal_reason": reason,
        "guardrail_status": guardrail_status,
        "call_count": len(calls),
        "output_count": sum(len(v) for v in outputs.values()),
        "violations": violations,
        "manual_review_reasons": manual,
        "comparison_parity": parity,
        "automatic_side_effect_replay_performed": False
    }, code


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("session", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    ap.add_argument("--compare", type=Path)
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()
    try:
        report, code = analyze(load(args.session), load(args.policy), load(args.compare) if args.compare else None)
    except (ValueError, TypeError) as exc:
        print(json.dumps({"verdict": "invalid_input", "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return code if args.strict else (0 if code == 4 else code)


if __name__ == "__main__":
    raise SystemExit(main())

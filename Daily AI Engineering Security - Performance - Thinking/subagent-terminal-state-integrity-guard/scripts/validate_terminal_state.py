#!/usr/bin/env python3
"""Validate whether a delegated agent result is safe to accept.

Input JSON example:
{
  "status": "completed",
  "terminal_reason": "end_turn",
  "result": "Complete findings...",
  "tool_calls": [{"id": "t1", "requires_result": true}],
  "tool_results": [{"tool_call_id": "t1"}],
  "required_result_min_chars": 20,
  "required_result_contains": ["findings"],
  "required_artifacts": [
    {"path": "report.json", "min_bytes": 10, "contains": ["verified"]}
  ]
}
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

BAD_TERMINAL_TOKENS = {
    "tool_deferred", "limit", "cancel", "cancelled", "canceled", "interrupt",
    "interrupted", "timeout", "timed_out", "error", "failed", "failure",
    "max_tokens", "context_limit", "usage_limit"
}
NATURAL_TERMINAL = {"", "end_turn", "stop", "completed", "success"}


def fail(message: str, code: int = 2) -> int:
    print(json.dumps({"decision": "needs_review", "reasons": [message]}, ensure_ascii=False))
    return code


def load_state(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict):
        raise ValueError("top-level JSON must be an object")
    return data


def artifact_issues(spec: dict[str, Any], base: Path) -> list[str]:
    issues: list[str] = []
    raw_path = spec.get("path")
    if not isinstance(raw_path, str) or not raw_path:
        return ["artifact spec missing non-empty path"]
    p = Path(raw_path)
    if not p.is_absolute():
        p = base / p
    try:
        p = p.resolve(strict=False)
        base_resolved = base.resolve(strict=False)
        # Absolute paths are allowed only when explicitly requested as absolute in input.
        if not Path(raw_path).is_absolute() and base_resolved not in p.parents and p != base_resolved:
            return [f"artifact escapes state directory: {raw_path}"]
    except OSError as e:
        return [f"artifact path resolution failed for {raw_path}: {e}"]
    if not p.is_file():
        return [f"required artifact missing: {raw_path}"]
    try:
        size = p.stat().st_size
    except OSError as e:
        return [f"cannot stat artifact {raw_path}: {e}"]
    min_bytes = spec.get("min_bytes", 1)
    if not isinstance(min_bytes, int) or min_bytes < 0:
        issues.append(f"invalid min_bytes for {raw_path}")
    elif size < min_bytes:
        issues.append(f"artifact too small: {raw_path} ({size} < {min_bytes})")
    contains = spec.get("contains", [])
    if contains:
        if not isinstance(contains, list) or not all(isinstance(x, str) for x in contains):
            issues.append(f"invalid contains list for {raw_path}")
        else:
            try:
                text = p.read_text(encoding="utf-8")
            except (OSError, UnicodeDecodeError) as e:
                issues.append(f"cannot read text artifact {raw_path}: {e}")
            else:
                for marker in contains:
                    if marker not in text:
                        issues.append(f"artifact {raw_path} missing marker: {marker}")
    return issues


def validate(state: dict[str, Any], state_dir: Path) -> tuple[str, list[str]]:
    reasons: list[str] = []
    status = str(state.get("status", "")).strip().lower()
    terminal = str(state.get("terminal_reason", "")).strip().lower()

    if status not in {"completed", "success", "succeeded", "done"}:
        reasons.append(f"non-success lifecycle status: {status or '<missing>'}")

    if terminal and terminal not in NATURAL_TERMINAL:
        if any(token in terminal for token in BAD_TERMINAL_TOKENS):
            reasons.append(f"blocking terminal reason: {terminal}")
        else:
            reasons.append(f"unknown terminal reason: {terminal}")

    calls = state.get("tool_calls", [])
    results = state.get("tool_results", [])
    if not isinstance(calls, list) or not isinstance(results, list):
        reasons.append("tool_calls/tool_results must be arrays")
    else:
        result_ids = {
            str(r.get("tool_call_id")) for r in results
            if isinstance(r, dict) and r.get("tool_call_id") is not None
        }
        seen_call_ids: set[str] = set()
        for call in calls:
            if not isinstance(call, dict):
                reasons.append("invalid tool call entry")
                continue
            cid_raw = call.get("id")
            if cid_raw is None:
                reasons.append("tool call missing id")
                continue
            cid = str(cid_raw)
            if cid in seen_call_ids:
                reasons.append(f"duplicate tool call id: {cid}")
            seen_call_ids.add(cid)
            if call.get("requires_result", True) and cid not in result_ids:
                reasons.append(f"unmatched tool call: {cid}")

    result = state.get("result", "")
    if result is None:
        result = ""
    if not isinstance(result, str):
        reasons.append("result must be a string")
        result = ""
    min_chars = state.get("required_result_min_chars", 1)
    if not isinstance(min_chars, int) or min_chars < 0:
        reasons.append("required_result_min_chars must be a non-negative integer")
    elif len(result.strip()) < min_chars:
        reasons.append(f"result too short: {len(result.strip())} < {min_chars}")

    markers = state.get("required_result_contains", [])
    if not isinstance(markers, list) or not all(isinstance(x, str) for x in markers):
        reasons.append("required_result_contains must be an array of strings")
    else:
        for marker in markers:
            if marker not in result:
                reasons.append(f"result missing marker: {marker}")

    artifacts = state.get("required_artifacts", [])
    if not isinstance(artifacts, list):
        reasons.append("required_artifacts must be an array")
    else:
        for spec in artifacts:
            if not isinstance(spec, dict):
                reasons.append("invalid artifact spec")
            else:
                reasons.extend(artifact_issues(spec, state_dir))

    if reasons:
        explicit_failure = status in {"failed", "error", "cancelled", "canceled"} or any(
            r.startswith("blocking terminal reason") for r in reasons
        )
        return ("failed" if explicit_failure else "incomplete", reasons)
    return "accepted", []


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--state", required=True, help="Path to child-state JSON")
    args = parser.parse_args()
    state_path = Path(args.state)
    if not state_path.is_file():
        return fail(f"state file not found: {state_path}")
    try:
        state = load_state(state_path)
        decision, reasons = validate(state, state_path.parent)
    except (OSError, ValueError, json.JSONDecodeError) as e:
        return fail(str(e))
    print(json.dumps({"decision": decision, "reasons": reasons}, ensure_ascii=False, sort_keys=True))
    return 0 if decision == "accepted" else 1


if __name__ == "__main__":
    sys.exit(main())

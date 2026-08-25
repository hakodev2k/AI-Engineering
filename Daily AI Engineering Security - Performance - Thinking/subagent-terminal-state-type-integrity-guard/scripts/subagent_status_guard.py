#!/usr/bin/env python3
"""Reject unsupported subagent success/completed classifications."""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

SUCCESS_LABELS = {"success", "completed"}
VALID_STATUS = SUCCESS_LABELS | {"incomplete", "failed", "cancelled", "pending", "unknown"}
VALID_STATES = {"completed", "tool_deferred", "limit", "cancelled", "failed", "interrupted", "timeout", "pending", "unknown"}
ADVERSE_REASON_TOKENS = {"defer", "limit", "max_turn", "max turn", "usage", "cancel", "interrupt", "fail", "timeout", "error", "unknown"}
REQUIRED = {"child_id", "task_id", "dispatch_generation", "status", "terminal_state", "terminal_reason", "result_present", "unresolved_tool_calls", "live_descendants"}


def _nonneg_int(value):
    return isinstance(value, int) and not isinstance(value, bool) and value >= 0


def validate_event(e: dict, line_no: int) -> list[dict]:
    child = str(e.get("child_id", f"line:{line_no}"))
    out: list[dict] = []
    missing = sorted(REQUIRED - e.keys())
    if missing:
        return [{"child_id": child, "code": "missing_fields", "detail": missing}]
    if not str(e["child_id"]).strip() or not str(e["task_id"]).strip():
        out.append({"child_id": child, "code": "empty_identity"})
    if e["status"] not in VALID_STATUS:
        out.append({"child_id": child, "code": "invalid_status", "detail": e["status"]})
    if e["terminal_state"] not in VALID_STATES:
        out.append({"child_id": child, "code": "invalid_terminal_state", "detail": e["terminal_state"]})
    for field in ("dispatch_generation", "unresolved_tool_calls", "live_descendants"):
        if not _nonneg_int(e[field]):
            out.append({"child_id": child, "code": "invalid_nonnegative_integer", "detail": field})
    if not isinstance(e["result_present"], bool):
        out.append({"child_id": child, "code": "result_present_not_boolean"})

    if e["status"] in SUCCESS_LABELS:
        if e["terminal_state"] != "completed":
            out.append({"child_id": child, "code": "success_noncompleted_terminal", "detail": e["terminal_state"]})
        reason = str(e["terminal_reason"]).lower().replace("-", "_")
        if any(token in reason for token in ADVERSE_REASON_TOKENS):
            out.append({"child_id": child, "code": "success_adverse_terminal_reason", "detail": e["terminal_reason"]})
        if e["result_present"] is not True or not str(e.get("result_id", "")).strip():
            out.append({"child_id": child, "code": "success_missing_deliverable"})
        if e["unresolved_tool_calls"] != 0:
            out.append({"child_id": child, "code": "success_with_unresolved_tools", "detail": e["unresolved_tool_calls"]})
        if e["live_descendants"] != 0:
            out.append({"child_id": child, "code": "success_with_live_descendants", "detail": e["live_descendants"]})
    current = e.get("current_dispatch_generation")
    if current is not None:
        if not _nonneg_int(current):
            out.append({"child_id": child, "code": "invalid_current_generation"})
        elif e["dispatch_generation"] != current:
            out.append({"child_id": child, "code": "stale_dispatch_generation", "detail": {"event": e["dispatch_generation"], "current": current}})
    return out


def validate_file(path: Path) -> dict:
    violations = []
    total = 0
    seen = set()
    with path.open("r", encoding="utf-8") as f:
        for n, raw in enumerate(f, 1):
            if not raw.strip():
                continue
            try:
                e = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise ValueError(f"line {n}: invalid JSON: {exc}") from exc
            if not isinstance(e, dict):
                raise ValueError(f"line {n}: event must be an object")
            total += 1
            identity = (str(e.get("child_id", "")), str(e.get("task_id", "")), e.get("dispatch_generation"))
            if identity in seen:
                violations.append({"child_id": str(e.get("child_id", "")), "code": "duplicate_terminal_event", "detail": identity})
            seen.add(identity)
            violations.extend(validate_event(e, n))
    if total == 0:
        raise ValueError("no events found")
    return {"events": total, "violations": violations, "verified": not violations}


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("input", type=Path)
    p.add_argument("--json", dest="json_output", type=Path)
    a = p.parse_args()
    try:
        if not a.input.is_file():
            raise ValueError(f"input file not found: {a.input}")
        report = validate_file(a.input)
        text = json.dumps(report, indent=2, sort_keys=True)
        if a.json_output:
            a.json_output.parent.mkdir(parents=True, exist_ok=True)
            a.json_output.write_text(text + "\n", encoding="utf-8")
        print(text)
        return 0 if report["verified"] else 2
    except (OSError, ValueError) as exc:
        print(f"subagent_status_guard: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Compute phase-separated latency for approval-gated agent tool calls."""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

REQUIRED = ["call_created_ms", "execution_start_ms", "execution_end_ms"]
OPTIONAL = ["approval_requested_ms", "approval_resolved_ms", "continuation_end_ms"]


def _num(doc: dict, key: str):
    value = doc.get(key)
    if value is None:
        return None
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"{key} must be a number or null")
    return float(value)


def profile(doc: dict) -> dict:
    for key in REQUIRED:
        if key not in doc:
            raise ValueError(f"missing required field: {key}")
    values = {k: _num(doc, k) for k in REQUIRED + OPTIONAL}
    c = values["call_created_ms"]
    es = values["execution_start_ms"]
    ee = values["execution_end_ms"]
    arq = values["approval_requested_ms"]
    ars = values["approval_resolved_ms"]
    ce = values["continuation_end_ms"]
    errors: list[str] = []
    warnings: list[str] = []

    if es < c:
        errors.append("execution_start_ms precedes call_created_ms")
    if ee < es:
        errors.append("execution_end_ms precedes execution_start_ms")
    if (arq is None) != (ars is None):
        errors.append("approval_requested_ms and approval_resolved_ms must be provided together")
    approval_wait = 0.0
    if arq is not None and ars is not None:
        if arq < c:
            errors.append("approval_requested_ms precedes call_created_ms")
        if ars < arq:
            errors.append("approval_resolved_ms precedes approval_requested_ms")
        if es < ars:
            errors.append("execution_start_ms precedes approval resolution")
        approval_wait = max(0.0, ars - arq)
    else:
        warnings.append("no approval phase recorded; do not infer approval wait from wall-clock time")

    execution = max(0.0, ee - es)
    continuation = None
    if ce is not None:
        if ce < ee:
            errors.append("continuation_end_ms precedes execution_end_ms")
        else:
            continuation = ce - ee
    wall_end = ce if ce is not None else ee
    wall = max(0.0, wall_end - c)
    unattributed = wall - approval_wait - execution - (continuation or 0.0)
    if unattributed > 1.0:
        warnings.append(f"{unattributed:.3f} ms remains unattributed to approval/execution/continuation")

    return {
        "ok": not errors,
        "call_id": doc.get("call_id"),
        "approval_wait_ms": approval_wait,
        "tool_execution_ms": execution,
        "continuation_ms": continuation,
        "wall_clock_ms": wall,
        "unattributed_ms": max(0.0, unattributed),
        "execution_evidence_valid": not errors,
        "errors": errors,
        "warnings": warnings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Profile approval, execution, and continuation latency phases")
    parser.add_argument("input", type=Path, help="JSON event/timestamp document")
    parser.add_argument("--pretty", action="store_true")
    args = parser.parse_args()
    try:
        doc = json.loads(args.input.read_text(encoding="utf-8"))
        if not isinstance(doc, dict):
            raise ValueError("input JSON must be an object")
        result = profile(doc)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"ok": False, "errors": [str(exc)]}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2 if args.pretty else None, sort_keys=True))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

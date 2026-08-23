#!/usr/bin/env python3
"""Validate one-to-one terminal accounting for a tool-call turn.
Exit 0=complete, 2=invalid input, 3=block.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from typing import Any

TERMINAL = {"success", "error", "rejected", "cancelled"}


def load(path: Path) -> dict[str, Any]:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError("input must be a JSON object")
    return obj


def validate(data: dict[str, Any]) -> dict[str, Any]:
    calls = data.get("calls")
    if not isinstance(calls, list) or not calls:
        raise ValueError("calls must be a non-empty list")
    ids: list[str] = []
    terminal_counts: dict[str, int] = {}
    missing: list[str] = []
    duplicates: list[str] = []
    contradictions: list[str] = []
    state_mismatch: list[str] = []

    for row in calls:
        if not isinstance(row, dict):
            raise ValueError("each call must be an object")
        cid = row.get("call_id")
        if not isinstance(cid, str) or not cid:
            raise ValueError("call_id must be a non-empty string")
        ids.append(cid)
        dispositions = row.get("terminal_dispositions", [])
        if not isinstance(dispositions, list) or not all(isinstance(x, str) for x in dispositions):
            raise ValueError(f"{cid}: terminal_dispositions must be string list")
        terminal = [x for x in dispositions if x in TERMINAL]
        terminal_counts[cid] = len(terminal)
        deferred = row.get("interrupted") is True
        if len(terminal) == 0 and not deferred:
            missing.append(cid)
        if len(terminal) > 1:
            duplicates.append(cid)
        if row.get("rejected") is True and "success" in terminal:
            contradictions.append(cid)
        if row.get("persisted") is True and row.get("sent") is not True and row.get("provider_acknowledged") is True:
            state_mismatch.append(cid)

    duplicate_ids = sorted({x for x in ids if ids.count(x) > 1})
    violations = []
    if duplicate_ids: violations.append({"duplicate_call_ids": duplicate_ids})
    if missing: violations.append({"missing_terminal": sorted(missing)})
    if duplicates: violations.append({"duplicate_terminal": sorted(duplicates)})
    if contradictions: violations.append({"rejected_marked_success": sorted(contradictions)})
    if state_mismatch: violations.append({"sent_state_mismatch": sorted(state_mismatch)})

    return {
        "decision": "complete" if not violations else "block",
        "expected_calls": len(ids),
        "terminal_counts": terminal_counts,
        "violations": violations,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("ledger", type=Path)
    args = ap.parse_args()
    try:
        report = validate(load(args.ledger))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0 if report["decision"] == "complete" else 3


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Deterministically validate critical task-state invariants across compaction.

Exit codes: 0 allow, 2 invalid input/config, 3 block.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from typing import Any

ALLOW = 0
INVALID = 2
BLOCK = 3


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def as_set(value: Any, field: str) -> set[str]:
    if not isinstance(value, list) or not all(isinstance(x, str) and x for x in value):
        raise ValueError(f"{field} must be an array of non-empty strings")
    return set(value)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--before", required=True, type=Path)
    parser.add_argument("--after", required=True, type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    args = parser.parse_args()

    try:
        before = load_json(args.before)
        after = load_json(args.after)
        policy = load_json(args.policy)
        required = policy.get("required_fields", [])
        set_fields = set(policy.get("set_fields", []))
        immutable = set(policy.get("immutable_fields", []))
        if not isinstance(required, list) or not all(isinstance(x, str) for x in required):
            raise ValueError("required_fields must be an array of strings")
        findings: list[dict[str, Any]] = []

        for field in required:
            if field not in before:
                findings.append({"type": "baseline_missing", "field": field})
            if field not in after:
                findings.append({"type": "post_missing", "field": field})

        for field in immutable:
            if field in before and field in after and before[field] != after[field]:
                findings.append({"type": "immutable_changed", "field": field,
                                 "before": before[field], "after": after[field]})

        if not policy.get("allow_goal_change", False):
            if before.get("active_goal") != after.get("active_goal"):
                findings.append({"type": "goal_changed", "field": "active_goal",
                                 "before": before.get("active_goal"), "after": after.get("active_goal")})

        for field in set_fields:
            if field not in before or field not in after:
                continue
            bset, aset = as_set(before[field], field), as_set(after[field], field)
            dropped = sorted(bset - aset)
            added = sorted(aset - bset)
            if field in {"constraints", "verification_requirements"} and (dropped or added):
                findings.append({"type": "protected_set_changed", "field": field,
                                 "dropped": dropped, "added": added})

        b_completed = as_set(before.get("completed_items", []), "completed_items")
        a_completed = as_set(after.get("completed_items", []), "completed_items")
        b_pending = as_set(before.get("pending_items", []), "pending_items")
        a_pending = as_set(after.get("pending_items", []), "pending_items")

        regressed = sorted(b_completed & a_pending)
        if regressed and not policy.get("allow_completed_to_pending", False):
            findings.append({"type": "completed_regressed_to_pending", "items": regressed})

        new_completed = sorted(a_completed - b_completed)
        if new_completed and not policy.get("allow_new_completed_items", False):
            findings.append({"type": "unsupported_new_completed", "items": new_completed})

        vanished_pending = sorted(b_pending - a_pending - a_completed)
        if vanished_pending:
            findings.append({"type": "pending_items_vanished", "items": vanished_pending})

        if before.get("approval_state") != after.get("approval_state"):
            approval_event = after.get("approval_event_id")
            if policy.get("allow_approval_change_without_event", False) is False and not (
                isinstance(approval_event, str) and approval_event.strip()
            ):
                findings.append({"type": "approval_changed_without_event",
                                 "before": before.get("approval_state"),
                                 "after": after.get("approval_state")})

        decision = "allow" if not findings else "block"
        result = {"decision": decision, "finding_count": len(findings), "findings": findings}
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return ALLOW if not findings else BLOCK
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())

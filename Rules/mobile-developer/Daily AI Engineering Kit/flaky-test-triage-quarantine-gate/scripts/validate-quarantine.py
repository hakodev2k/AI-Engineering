#!/usr/bin/env python3
"""Validate a flaky-test quarantine registry against policy.

No third-party packages are required.

Usage:
  python validate-quarantine.py --registry test-quarantine.json --policy config/flaky-test-policy.json

Exit codes:
  0 valid
  1 policy violations found
  2 invalid arguments / unreadable input
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date, datetime
from pathlib import Path

REQUIRED_FIELDS = {
    "test_id",
    "classification",
    "owner",
    "issue",
    "created_on",
    "expires_on",
    "evidence",
    "critical_path",
}


def load_json(path: str):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"Cannot read JSON {path}: {exc}") from exc


def parse_iso_date(value: str, field: str, test_id: str) -> date:
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{test_id}: {field} must use YYYY-MM-DD") from exc


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--registry", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--today", help="Override current date with YYYY-MM-DD for deterministic CI tests")
    args = parser.parse_args()

    try:
        registry = load_json(args.registry)
        policy = load_json(args.policy)
        today = datetime.strptime(args.today, "%Y-%m-%d").date() if args.today else date.today()
    except ValueError as exc:
        print(exc, file=sys.stderr)
        return 2

    if not isinstance(registry, dict) or not isinstance(registry.get("entries"), list):
        print("Registry must be an object with an 'entries' array", file=sys.stderr)
        return 2

    allowed = set(policy.get("allowed_quarantine_classifications", []))
    forbidden = set(policy.get("forbidden_quarantine_classifications", []))
    max_days = int(policy.get("max_quarantine_days", 0))
    require_critical_approval = bool(policy.get("require_human_approval_for_critical_path", True))

    violations = []
    seen = set()

    for index, entry in enumerate(registry["entries"]):
        if not isinstance(entry, dict):
            violations.append(f"entry[{index}]: must be an object")
            continue

        test_id = str(entry.get("test_id", f"entry[{index}]")).strip() or f"entry[{index}]"
        missing = sorted(REQUIRED_FIELDS - set(entry))
        if missing:
            violations.append(f"{test_id}: missing required fields: {', '.join(missing)}")
            continue

        if test_id in seen:
            violations.append(f"{test_id}: duplicate test_id")
        seen.add(test_id)

        classification = entry.get("classification")
        if classification in forbidden:
            violations.append(f"{test_id}: forbidden classification '{classification}'")
        elif classification not in allowed:
            violations.append(f"{test_id}: classification '{classification}' is not allowed by policy")

        if not str(entry.get("owner", "")).strip():
            violations.append(f"{test_id}: owner must be non-empty")
        if not str(entry.get("issue", "")).strip():
            violations.append(f"{test_id}: issue must be non-empty")

        evidence = entry.get("evidence")
        if not isinstance(evidence, list) or not evidence or any(not str(x).strip() for x in evidence):
            violations.append(f"{test_id}: evidence must be a non-empty array of references")

        try:
            created = parse_iso_date(entry.get("created_on"), "created_on", test_id)
            expires = parse_iso_date(entry.get("expires_on"), "expires_on", test_id)
            if expires < created:
                violations.append(f"{test_id}: expires_on precedes created_on")
            if expires < today:
                violations.append(f"{test_id}: quarantine expired on {expires.isoformat()}")
            if max_days > 0 and (expires - created).days > max_days:
                violations.append(
                    f"{test_id}: quarantine horizon {(expires - created).days} days exceeds policy max {max_days}"
                )
        except ValueError as exc:
            violations.append(str(exc))

        critical = entry.get("critical_path")
        if not isinstance(critical, bool):
            violations.append(f"{test_id}: critical_path must be boolean")
        elif critical and require_critical_approval:
            approval = entry.get("approval")
            if not isinstance(approval, dict):
                violations.append(f"{test_id}: critical-path quarantine requires approval object")
            else:
                if not str(approval.get("approved_by", "")).strip():
                    violations.append(f"{test_id}: approval.approved_by is required")
                if not str(approval.get("reference", "")).strip():
                    violations.append(f"{test_id}: approval.reference is required")

    if violations:
        print("Quarantine registry validation failed:", file=sys.stderr)
        for item in violations:
            print(f"- {item}", file=sys.stderr)
        return 1

    print(f"Quarantine registry valid: {len(registry['entries'])} entries checked as of {today.isoformat()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

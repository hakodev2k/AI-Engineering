#!/usr/bin/env python3
"""Validate the core contract of an account-health JSON document.
Exit codes: 0 valid, 1 validation failure, 2 file/parse failure.
Uses only the Python standard library.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

STATUSES = {"healthy", "watch", "at-risk", "critical", "unknown"}
CONFIDENCE = {"low", "medium", "high"}
DIMENSIONS = ("value", "adoption", "technical", "stakeholder", "delivery")


def fail(message: str, code: int = 1) -> int:
    print(f"ERROR: {message}", file=sys.stderr)
    return code


def validate(data: object) -> list[str]:
    errors: list[str] = []
    if not isinstance(data, dict):
        return ["root must be an object"]
    for key in ("account", "as_of", "dimensions", "risks", "actions"):
        if key not in data:
            errors.append(f"missing required field: {key}")
    if not isinstance(data.get("account"), str) or not data.get("account", "").strip():
        errors.append("account must be a non-empty string")
    dimensions = data.get("dimensions")
    if isinstance(dimensions, dict):
        for name in DIMENSIONS:
            item = dimensions.get(name)
            if not isinstance(item, dict):
                errors.append(f"dimensions.{name} must be an object")
                continue
            if item.get("status") not in STATUSES:
                errors.append(f"dimensions.{name}.status is invalid")
            if item.get("confidence") not in CONFIDENCE:
                errors.append(f"dimensions.{name}.confidence is invalid")
            evidence = item.get("evidence")
            if not isinstance(evidence, list) or not evidence or not all(isinstance(x, str) and x.strip() for x in evidence):
                errors.append(f"dimensions.{name}.evidence must be a non-empty string array")
    elif dimensions is not None:
        errors.append("dimensions must be an object")
    for field in ("risks", "actions"):
        if field in data and not isinstance(data[field], list):
            errors.append(f"{field} must be an array")
    return errors


def main() -> int:
    if len(sys.argv) != 2:
        return fail("usage: validate-account-health.py <account-health.json>", 2)
    path = Path(sys.argv[1])
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return fail(str(exc), 2)
    errors = validate(data)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print("Account health document is valid.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

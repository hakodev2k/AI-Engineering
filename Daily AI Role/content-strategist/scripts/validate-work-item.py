#!/usr/bin/env python3
"""Validate a Content Strategist work-item JSON file.
Exit codes: 0 valid, 1 validation failure, 2 read/parse error.
Uses only the Python standard library.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path
from datetime import datetime

REQUIRED = ["id", "title", "status", "owner", "objective", "audience", "desiredAction", "priority", "deadline", "outputs", "verification"]
STATUSES = {"intake", "research", "briefed", "drafting", "review", "approved", "scheduled", "published", "measuring", "refresh", "retired", "blocked", "escalated"}
PRIORITIES = {"critical", "high", "medium", "low"}
CLAIM_STATUSES = {"verified", "unverified", "conflicted", "stale"}


def fail(errors: list[str]) -> int:
    for e in errors:
        print(f"ERROR: {e}", file=sys.stderr)
    return 1


def nonempty(value) -> bool:
    return isinstance(value, str) and bool(value.strip())


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: validate-work-item.py <work-item.json>", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: cannot read/parse {path}: {exc}", file=sys.stderr)
        return 2
    if not isinstance(data, dict):
        return fail(["root must be a JSON object"])

    errors: list[str] = []
    for key in REQUIRED:
        if key not in data:
            errors.append(f"missing required field: {key}")
    for key in ["id", "title", "owner", "objective", "audience", "desiredAction"]:
        if key in data and not nonempty(data[key]):
            errors.append(f"{key} must be a non-empty string")
    if data.get("status") not in STATUSES:
        errors.append(f"status must be one of {sorted(STATUSES)}")
    if data.get("priority") not in PRIORITIES:
        errors.append(f"priority must be one of {sorted(PRIORITIES)}")
    if "deadline" in data:
        try:
            datetime.fromisoformat(str(data["deadline"]).replace("Z", "+00:00"))
        except ValueError:
            errors.append("deadline must be ISO-8601 date-time")
    for key in ["outputs", "verification"]:
        value = data.get(key)
        if not isinstance(value, list) or not value or not all(nonempty(x) for x in value):
            errors.append(f"{key} must be a non-empty array of non-empty strings")
    for claim in data.get("claims", []):
        if not isinstance(claim, dict) or not nonempty(claim.get("text")):
            errors.append("each claim must be an object with non-empty text")
            continue
        if claim.get("status") not in CLAIM_STATUSES:
            errors.append(f"claim status must be one of {sorted(CLAIM_STATUSES)}")
        if claim.get("status") == "verified" and not nonempty(claim.get("source")):
            errors.append("verified claim requires a non-empty source")
    if data.get("status") in {"approved", "scheduled", "published", "measuring"}:
        bad = [c for c in data.get("claims", []) if c.get("status") != "verified"]
        if bad:
            errors.append("approved/published work cannot contain unresolved material claims")
    if errors:
        return fail(errors)
    print(f"OK: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

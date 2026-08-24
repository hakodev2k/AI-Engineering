#!/usr/bin/env python3
"""Fail closed when an affirmative agent approval lacks decision-grade evidence."""
import argparse
import json
import sys
from pathlib import Path

AFFIRMATIVE = {"approve", "allow", "grant", "yes"}


def text(value):
    return value.strip() if isinstance(value, str) else ""


def validate(record):
    errors = []
    decision = text(record.get("decision")).lower()
    if decision in AFFIRMATIVE:
        if not text(record.get("action")):
            errors.append("affirmative approval missing action")
        if not text(record.get("target")):
            errors.append("affirmative approval missing target")
        if record.get("scope") in (None, "", [], {}):
            errors.append("affirmative approval missing scope")
        if not text(record.get("rationale")):
            errors.append("affirmative approval missing rationale")
    if record.get("requires_human") and decision in AFFIRMATIVE and not record.get("human_visible"):
        errors.append("human-gated approval was not rendered to a human")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", help="JSON object or list of approval records")
    args = parser.parse_args()
    try:
        data = json.loads(Path(args.path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"input_error: {exc}", file=sys.stderr)
        return 2
    rows = data if isinstance(data, list) else [data]
    if not rows or not all(isinstance(row, dict) for row in rows):
        print("input_error: expected object or non-empty list of objects", file=sys.stderr)
        return 2
    failures = 0
    for index, row in enumerate(rows):
        errors = validate(row)
        result = {"index": index, "valid": not errors}
        if errors:
            result["errors"] = errors
            failures += 1
        print(json.dumps(result, sort_keys=True))
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())

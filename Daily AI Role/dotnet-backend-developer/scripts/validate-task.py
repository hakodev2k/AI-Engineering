#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

REQUIRED = ("goal", "acceptance_criteria")


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a backend task contract JSON file.")
    parser.add_argument("task", type=Path)
    args = parser.parse_args()

    if not args.task.is_file():
        print(f"Task file not found: {args.task}", file=sys.stderr)
        return 2

    try:
        data = json.loads(args.task.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"Invalid task file: {exc}", file=sys.stderr)
        return 2

    errors = []
    for key in REQUIRED:
        value = data.get(key)
        if value is None or value == "" or value == []:
            errors.append(f"missing required field: {key}")

    if not isinstance(data.get("acceptance_criteria"), list):
        errors.append("acceptance_criteria must be an array")

    risk = data.get("risk", "normal")
    if risk not in {"normal", "high", "critical"}:
        errors.append("risk must be normal, high, or critical")

    if risk in {"high", "critical"} and not data.get("approval_boundaries"):
        errors.append("high/critical tasks require approval_boundaries")

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print("Task contract valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

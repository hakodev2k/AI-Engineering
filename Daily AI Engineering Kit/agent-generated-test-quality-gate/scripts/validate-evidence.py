#!/usr/bin/env python3
"""Validate required fields in a generated-test evidence JSON without third-party packages.

Usage: python scripts/validate-evidence.py path/to/test-evidence.json
Exit codes: 0 valid, 2 invalid evidence, 3 file/JSON error.
"""
from __future__ import annotations
import json
import pathlib
import sys

ALLOWED_STATUS = {"planned", "implemented", "verified", "blocked", "needs-approval"}


def fail(message: str) -> int:
    print(f"INVALID: {message}", file=sys.stderr)
    return 2


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: validate-evidence.py <evidence.json>", file=sys.stderr)
        return 3
    path = pathlib.Path(sys.argv[1])
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 3
    if not isinstance(data, dict):
        return fail("root must be an object")
    required = {"status", "changed_behavior", "tests", "commands", "risks"}
    missing = sorted(required - data.keys())
    if missing:
        return fail(f"missing fields: {', '.join(missing)}")
    if data["status"] not in ALLOWED_STATUS:
        return fail("invalid status")
    if not isinstance(data["changed_behavior"], list) or not data["changed_behavior"]:
        return fail("changed_behavior must be a non-empty array")
    if not isinstance(data["tests"], list) or not data["tests"]:
        return fail("tests must be a non-empty array")
    for index, test in enumerate(data["tests"]):
        if not isinstance(test, dict):
            return fail(f"tests[{index}] must be an object")
        for key in ("path", "behavior", "assertion", "evidence"):
            if not isinstance(test.get(key), str) or not test[key].strip():
                return fail(f"tests[{index}].{key} must be a non-empty string")
    if not isinstance(data["commands"], list):
        return fail("commands must be an array")
    for index, cmd in enumerate(data["commands"]):
        if not isinstance(cmd, dict) or not isinstance(cmd.get("command"), str) or not isinstance(cmd.get("exit_code"), int):
            return fail(f"commands[{index}] requires command:string and exit_code:integer")
    if not isinstance(data["risks"], list) or not all(isinstance(x, str) for x in data["risks"]):
        return fail("risks must be an array of strings")
    print("Evidence structure valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

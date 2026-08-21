#!/usr/bin/env python3
import json, sys

REQUIRED = ["id", "title", "user", "problem", "impact", "contract_change", "risk", "owner", "state"]
LEVELS = {"low", "medium", "high", "critical"}
STATES = {"intake", "design", "implementation", "validation", "rollout", "migration", "done", "blocked"}

def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr)
    raise SystemExit(code)

def main():
    if len(sys.argv) != 2:
        fail("usage: validate-platform-change.py <file.json>", 2)
    try:
        with open(sys.argv[1], encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        fail(str(e), 2)
    if not isinstance(data, dict): fail("root must be an object")
    for key in REQUIRED:
        if key not in data or data[key] in (None, ""): fail(f"missing required field: {key}")
    if data["impact"] not in LEVELS: fail("invalid impact")
    if data["risk"] not in LEVELS: fail("invalid risk")
    if data["state"] not in STATES: fail("invalid state")
    if "dependencies" in data and not isinstance(data["dependencies"], list): fail("dependencies must be an array")
    print("VALID")

if __name__ == "__main__": main()

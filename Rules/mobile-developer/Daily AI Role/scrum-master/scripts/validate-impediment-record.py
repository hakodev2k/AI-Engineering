#!/usr/bin/env python3
import json, sys

REQUIRED = ["id", "summary", "severity", "status", "owner", "next_action", "target_date"]
SEVERITY = {"low", "medium", "high", "critical"}
STATUS = {"active", "monitoring", "escalated", "resolved"}

def main():
    if len(sys.argv) != 2:
        print("usage: validate-impediment-record.py <record.json>", file=sys.stderr)
        return 2
    try:
        with open(sys.argv[1], encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 2
    missing = [k for k in REQUIRED if not data.get(k)]
    errors = []
    if missing: errors.append("missing: " + ", ".join(missing))
    if data.get("severity") not in SEVERITY: errors.append("invalid severity")
    if data.get("status") not in STATUS: errors.append("invalid status")
    for key in ("evidence", "dependencies"):
        if key in data and not isinstance(data[key], list): errors.append(f"{key} must be a list")
    if errors:
        for e in errors: print("error:", e, file=sys.stderr)
        return 1
    print("valid impediment record")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

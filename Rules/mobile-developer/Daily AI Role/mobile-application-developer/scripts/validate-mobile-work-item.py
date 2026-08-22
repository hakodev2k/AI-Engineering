#!/usr/bin/env python3
import json, sys

REQUIRED = ["id", "userOutcome", "priority", "platforms", "status", "testPlan", "telemetry"]
PRIORITIES = {"critical", "high", "medium", "low"}
STATUSES = {"intake", "planned", "implementing", "reviewing", "verifying", "ready", "released", "blocked", "failed", "cancelled"}
PLATFORMS = {"ios", "android", "other"}

def fail(messages):
    for m in messages:
        print(f"ERROR: {m}", file=sys.stderr)
    return 1

def main():
    if len(sys.argv) != 2:
        print("usage: validate-mobile-work-item.py <work-item.json>", file=sys.stderr)
        return 2
    try:
        with open(sys.argv[1], encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: cannot read/parse JSON: {exc}", file=sys.stderr)
        return 2
    errors = []
    for key in REQUIRED:
        if key not in data:
            errors.append(f"missing required field: {key}")
    if data.get("priority") not in PRIORITIES:
        errors.append("invalid priority")
    if data.get("status") not in STATUSES:
        errors.append("invalid status")
    platforms = data.get("platforms")
    if not isinstance(platforms, list) or not platforms or any(p not in PLATFORMS for p in platforms):
        errors.append("platforms must be a non-empty list of ios/android/other")
    for key in ("testPlan", "telemetry"):
        value = data.get(key)
        if not isinstance(value, list) or not value or any(not isinstance(x, str) or not x.strip() for x in value):
            errors.append(f"{key} must be a non-empty list of strings")
    if data.get("offlineRequired") and not any("offline" in x.lower() or "airplane" in x.lower() for x in data.get("testPlan", [])):
        errors.append("offlineRequired=true requires an offline test")
    if errors:
        return fail(errors)
    print("VALID: mobile work item")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

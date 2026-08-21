#!/usr/bin/env python3
import json, sys
from pathlib import Path

REQUIRED = {"engagement_id", "customer", "business_outcome", "technical_requirements", "success_criteria", "status"}
STATUSES = {"qualifying","discovering","solutioning","evaluating","blocked","ready_for_decision","handed_off","closed"}

def fail(msg: str, code: int = 1):
    print(f"ERROR: {msg}", file=sys.stderr)
    raise SystemExit(code)

def main():
    if len(sys.argv) != 2:
        fail("usage: validate-engagement.py <engagement.json>", 2)
    p = Path(sys.argv[1])
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        fail(str(e), 2)
    missing = sorted(REQUIRED - data.keys())
    if missing:
        fail("missing required fields: " + ", ".join(missing))
    if not isinstance(data["technical_requirements"], list) or not data["technical_requirements"]:
        fail("technical_requirements must be a non-empty array")
    if not isinstance(data["success_criteria"], list) or not data["success_criteria"]:
        fail("success_criteria must be a non-empty array")
    if data["status"] not in STATUSES:
        fail("invalid status")
    for key in ("engagement_id", "customer", "business_outcome"):
        if not isinstance(data[key], str) or not data[key].strip():
            fail(f"{key} must be a non-empty string")
    print("OK: engagement is structurally valid")

if __name__ == "__main__":
    main()

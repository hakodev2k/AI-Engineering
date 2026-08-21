#!/usr/bin/env python3
import json, sys

REQUIRED = {"id", "title", "journey", "severity", "status", "expected", "actual", "environment", "owner"}
SEVERITY = {"critical", "high", "medium", "low"}
STATUS = {"intake", "confirmed", "remediating", "retest", "blocked", "approved-risk", "closed"}

def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr)
    raise SystemExit(code)

if len(sys.argv) != 2:
    fail("usage: validate-accessibility-work-item.py <work-item.json>", 2)
try:
    with open(sys.argv[1], encoding="utf-8") as f:
        data = json.load(f)
except Exception as exc:
    fail(f"cannot read/parse JSON: {exc}", 2)
missing = sorted(REQUIRED - set(data))
if missing:
    fail("missing required fields: " + ", ".join(missing))
if data["severity"] not in SEVERITY:
    fail("invalid severity")
if data["status"] not in STATUS:
    fail("invalid status")
if not isinstance(data["environment"], dict) or not data["environment"].get("platform") or not data["environment"].get("browser"):
    fail("environment.platform and environment.browser are required")
for key in ["id", "title", "journey", "expected", "actual", "owner"]:
    if not isinstance(data[key], str) or not data[key].strip():
        fail(f"{key} must be a non-empty string")
if data["status"] == "approved-risk" and not data.get("approval"):
    fail("approved-risk requires approval evidence")
print("OK: accessibility work item is valid")
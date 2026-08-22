#!/usr/bin/env python3
import json, sys
from pathlib import Path

REQUIRED = ["id","objective","funnel_stage","segment","primary_metric","owner","decision_deadline"]
STAGES = {"acquisition","activation","retention","referral","revenue","cross-funnel"}

def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr)
    raise SystemExit(code)

if len(sys.argv) != 2:
    fail("usage: validate-growth-work-item.py <work-item.json>", 2)
path = Path(sys.argv[1])
try:
    data = json.loads(path.read_text(encoding="utf-8"))
except Exception as exc:
    fail(f"cannot read/parse JSON: {exc}", 2)
if not isinstance(data, dict):
    fail("root must be an object")
missing = [k for k in REQUIRED if not data.get(k)]
if missing:
    fail("missing required fields: " + ", ".join(missing))
if data["funnel_stage"] not in STAGES:
    fail("invalid funnel_stage")
for key in ("guardrails","constraints","approvals"):
    if key in data and not isinstance(data[key], list):
        fail(f"{key} must be an array")
print("VALID")

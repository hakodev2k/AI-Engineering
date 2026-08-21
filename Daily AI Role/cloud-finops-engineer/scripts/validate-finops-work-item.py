#!/usr/bin/env python3
import json, sys

REQUIRED = {"id","title","status","priority","owner","time_window","evidence","confidence","requires_human_approval","verification"}
STATUS = {"intake","analyzing","review","approved","implementing","verifying","done","blocked"}
PRIORITY = {"critical","high","medium","low"}
CONFIDENCE = {"high","medium","low"}

def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr)
    raise SystemExit(code)

if len(sys.argv) != 2:
    fail("usage: validate-finops-work-item.py <work-item.json>", 2)
try:
    with open(sys.argv[1], "r", encoding="utf-8") as f:
        data = json.load(f)
except (OSError, json.JSONDecodeError) as e:
    fail(str(e), 2)
missing = REQUIRED - data.keys()
if missing: fail("missing required fields: " + ", ".join(sorted(missing)))
if data["status"] not in STATUS: fail("invalid status")
if data["priority"] not in PRIORITY: fail("invalid priority")
if data["confidence"] not in CONFIDENCE: fail("invalid confidence")
if not isinstance(data["evidence"], list) or not data["evidence"]: fail("evidence must be a non-empty array")
for i, e in enumerate(data["evidence"]):
    if not isinstance(e, dict) or not {"type","source","statement"} <= e.keys(): fail(f"evidence[{i}] is incomplete")
if "baseline_cost" in data and (not isinstance(data["baseline_cost"], (int,float)) or data["baseline_cost"] < 0): fail("baseline_cost must be non-negative")
if "estimated_monthly_savings" in data and (not isinstance(data["estimated_monthly_savings"], (int,float)) or data["estimated_monthly_savings"] < 0): fail("estimated_monthly_savings must be non-negative")
print("VALID")

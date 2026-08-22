#!/usr/bin/env python3
import json, sys
from datetime import date

if len(sys.argv) != 2:
    print("usage: validate-team-work-contract.py <contract.json>")
    sys.exit(64)
try:
    data = json.load(open(sys.argv[1], encoding="utf-8"))
except Exception as e:
    print(f"invalid JSON: {e}")
    sys.exit(2)
required = ["id","objective","owner","priority","stakeholders","risks","approvalRequired","successMeasures","nextCheckpoint"]
missing = [k for k in required if k not in data]
if missing:
    print("missing required fields: " + ", ".join(missing)); sys.exit(3)
if data["priority"] not in {"critical","high","medium","low"}:
    print("invalid priority"); sys.exit(4)
if not data["stakeholders"] or not data["successMeasures"]:
    print("stakeholders and successMeasures must be non-empty"); sys.exit(5)
try: date.fromisoformat(data["nextCheckpoint"])
except ValueError:
    print("nextCheckpoint must be YYYY-MM-DD"); sys.exit(6)
print("team work contract valid")

#!/usr/bin/env python3
import json, sys

REQUIRED = ["taskId","goal","expectedOutput","priority","owner","sideEffectLevel","allowedTools","acceptanceCriteria","stopConditions","retryLimit"]

def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr); raise SystemExit(code)

if len(sys.argv) != 2:
    fail("usage: validate-task-contract.py <contract.json>", 2)
try:
    with open(sys.argv[1], encoding="utf-8") as f: data = json.load(f)
except (OSError, json.JSONDecodeError) as e:
    fail(str(e), 2)
missing = [k for k in REQUIRED if k not in data]
if missing: fail("missing fields: " + ", ".join(missing))
if data["priority"] not in {"P0","P1","P2","P3"}: fail("invalid priority")
if not isinstance(data["sideEffectLevel"], int) or not 1 <= data["sideEffectLevel"] <= 5: fail("sideEffectLevel must be 1..5")
if not isinstance(data["retryLimit"], int) or not 0 <= data["retryLimit"] <= 3: fail("retryLimit must be 0..3")
for name in ("allowedTools","acceptanceCriteria","stopConditions"):
    if not isinstance(data[name], list) or (name != "allowedTools" and not data[name]): fail(f"invalid {name}")
if data["sideEffectLevel"] >= 4 and not data.get("humanApprovalRequired", False):
    fail("sideEffectLevel >= 4 requires humanApprovalRequired=true")
print("VALID")

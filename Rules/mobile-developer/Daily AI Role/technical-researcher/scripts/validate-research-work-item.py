#!/usr/bin/env python3
import json, sys

def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(code)

if len(sys.argv) != 2:
    fail("usage: python validate-research-work-item.py <file.json>", 2)
try:
    with open(sys.argv[1], encoding="utf-8") as f:
        d = json.load(f)
except (OSError, json.JSONDecodeError) as e:
    fail(str(e), 2)
for k in ["id","decision_owner","decision","question","claims","stop_conditions","outputs"]:
    if k not in d:
        fail(f"missing required field: {k}")
for k in ["id","decision_owner","decision","question"]:
    if not isinstance(d[k], str) or not d[k].strip():
        fail(f"{k} must be a non-empty string")
for k in ["claims","stop_conditions","outputs"]:
    if not isinstance(d[k], list) or not d[k] or any(not isinstance(x, str) or not x.strip() for x in d[k]):
        fail(f"{k} must be a non-empty string array")
c = d.get("confidence_target")
if c is not None and (not isinstance(c, (int,float)) or isinstance(c, bool) or not 0 <= c <= 1):
    fail("confidence_target must be null or number 0..1")
print("OK")

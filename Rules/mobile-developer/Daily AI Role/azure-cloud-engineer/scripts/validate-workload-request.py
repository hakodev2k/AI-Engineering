#!/usr/bin/env python3
import json, sys
REQ=["name","owner","environment","business_purpose","region","data_classification","rto","rpo"]
ENV={"dev","test","staging","production"}
def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr); raise SystemExit(code)
if len(sys.argv)!=2: fail("usage: validate-workload-request.py <request.json>",2)
try:
    with open(sys.argv[1],encoding="utf-8") as f: d=json.load(f)
except Exception as e: fail(f"cannot parse JSON: {e}",2)
for k in REQ:
    if k not in d or d[k] in (None,""): fail(f"missing required field: {k}")
if d["environment"] not in ENV: fail("environment must be dev, test, staging, or production")
for k in ("dependencies","approvals_required"):
    if k in d and not isinstance(d[k],list): fail(f"{k} must be an array")
for k in ("estimated_monthly_budget","expected_peak_rps"):
    if k in d and d[k] is not None and (not isinstance(d[k],(int,float)) or d[k]<0): fail(f"{k} must be null or non-negative number")
print("OK: workload request is structurally valid")

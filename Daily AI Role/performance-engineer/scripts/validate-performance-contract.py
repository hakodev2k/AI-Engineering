#!/usr/bin/env python3
import json, sys

def fail(msg, code=2):
    print(f"ERROR: {msg}", file=sys.stderr); sys.exit(code)

if len(sys.argv) != 2: fail("usage: validate-performance-contract.py <contract.json>")
try:
    data=json.load(open(sys.argv[1], encoding="utf-8"))
except Exception as e: fail(f"cannot read JSON: {e}")
required=["id","objective","owner","target_metrics","workload","environment","baseline","pass_criteria"]
missing=[k for k in required if not data.get(k)]
if missing: fail("missing required fields: "+", ".join(missing))
if not isinstance(data["target_metrics"], list) or not data["target_metrics"]: fail("target_metrics must be a non-empty array")
if not isinstance(data["pass_criteria"], list) or not data["pass_criteria"]: fail("pass_criteria must be a non-empty array")
w=data["workload"]
if not isinstance(w, dict): fail("workload must be an object")
for k in ["scenario","concurrency","duration_seconds"]:
    if k not in w: fail(f"workload.{k} is required")
if not isinstance(w["concurrency"], int) or w["concurrency"] < 1: fail("workload.concurrency must be >= 1")
if not isinstance(w["duration_seconds"], int) or w["duration_seconds"] < 1: fail("workload.duration_seconds must be >= 1")
print("OK: performance test contract is valid")
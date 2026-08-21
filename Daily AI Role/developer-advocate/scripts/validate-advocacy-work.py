#!/usr/bin/env python3
import json, sys

def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr); raise SystemExit(code)

if len(sys.argv) != 2: fail("usage: validate-advocacy-work.py <json-file>", 2)
try:
    data = json.load(open(sys.argv[1], encoding="utf-8"))
except OSError as e: fail(str(e), 2)
except json.JSONDecodeError as e: fail(f"invalid JSON: {e}")
required = ["title","audience","goal","artifact_type","source_of_truth","risk","success_measure"]
missing = [k for k in required if not data.get(k)]
if missing: fail("missing required fields: " + ", ".join(missing))
allowed = {"tutorial","sample","demo","talk","workshop","faq","feedback-report","issue-triage","launch-enablement"}
if data["artifact_type"] not in allowed: fail("unsupported artifact_type")
if data["risk"] not in {"low","medium","high","critical"}: fail("invalid risk")
if not isinstance(data["source_of_truth"], list) or not data["source_of_truth"]: fail("source_of_truth must be non-empty array")
if data["risk"] in {"high","critical"} and not data.get("approvals"): fail("high/critical risk requires approvals")
print("OK: advocacy work request is valid")

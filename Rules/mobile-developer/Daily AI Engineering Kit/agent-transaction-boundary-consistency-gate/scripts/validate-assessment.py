#!/usr/bin/env python3
import json, sys

def fail(msg):
    print(f"INVALID: {msg}", file=sys.stderr); return 2

def main():
    if len(sys.argv)!=2: return fail("usage: validate-assessment.py <assessment.json>")
    try: d=json.load(open(sys.argv[1],encoding="utf-8"))
    except Exception as e: return fail(str(e))
    required=["status","risk","entryPoints","findings","verification","unresolvedRisks"]
    for k in required:
        if k not in d: return fail(f"missing {k}")
    if d["status"] not in {"pass","fail","blocked","needs-approval"}: return fail("invalid status")
    if d["risk"] not in {"low","medium","high","critical"}: return fail("invalid risk")
    if not isinstance(d["entryPoints"],list) or not d["entryPoints"]: return fail("entryPoints must be non-empty")
    if not isinstance(d["findings"],list): return fail("findings must be array")
    for i,f in enumerate(d["findings"]):
        for k in ["id","severity","finding","evidence","affectedComponent","recommendedAction"]:
            if not f.get(k): return fail(f"finding[{i}] missing {k}")
        if not isinstance(f["evidence"],list): return fail(f"finding[{i}].evidence must be array")
    v=d["verification"]
    for k in ["testsRun","testsPassed","diffReviewed"]:
        if k not in v: return fail(f"verification missing {k}")
    if d["status"]=="pass" and (not v["testsPassed"] or not v["diffReviewed"]): return fail("pass requires testsPassed and diffReviewed")
    if d["status"]=="pass" and any(f["severity"] in {"high","critical"} for f in d["findings"]): return fail("pass cannot contain high/critical finding")
    print("VALID")
    return 0

if __name__=="__main__": sys.exit(main())

#!/usr/bin/env python3
import argparse, json, sys

def fail(msg):
    print(f"invalid assessment: {msg}", file=sys.stderr)
    return 2

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("assessment")
    args=ap.parse_args()
    try:
        data=json.load(open(args.assessment,encoding="utf-8"))
    except Exception as exc:
        return fail(str(exc))
    required=["status","scope","findings","before_evidence","after_evidence","verification"]
    for k in required:
        if k not in data: return fail(f"missing {k}")
    if data["status"] not in {"pass","fail","blocked","needs-approval"}: return fail("bad status")
    if not isinstance(data["scope"],list) or not data["scope"]: return fail("scope must be non-empty list")
    for i,f in enumerate(data["findings"]):
        for k in ["finding","evidence","risk","recommended_action"]:
            if k not in f: return fail(f"finding {i} missing {k}")
        if f["risk"] not in {"low","medium","high","critical"}: return fail(f"finding {i} bad risk")
    v=data["verification"]
    for k in ["contention_test","diff_review","independent_verifier"]:
        if not isinstance(v.get(k),bool): return fail(f"verification.{k} must be boolean")
    if data["status"]=="pass":
        if not data["before_evidence"] or not data["after_evidence"]: return fail("pass requires before and after evidence")
        if not all(v[k] for k in ["contention_test","diff_review","independent_verifier"]): return fail("pass requires all verification checks")
        if any(f["risk"] in {"high","critical"} for f in data["findings"]): return fail("pass cannot contain unresolved high/critical findings")
    print("assessment valid")
    return 0
if __name__=="__main__": raise SystemExit(main())

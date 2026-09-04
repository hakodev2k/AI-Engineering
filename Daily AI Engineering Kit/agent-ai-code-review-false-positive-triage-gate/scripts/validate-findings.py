#!/usr/bin/env python3
import argparse,json,sys
from pathlib import Path

ALLOWED_SEV={"critical","high","medium","low","info"}
ALLOWED_STATUS={"confirmed","rejected","needs-human-review"}
ALLOWED_RESULT={"verified","failed","blocked"}
ALLOWED_EVIDENCE={"test","build","static-analysis","runtime-reproduction","repository-proof","specification"}

def fail(msg): print(f"ERROR: {msg}",file=sys.stderr); return 1

def validate_record(r,policy):
    errs=[]
    for k in ("id","title","severity","status","confidence","location","claim","evidence","verification"):
        if k not in r: errs.append(f"missing {k}")
    if errs:return errs
    if r["severity"] not in ALLOWED_SEV: errs.append("invalid severity")
    if r["status"] not in ALLOWED_STATUS: errs.append("invalid status")
    if not isinstance(r["confidence"],(int,float)) or not 0<=r["confidence"]<=1: errs.append("confidence must be 0..1")
    if not isinstance(r["location"],dict) or not r["location"].get("path"): errs.append("location.path required")
    if not isinstance(r["evidence"],list) or not r["evidence"]: errs.append("evidence required")
    else:
        for i,e in enumerate(r["evidence"]):
            if e.get("type") not in ALLOWED_EVIDENCE: errs.append(f"evidence[{i}] invalid type")
            if not e.get("description"): errs.append(f"evidence[{i}] description required")
    v=r["verification"]
    if not isinstance(v,dict) or v.get("result") not in ALLOWED_RESULT: errs.append("verification.result invalid")
    if r["status"]=="confirmed" and r["severity"] in policy["blocking_severities"]:
        if r["confidence"]<policy["minimum_blocking_confidence"]: errs.append("blocking finding below minimum confidence")
        if policy.get("require_independent_verification") and not v.get("independent"): errs.append("blocking finding lacks independent verification")
        if v.get("result")!="verified": errs.append("blocking finding is not verified")
        if policy.get("require_reproduction_for_blocking") and not any(e.get("type") in {"test","runtime-reproduction","static-analysis"} for e in r["evidence"]): errs.append("blocking finding lacks reproduction evidence")
    return errs

def main():
    ap=argparse.ArgumentParser();ap.add_argument("--input",required=True);ap.add_argument("--policy",required=True);a=ap.parse_args()
    try: data=json.loads(Path(a.input).read_text()); policy=json.loads(Path(a.policy).read_text())
    except Exception as e:return fail(str(e))
    records=data if isinstance(data,list) else [data]
    allerrs=[]
    for r in records:
        errs=validate_record(r,policy)
        if errs: allerrs.append((r.get("id","<unknown>"),errs))
    if allerrs:
        for rid,errs in allerrs:
            for e in errs: print(f"{rid}: {e}",file=sys.stderr)
        return 2
    print(f"validated {len(records)} finding(s)")
    return 0
if __name__=="__main__": raise SystemExit(main())

#!/usr/bin/env python3
"""Validate an evidence-bound verification report."""
import argparse, json, pathlib, sys
REQUIRED={"source_state","status","criteria","tests","integrity","reconstructed_intent"}

def main():
    p=argparse.ArgumentParser(); p.add_argument("report"); p.add_argument("--expected-source"); a=p.parse_args()
    try: d=json.loads(pathlib.Path(a.report).read_text(encoding="utf-8"))
    except Exception as e: print(f"invalid report: {e}",file=sys.stderr); return 2
    missing=sorted(REQUIRED-set(d))
    if missing: print(json.dumps({"valid":False,"missing":missing},indent=2)); return 3
    problems=[]
    if a.expected_source and d["source_state"]!=a.expected_source: problems.append("source_state_mismatch")
    if d["status"]!="PASS": problems.append("status_not_pass")
    if not isinstance(d["criteria"],list) or not d["criteria"]: problems.append("criteria_missing")
    else:
        for c in d["criteria"]:
            if c.get("required",True) and (c.get("status")!="PASS" or not c.get("evidence")): problems.append(f"criterion:{c.get('id','unknown')}")
    if d.get("integrity",{}).get("status")!="PASS": problems.append("integrity_not_pass")
    for t in d.get("tests",[]):
        if t.get("required",True) and (t.get("exit_code")!=0 or t.get("source_state")!=d["source_state"]): problems.append(f"test:{t.get('name','unknown')}")
    out={"valid":not problems,"source_state":d["source_state"],"problems":problems}
    print(json.dumps(out,indent=2)); return 0 if not problems else 3
if __name__=="__main__": raise SystemExit(main())

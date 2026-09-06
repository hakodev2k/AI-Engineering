#!/usr/bin/env python3
import argparse, json, sys

REQUIRED=("facts","assumptions","conflicts","preconditions","evidence","action","risk","retry_count")
VALID_RISK={"reversible","consequential","irreversible"}

def evaluate(r):
    missing=[k for k in REQUIRED if k not in r]
    if missing: raise ValueError("missing fields: "+", ".join(missing))
    if not isinstance(r["facts"],list) or not isinstance(r["assumptions"],list): raise ValueError("facts/assumptions must be lists")
    if not isinstance(r["conflicts"],list) or not isinstance(r["preconditions"],list): raise ValueError("conflicts/preconditions must be lists")
    if not isinstance(r["evidence"],dict): raise ValueError("evidence must be an object keyed by precondition")
    if r["risk"] not in VALID_RISK: raise ValueError("invalid risk")
    retry=int(r["retry_count"])
    reasons=[]
    blocking=[c for c in r["conflicts"] if isinstance(c,dict) and c.get("blocking",True)]
    if blocking:
        return {"decision":"STOP","reasons":["blocking conflict exists"],"missing_preconditions":[]}
    missing_pre=[p for p in r["preconditions"] if not r["evidence"].get(str(p))]
    if missing_pre:
        if retry >= 2:
            return {"decision":"STOP","reasons":["required evidence unavailable after retry limit"],"missing_preconditions":missing_pre}
        return {"decision":"REVIEW","reasons":["required evidence missing"],"missing_preconditions":missing_pre}
    approval_required = r["risk"] in {"consequential","irreversible"} and bool(r.get("approval_required",True))
    if approval_required and r.get("approval") != "approved":
        return {"decision":"REVIEW","reasons":["required approval not present"],"missing_preconditions":[]}
    if not str(r["action"]).strip(): raise ValueError("action must be non-empty")
    return {"decision":"ACT","reasons":[],"missing_preconditions":[]}

def main():
    ap=argparse.ArgumentParser(description="Fail-closed feasibility gate for GUI-agent actions")
    ap.add_argument("record")
    a=ap.parse_args()
    try:
        with open(a.record,encoding="utf-8") as f:r=json.load(f)
        out=evaluate(r)
        print(json.dumps(out,indent=2))
        return 0 if out["decision"]=="ACT" else 4
    except Exception as e:
        print(json.dumps({"decision":"STOP","error":str(e)}),file=sys.stderr)
        return 2
if __name__=="__main__": raise SystemExit(main())

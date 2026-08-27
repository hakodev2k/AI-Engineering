#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(path):
    try:
        data=json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read log: {e}")
    if not isinstance(data,list) or not data:
        raise ValueError("log must be a non-empty JSON array")
    return data

def evaluate(cycles,max_zero_delta=2,max_scope_growth=1):
    zero_streak=0
    total_scope_growth=0
    for idx,c in enumerate(cycles,1):
        for key in ("target_criterion","accepted_delta","scope_growth","verification"):
            if key not in c:
                raise ValueError(f"cycle {idx} missing {key}")
        if c["verification"] not in ("accepted","rejected","blocked"):
            raise ValueError(f"cycle {idx} invalid verification")
        delta=c["accepted_delta"]
        if not isinstance(delta,list):
            raise ValueError(f"cycle {idx} accepted_delta must be a list")
        growth=c["scope_growth"]
        if not isinstance(growth,int) or growth < 0:
            raise ValueError(f"cycle {idx} scope_growth must be a non-negative integer")
        total_scope_growth += growth
        zero_streak = 0 if c["verification"]=="accepted" and delta else zero_streak+1
    latest=cycles[-1]
    reasons=[]
    if zero_streak >= max_zero_delta:
        reasons.append("zero_delta_threshold_reached")
    if total_scope_growth > max_scope_growth:
        reasons.append("scope_growth_threshold_exceeded")
    retry=latest.get("retry",0)
    max_retries=latest.get("max_retries",2)
    if not isinstance(retry,int) or not isinstance(max_retries,int):
        raise ValueError("retry fields must be integers")
    if retry > max_retries:
        reasons.append("retry_budget_exhausted")
    if reasons:
        return {"decision":"stop-and-escalate","reasons":reasons,"zero_delta_streak":zero_streak,"scope_growth":total_scope_growth}
    if latest.get("all_required_criteria_verified",False) and latest["verification"]=="accepted" and latest["accepted_delta"]:
        return {"decision":"complete","reasons":["all_required_criteria_verified"],"zero_delta_streak":zero_streak,"scope_growth":total_scope_growth}
    return {"decision":"continue","reasons":["bounded_progress_or_retry_available"],"zero_delta_streak":zero_streak,"scope_growth":total_scope_growth}

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--log",required=True)
    ap.add_argument("--max-zero-delta",type=int,default=2)
    ap.add_argument("--max-scope-growth",type=int,default=1)
    a=ap.parse_args()
    if a.max_zero_delta < 1 or a.max_scope_growth < 0:
        print("invalid thresholds",file=sys.stderr); return 2
    try:
        result=evaluate(load(a.log),a.max_zero_delta,a.max_scope_growth)
    except ValueError as e:
        print(str(e),file=sys.stderr); return 2
    print(json.dumps(result,indent=2,sort_keys=True))
    return 3 if result["decision"]=="stop-and-escalate" else 0

if __name__=="__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime

PHASES=("request_start","approval_requested","approval_granted","tool_start","tool_end","result_ingested","next_model_start")

def parse_ts(v):
    if not isinstance(v,str): raise ValueError("timestamp must be ISO-8601 string")
    if v.endswith("Z"): v=v[:-1]+"+00:00"
    return datetime.fromisoformat(v)

def ms(a,b): return (b-a).total_seconds()*1000.0

def analyze(rec, policy, claim_phase=None):
    if not isinstance(rec,dict): return {"status":"invalid","errors":["record must be object"]}
    times={}; errors=[]; reasons=[]
    for k in PHASES:
        if rec.get(k) is not None:
            try: times[k]=parse_ts(rec[k])
            except Exception as e: errors.append(f"{k}: {e}")
    if errors: return {"status":"invalid","errors":errors}
    missing=[k for k in ("request_start","tool_start","tool_end") if k not in times]
    if missing: return {"status":"ambiguous","reasons":["missing required phases: "+", ".join(missing)]}
    skew=float(policy.get("max_clock_skew_ms",250))
    present=[k for k in PHASES if k in times]
    for a,b in zip(present,present[1:]):
        if ms(times[a],times[b]) < -skew: errors.append(f"non-monotonic phases: {a} > {b}")
    if errors: return {"status":"invalid","errors":errors}
    approval=bool(rec.get("approval_occurred",False)) or "approval_requested" in times or "approval_granted" in times
    if approval and policy.get("require_approval_bounds_when_approval_occurred",True):
        if "approval_requested" not in times or "approval_granted" not in times:
            reasons.append("approval occurred but approval bounds are incomplete")
    durations={"end_to_end_ms":ms(times["request_start"],times.get("next_model_start",times["tool_end"])),"tool_execution_ms":ms(times["tool_start"],times["tool_end"])}
    if "approval_requested" in times and "approval_granted" in times:
        durations["approval_wait_ms"]=ms(times["approval_requested"],times["approval_granted"])
    if "result_ingested" in times:
        durations["post_tool_ingest_ms"]=ms(times["tool_end"],times["result_ingested"])
    if "next_model_start" in times:
        durations["post_tool_overhead_ms"]=ms(times["tool_end"],times["next_model_start"])
    allowed=set(policy.get("allowed_claim_phases",[]))
    if claim_phase and claim_phase not in allowed:
        return {"status":"invalid","errors":[f"unsupported claim phase: {claim_phase}"]}
    if claim_phase=="approval_wait" and "approval_wait_ms" not in durations: reasons.append("approval_wait claim lacks complete approval bounds")
    if claim_phase=="post_tool_overhead" and "post_tool_overhead_ms" not in durations: reasons.append("post_tool_overhead claim lacks model boundary")
    status="ambiguous" if reasons else "attributable"
    return {"status":status,"durations":durations,"reasons":reasons,"claim_phase":claim_phase}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("record"); ap.add_argument("--policy",required=True); ap.add_argument("--claim-phase"); ap.add_argument("--output")
    a=ap.parse_args()
    try:
        with open(a.record,encoding="utf-8") as f: rec=json.load(f)
        with open(a.policy,encoding="utf-8") as f: policy=json.load(f)
        report=analyze(rec,policy,a.claim_phase)
    except (OSError,json.JSONDecodeError) as e:
        print(f"input error: {e}",file=sys.stderr); return 3
    text=json.dumps(report,indent=2,sort_keys=True)
    if a.output:
        with open(a.output,"w",encoding="utf-8") as f: f.write(text+"\n")
    else: print(text)
    return 0 if report["status"]=="attributable" else (2 if report["status"]=="ambiguous" else 3)

if __name__=="__main__": raise SystemExit(main())

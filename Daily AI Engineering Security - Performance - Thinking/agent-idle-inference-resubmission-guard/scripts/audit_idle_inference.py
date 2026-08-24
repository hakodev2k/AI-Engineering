#!/usr/bin/env python3
"""Audit JSONL model-request telemetry for inference without fresh work."""
import argparse, json, sys
from pathlib import Path

def fresh_trigger(r):
    return bool(r.get("needs_follow_up") or r.get("has_pending_input") or r.get("state_changed") or r.get("retry_reason_changed"))

def audit(records):
    violations=[]; total_cached=0; idle_cached=0; seen_triggers=set()
    for i,r in enumerate(records,1):
        if r.get("event")!="model_request": continue
        cached=int(r.get("cached_input_tokens") or 0); total_cached+=cached
        trigger=r.get("trigger_id")
        fresh=fresh_trigger(r)
        duplicate=bool(trigger and trigger in seen_triggers)
        if trigger: seen_triggers.add(trigger)
        terminal=bool(r.get("terminal"))
        if terminal or not fresh or duplicate:
            idle_cached+=cached
            violations.append({"line":i,"thread_id":r.get("thread_id"),"turn_id":r.get("turn_id"),"reason":"terminal" if terminal else "duplicate_trigger" if duplicate else "no_fresh_trigger","cached_input_tokens":cached})
    return {"model_requests":sum(1 for r in records if r.get("event")=="model_request"),"idle_requests":len(violations),"cached_input_tokens":total_cached,"idle_cached_input_tokens":idle_cached,"violations":violations}

def main():
    p=argparse.ArgumentParser(); p.add_argument("telemetry"); p.add_argument("--max-idle-requests",type=int,default=0); a=p.parse_args()
    if a.max_idle_requests<0: print("max must be >=0",file=sys.stderr); return 3
    try:
        records=[]
        for n,line in enumerate(Path(a.telemetry).read_text(encoding="utf-8").splitlines(),1):
            if not line.strip(): continue
            obj=json.loads(line)
            if not isinstance(obj,dict): raise ValueError(f"line {n}: object required")
            records.append(obj)
    except Exception as e: print(json.dumps({"error":str(e)})); return 3
    result=audit(records); print(json.dumps(result,sort_keys=True))
    return 2 if result["idle_requests"]>a.max_idle_requests else 0
if __name__=="__main__": sys.exit(main())

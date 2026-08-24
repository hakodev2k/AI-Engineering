#!/usr/bin/env python3
import argparse,json,sys

def main():
    p=argparse.ArgumentParser(description="Detect unjustified repeated background model-call attempts.")
    p.add_argument("events")
    p.add_argument("--max-same-turn-requests",type=int,default=5)
    p.add_argument("--max-no-progress-seconds",type=float,default=120.0)
    a=p.parse_args()
    if a.max_same_turn_requests<1 or a.max_no_progress_seconds<0:
        print("error: invalid policy",file=sys.stderr);return 1
    try:
        with open(a.events,encoding="utf-8") as f:lines=f.read().splitlines()
    except OSError as e:
        print(f"error: {e}",file=sys.stderr);return 1
    state={};viol=[];events=0
    for n,line in enumerate(lines,1):
        if not line.strip():continue
        events+=1
        try:e=json.loads(line)
        except json.JSONDecodeError as x:
            print(f"error: line {n}: {x}",file=sys.stderr);return 1
        req=["ts","worker_id","turn_id","pending_input","needs_follow_up","progress_fingerprint"]
        if any(k not in e for k in req):
            print(f"error: line {n}: missing required key",file=sys.stderr);return 1
        try:ts=float(e["ts"])
        except (TypeError,ValueError):
            print(f"error: line {n}: ts must be numeric",file=sys.stderr);return 1
        key=(str(e["worker_id"]),str(e["turn_id"]))
        s=state.setdefault(key,{"count":0,"fp":None,"fp_since":ts})
        s["count"]+=1;fp=str(e["progress_fingerprint"])
        if fp!=s["fp"]:s["fp"]=fp;s["fp_since"]=ts
        no_progress=max(0.0,ts-s["fp_since"]);reasons=[]
        if not bool(e["pending_input"]) and not bool(e["needs_follow_up"]):reasons.append("terminal_without_new_input")
        if s["count"]>a.max_same_turn_requests:reasons.append("same_turn_request_budget_exceeded")
        if no_progress>=a.max_no_progress_seconds:reasons.append("no_progress_timeout")
        if reasons:viol.append({"line":n,"worker_id":key[0],"turn_id":key[1],"request_count":s["count"],"no_progress_seconds":no_progress,"reasons":reasons})
    out={"status":"fail" if viol else "pass","workers":len(state),"events":events,"violations":viol}
    print(json.dumps(out,indent=2,sort_keys=True));return 2 if viol else 0

if __name__=="__main__":raise SystemExit(main())

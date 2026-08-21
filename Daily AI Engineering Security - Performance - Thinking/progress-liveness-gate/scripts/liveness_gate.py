#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

COUNTED = {"criterion_satisfied", "required_test_passed", "deliverable_changed", "verified_evidence_added", "blocker_removed"}

def load(path):
    try: data=json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e: raise ValueError(str(e))
    if not isinstance(data,dict) or not isinstance(data.get("events",[]),list): raise ValueError("input must contain events array")
    return data

def evaluate(data):
    score=0; counted=[]
    seen=set()
    for i,e in enumerate(data.get("events",[])):
        if not isinstance(e,dict): raise ValueError(f"event {i} must be object")
        kind=e.get("kind"); key=(kind,str(e.get("id",i)))
        if kind in COUNTED and bool(e.get("verified",False)) and key not in seen:
            score+=int(e.get("weight",1)); counted.append(e); seen.add(key)
    prior=int(data.get("no_progress_streak",0))
    streak=0 if score>0 else prior+1
    changed=bool(data.get("hypothesis_changed",False))
    mandatory_open=int(data.get("mandatory_criteria_open",0))
    if score>0: decision="continue"
    elif streak>=3: decision="stop"
    elif streak>=2 and not changed: decision="change-hypothesis"
    else: decision="bounded-retry"
    if data.get("claim_complete") and mandatory_open>0: decision="stop"
    return {"progress_score":score,"counted_events":counted,"no_progress_streak":streak,"hypothesis_changed":changed,"mandatory_criteria_open":mandatory_open,"decision":decision}

def main():
    p=argparse.ArgumentParser(); p.add_argument("--input",required=True); a=p.parse_args()
    try:r=evaluate(load(a.input))
    except ValueError as e: print(json.dumps({"error":str(e)})); return 1
    print(json.dumps(r,indent=2))
    if r["decision"]=="continue": return 0
    if r["decision"] in {"bounded-retry","change-hypothesis"}: return 2
    return 3
if __name__=="__main__": sys.exit(main())
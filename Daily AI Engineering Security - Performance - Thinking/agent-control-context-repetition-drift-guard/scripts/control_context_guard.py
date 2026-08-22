#!/usr/bin/env python3
"""Detect repeated control-context injection and observable goal drift in JSONL traces."""
import argparse, json, sys
from collections import Counter
from pathlib import Path


def main():
    p=argparse.ArgumentParser(); p.add_argument("trace",type=Path); p.add_argument("--policy",type=Path,required=True); a=p.parse_args()
    try:
        policy=json.loads(a.policy.read_text(encoding="utf-8")); rows=[]
        for i,line in enumerate(a.trace.read_text(encoding="utf-8").splitlines(),1):
            if not line.strip(): continue
            r=json.loads(line)
            if not isinstance(r,dict): raise ValueError(f"line {i} must be object")
            for k in ("continuation_id","top_level_goal_id","active_subtask_id"):
                if policy.get("require_"+k, k!="continuation_id") and not isinstance(r.get(k),str): raise ValueError(f"line {i}: missing {k}")
            hashes=r.get("control_hashes",[])
            if not isinstance(hashes,list) or not all(isinstance(x,str) for x in hashes): raise ValueError(f"line {i}: control_hashes must be strings")
            rows.append(r)
        if not rows: raise ValueError("trace is empty")
        n=int(policy.get("window_continuations",20)); rows=rows[-n:]
        control=Counter(h for r in rows for h in set(r.get("control_hashes",[])))
        dup={h:c for h,c in control.items() if c>int(policy.get("max_duplicate_control_injections",3))}
        ack=sum(1 for r in rows if r.get("ack_only") is True)
        productive=sum(1 for r in rows if r.get("productive_action") is True)
        ratio=productive/len(rows)
        first=rows[0].get("top_level_goal_id"); drift=[r.get("continuation_id") for r in rows if r.get("top_level_goal_id")!=first]
        if len(drift)>int(policy.get("max_goal_drift_events",0)): decision="restore_goal"; code=4
        elif ack>int(policy.get("max_ack_only_continuations",2)) or dup: decision="deduplicate"; code=3
        elif ratio<float(policy.get("min_productive_action_ratio",0.5)): decision="stop"; code=5
        else: decision="healthy"; code=0
        print(json.dumps({"decision":decision,"window":len(rows),"duplicate_control_hashes":dup,"ack_only_continuations":ack,"productive_action_ratio":round(ratio,4),"goal_drift_continuations":drift},indent=2)); return code
    except (OSError,ValueError,json.JSONDecodeError,TypeError) as e:
        print(json.dumps({"decision":"invalid","error":str(e)}),file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())

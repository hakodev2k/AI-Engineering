#!/usr/bin/env python3
"""Summarize clone/wakeup amplification from normalized JSONL events."""
from __future__ import annotations
import argparse,json,math,sys
from pathlib import Path

def pct(xs,p):
    if not xs:return 0.0
    ys=sorted(xs); i=max(0,min(len(ys)-1,math.ceil(p*len(ys))-1)); return float(ys[i])
def analyze(events):
    if not events: raise ValueError("at least one event required")
    clone_bytes=0; redundant=0; wakeups=0; durations=[]; changed=0
    for i,e in enumerate(events,1):
        if not isinstance(e,dict): raise ValueError(f"event {i} must be object")
        vals={k:e.get(k) for k in ("payload_bytes","clone_count","subscriber_count","duration_ms")}
        if any(not isinstance(v,(int,float)) or isinstance(v,bool) or v<0 for v in vals.values()): raise ValueError(f"event {i} has invalid numeric field")
        if not isinstance(e.get("state_changed"),bool): raise ValueError(f"event {i} state_changed must be boolean")
        cb=vals["payload_bytes"]*vals["clone_count"]; clone_bytes+=cb; wakeups+=vals["subscriber_count"]; durations.append(vals["duration_ms"])
        if e["state_changed"]: changed+=1
        else: redundant+=vals["subscriber_count"]
    n=len(events); useful=max(changed,1)
    return {"events":n,"total_clone_bytes":clone_bytes,"clone_bytes_per_event":clone_bytes/n,"total_wakeups":wakeups,"redundant_wakeups":redundant,"redundant_wakeup_ratio":redundant/wakeups if wakeups else 0.0,"p95_duration_ms":pct(durations,.95),"amplification_ratio":n/useful,"no_change_ratio":(n-changed)/n}
def load_events(path):
    out=[]
    try:
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.strip(): out.append(json.loads(line))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read events: {exc}") from exc
    return out
def main():
    p=argparse.ArgumentParser(); p.add_argument("events",type=Path); p.add_argument("--budget",type=Path,required=True); a=p.parse_args()
    try:
        events=load_events(a.events); budget=json.loads(a.budget.read_text(encoding="utf-8")); report=analyze(events)
        checks={"clone_bytes_per_event":report["clone_bytes_per_event"]<=budget["max_clone_bytes_per_event"],"redundant_wakeup_ratio":report["redundant_wakeup_ratio"]<=budget["max_redundant_wakeup_ratio"],"p95_duration_ms":report["p95_duration_ms"]<=budget["max_p95_duration_ms"],"amplification_ratio":report["amplification_ratio"]<=budget["max_amplification_ratio"]}
    except (ValueError,OSError,json.JSONDecodeError,KeyError,TypeError) as exc:
        print(json.dumps({"status":"invalid","error":str(exc)})); return 2
    report["checks"]=checks; report["status"]="pass" if all(checks.values()) else "fail"; print(json.dumps(report,indent=2,sort_keys=True)); return 0 if report["status"]=="pass" else 4
if __name__=="__main__": raise SystemExit(main())

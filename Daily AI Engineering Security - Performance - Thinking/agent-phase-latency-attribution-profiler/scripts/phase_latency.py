#!/usr/bin/env python3
"""Validate versioned phase events and compute per-run latency attribution."""
from __future__ import annotations
import argparse, json, sys
from collections import defaultdict
from pathlib import Path

MARKS={"provider_event","business_action","visible_output"}

def load(path:Path):
    rows=[]
    try:
        with path.open("r",encoding="utf-8") as f:
            for n,line in enumerate(f,1):
                if not line.strip(): continue
                o=json.loads(line)
                if not isinstance(o,dict): raise ValueError(f"line {n}: object required")
                for k in ("run_id","phase","event","ts_ms"):
                    if k not in o: raise ValueError(f"line {n}: {k} required")
                if not isinstance(o["run_id"],str) or not isinstance(o["phase"],str): raise ValueError(f"line {n}: run_id/phase must be strings")
                if o["event"] not in {"start","end","mark"}: raise ValueError(f"line {n}: invalid event")
                if not isinstance(o["ts_ms"],(int,float)): raise ValueError(f"line {n}: ts_ms numeric required")
                rows.append(o)
    except (OSError,json.JSONDecodeError,ValueError) as e: raise RuntimeError(f"{path}: {e}") from e
    return rows

def profile(rows):
    by=defaultdict(list)
    for r in rows: by[r["run_id"]].append(r)
    result={}
    for rid,evs in by.items():
        evs=sorted(evs,key=lambda x:x["ts_ms"])
        if not evs: continue
        origin=evs[0]["ts_ms"]; starts={}; durations=defaultdict(float); marks={}; errors=[]
        for e in evs:
            p=e["phase"]; kind=e["event"]; ts=e["ts_ms"]
            if kind=="start":
                if p in starts: errors.append(f"overlapping start:{p}")
                else: starts[p]=ts
            elif kind=="end":
                if p not in starts: errors.append(f"end without start:{p}")
                else:
                    d=ts-starts.pop(p)
                    if d<0: errors.append(f"negative duration:{p}")
                    else: durations[p]+=d
            else:
                if p in MARKS and p not in marks: marks[p]=ts-origin
        for p in sorted(starts): errors.append(f"missing end:{p}")
        total=evs[-1]["ts_ms"]-origin
        attributed=sum(durations.values())
        result[rid]={"total_ms":total,"phases_ms":dict(sorted(durations.items())),"time_to_first_provider_event_ms":marks.get("provider_event"),"time_to_first_business_action_ms":marks.get("business_action"),"time_to_first_visible_output_ms":marks.get("visible_output"),"attributed_ms":attributed,"unattributed_ratio":max(0.0,(total-attributed)/total) if total>0 else 0.0,"errors":errors,"valid":not errors}
    return result

def main(argv=None):
    ap=argparse.ArgumentParser(); ap.add_argument("trace",type=Path); ns=ap.parse_args(argv)
    try: out=profile(load(ns.trace))
    except RuntimeError as e: print(json.dumps({"valid":False,"error":str(e)})); return 2
    valid=bool(out) and all(v["valid"] for v in out.values())
    print(json.dumps({"valid":valid,"runs":out},sort_keys=True))
    return 0 if valid else 1
if __name__=="__main__": raise SystemExit(main())

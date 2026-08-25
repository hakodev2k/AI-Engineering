#!/usr/bin/env python3
"""Validate single-writer, idempotent history append traces."""
from __future__ import annotations
import argparse, json, sys
from collections import Counter, defaultdict
from pathlib import Path

ACTIVE_APPEND_MODES={"append","authoritative_append"}

def validate(trace):
    if not isinstance(trace, dict): raise ValueError("trace must be an object")
    writers=trace.get("writers"); events=trace.get("events")
    if not isinstance(writers,list) or not isinstance(events,list):
        raise ValueError("writers and events must be arrays")
    writer_modes={}
    for i,w in enumerate(writers):
        if not isinstance(w,dict) or not isinstance(w.get("id"),str) or not w["id"]:
            raise ValueError(f"writer {i} requires non-empty id")
        if w["id"] in writer_modes: raise ValueError(f"duplicate writer id: {w['id']}")
        mode=w.get("mode","disabled")
        if mode not in {"append","authoritative_append","replace","loader","observer","disabled"}:
            raise ValueError(f"invalid writer mode: {mode}")
        writer_modes[w["id"]]=mode
    active=[wid for wid,mode in writer_modes.items() if mode in ACTIVE_APPEND_MODES]
    counts=Counter(); by_writer=defaultdict(int); unknown=[]; non_append_event_writers=[]
    for i,e in enumerate(events):
        if not isinstance(e,dict) or not isinstance(e.get("writer"),str) or not isinstance(e.get("message_ids"),list):
            raise ValueError(f"event {i} requires writer and message_ids")
        wid=e["writer"]
        if wid not in writer_modes:
            unknown.append(wid)
        elif writer_modes[wid] not in ACTIVE_APPEND_MODES:
            non_append_event_writers.append(wid)
        for mid in e["message_ids"]:
            if not isinstance(mid,str) or not mid: raise ValueError(f"event {i} has invalid message id")
            counts[mid]+=1; by_writer[wid]+=1
    dups=sorted([mid for mid,n in counts.items() if n>1])
    total=sum(counts.values()); unique=len(counts); amplification=(total/unique if unique else 1.0)
    reasons=[]
    if len(active)!=1: reasons.append("active_append_writer_count_not_one")
    if dups: reasons.append("duplicate_message_commits")
    if unknown: reasons.append("unknown_writer")
    if non_append_event_writers: reasons.append("event_from_non_append_writer")
    ok=not reasons
    return ok,{"active_append_writers":active,"active_append_writer_count":len(active),"append_events":total,"unique_message_ids":unique,"duplicate_commits":len(dups),"duplicate_message_ids":dups,"unknown_writers":sorted(set(unknown)),"non_append_event_writers":sorted(set(non_append_event_writers)),"append_amplification":round(amplification,6),"reasons":reasons}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("trace",type=Path); args=ap.parse_args()
    try:
        trace=json.loads(args.trace.read_text(encoding="utf-8")); ok,r=validate(trace)
    except (OSError,json.JSONDecodeError,ValueError) as e:
        print(f"history_guard_error: {e}",file=sys.stderr); return 1
    print(json.dumps({"status":"valid" if ok else "blocked",**r},sort_keys=True))
    return 0 if ok else 2
if __name__=="__main__": raise SystemExit(main())

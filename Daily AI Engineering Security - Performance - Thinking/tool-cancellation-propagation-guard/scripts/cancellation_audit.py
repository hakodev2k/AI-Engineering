#!/usr/bin/env python3
"""Audit structured agent lifecycle events for cancellation quiescence.

JSONL event schema:
{"ts_ms": 1000, "run_id": "r1", "kind": "cancel_requested", "resource_id": "run"}
{"ts_ms": 1100, "run_id": "r1", "kind": "resource_stopped", "resource_id": "tool:1"}
Supported kinds: resource_started, resource_stopped, cancel_requested,
cancel_observed, state_write, external_write, stream_event.

Exit codes: 0 pass, 2 invalid input, 3 missing cancellation, 4 leak/late activity.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

ALLOWED = {"resource_started","resource_stopped","cancel_requested","cancel_observed","state_write","external_write","stream_event"}


def load(path: Path, run_id: str):
    events=[]
    try:
        with path.open(encoding="utf-8") as f:
            for n,line in enumerate(f,1):
                if not line.strip(): continue
                obj=json.loads(line)
                if not isinstance(obj,dict): raise ValueError(f"line {n}: object required")
                if obj.get("run_id") != run_id: continue
                ts=obj.get("ts_ms"); kind=obj.get("kind"); rid=obj.get("resource_id")
                if not isinstance(ts,(int,float)) or ts < 0: raise ValueError(f"line {n}: invalid ts_ms")
                if kind not in ALLOWED: raise ValueError(f"line {n}: unsupported kind {kind!r}")
                if not isinstance(rid,str) or not rid: raise ValueError(f"line {n}: invalid resource_id")
                events.append(obj)
    except (OSError,json.JSONDecodeError,ValueError) as exc:
        raise ValueError(str(exc)) from exc
    return sorted(events,key=lambda x:x["ts_ms"])


def main():
    p=argparse.ArgumentParser()
    p.add_argument("events",type=Path); p.add_argument("--run-id",required=True); p.add_argument("--grace-ms",type=int,default=5000)
    a=p.parse_args()
    if a.grace_ms < 0:
        print(json.dumps({"status":"invalid","error":"grace-ms must be non-negative"}),file=sys.stderr); return 2
    try: events=load(a.events,a.run_id)
    except ValueError as exc:
        print(json.dumps({"status":"invalid","error":str(exc)}),file=sys.stderr); return 2
    cancels=[e for e in events if e["kind"]=="cancel_requested"]
    if not cancels:
        print(json.dumps({"status":"missing_cancel","run_id":a.run_id})); return 3
    cancel_ts=min(e["ts_ms"] for e in cancels); deadline=cancel_ts+a.grace_ms
    active=set(); late=[]; observed=[]
    for e in events:
        rid=e["resource_id"]; k=e["kind"]; ts=e["ts_ms"]
        if k=="resource_started": active.add(rid)
        elif k=="resource_stopped": active.discard(rid)
        elif k=="cancel_observed": observed.append(rid)
        if ts > deadline and k in {"state_write","external_write","stream_event","resource_started"}:
            late.append({"ts_ms":ts,"kind":k,"resource_id":rid})
    result={"status":"pass" if not active and not late else "fail","run_id":a.run_id,"cancel_ts_ms":cancel_ts,"deadline_ms":deadline,"cancel_observed_by":sorted(set(observed)),"active_resources":sorted(active),"late_events":late}
    print(json.dumps(result,indent=2))
    return 0 if result["status"]=="pass" else 4

if __name__=="__main__": raise SystemExit(main())

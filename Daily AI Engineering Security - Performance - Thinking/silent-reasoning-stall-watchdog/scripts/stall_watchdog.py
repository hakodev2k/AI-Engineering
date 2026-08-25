#!/usr/bin/env python3
"""Classify progress-silent agent turns from observable JSONL metadata."""
from __future__ import annotations
import argparse, json, sys
from datetime import datetime, timezone
from pathlib import Path

VISIBLE_KINDS = {"text", "tool_call", "tool_result", "terminal"}

def parse_ts(value: str) -> datetime:
    if value.endswith("Z"):
        value = value[:-1] + "+00:00"
    dt = datetime.fromisoformat(value)
    if dt.tzinfo is None:
        raise ValueError("timestamp must include timezone")
    return dt.astimezone(timezone.utc)

def load_events(path: Path):
    events=[]
    with path.open("r", encoding="utf-8") as f:
        for n,line in enumerate(f,1):
            if not line.strip(): continue
            try:
                obj=json.loads(line); obj["_ts"]=parse_ts(obj["ts"]); events.append(obj)
            except Exception as exc:
                raise ValueError(f"line {n}: {exc}") from exc
    if not events: raise ValueError("trace has no events")
    for a,b in zip(events,events[1:]):
        if b["_ts"] < a["_ts"]: raise ValueError("timestamps are not monotonic")
    return events

def visible(e):
    return bool(e.get("visible_progress")) if "visible_progress" in e else e.get("kind") in VISIBLE_KINDS

def classify(events, now, silent_seconds, token_delta):
    if events[-1].get("kind") == "terminal": return "terminal",0,{}
    last_event=events[-1]["_ts"]
    vis=[e for e in events if visible(e)]
    last_visible=vis[-1]["_ts"] if vis else events[0]["_ts"]
    usage=[(e["_ts"],int(e["total_tokens"])) for e in events if "total_tokens" in e]
    for (_,a),(_,b) in zip(usage,usage[1:]):
        if b<a: raise ValueError("total_tokens decreased")
    event_age=max(0.0,(now-last_event).total_seconds())
    visible_age=max(0.0,(now-last_visible).total_seconds())
    delta=0
    if usage:
        prior=[v for ts,v in usage if ts<=last_visible]
        start=prior[-1] if prior else usage[0][1]
        delta=usage[-1][1]-start
    meta={"event_age_seconds":event_age,"visible_age_seconds":visible_age,"silent_token_delta":delta}
    if event_age>=silent_seconds: return "event_stream_stall",11,meta
    if visible_age>=silent_seconds and delta>=token_delta: return "silent_token_burn",10,meta
    return "healthy",0,meta

def main(argv=None):
    p=argparse.ArgumentParser(); p.add_argument("trace",type=Path); p.add_argument("--now"); p.add_argument("--silent-seconds",type=float,default=120.0); p.add_argument("--token-delta",type=int,default=8000); a=p.parse_args(argv)
    if a.silent_seconds<=0 or a.token_delta<0:
        print(json.dumps({"error":"thresholds must be positive/non-negative"}),file=sys.stderr); return 12
    try:
        ev=load_events(a.trace); now=parse_ts(a.now) if a.now else datetime.now(timezone.utc); state,code,meta=classify(ev,now,a.silent_seconds,a.token_delta); print(json.dumps({"state":state,**meta},sort_keys=True)); return code
    except Exception as exc:
        print(json.dumps({"error":str(exc)}),file=sys.stderr); return 12
if __name__=="__main__": raise SystemExit(main())

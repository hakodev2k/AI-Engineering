#!/usr/bin/env python3
"""Analyze model/tool traces with tool-yield latency as a first-class metric."""
from __future__ import annotations
import argparse, json, math, sys
from pathlib import Path

def percentile(xs, p):
    if not xs: return 0.0
    ys = sorted(xs); k = (len(ys)-1) * p; f = math.floor(k); c = math.ceil(k)
    return ys[f] if f == c else ys[f] * (c-k) + ys[c] * (k-f)

def load(path):
    events=[]
    with Path(path).open(encoding="utf-8") as f:
        for n,line in enumerate(f,1):
            if not line.strip(): continue
            e=json.loads(line); e["_line"]=n
            if "ts_ms" not in e or "type" not in e: raise ValueError(f"line {n}: ts_ms/type required")
            e["ts_ms"]=float(e["ts_ms"]); events.append(e)
    if not events: raise ValueError("empty trace")
    events.sort(key=lambda e:e["ts_ms"])
    return events

def analyze(events):
    starts={}; intervals=[]
    for e in events:
        if e["type"]=="tool_start":
            cid=e.get("call_id");
            if not cid: raise ValueError(f"line {e['_line']}: tool_start call_id required")
            if cid in starts: raise ValueError(f"duplicate tool_start {cid}")
            starts[cid]=e
        elif e["type"]=="tool_end":
            cid=e.get("call_id")
            if cid not in starts: raise ValueError(f"tool_end without start {cid}")
            s=starts.pop(cid); end=e["ts_ms"]
            if end < s["ts_ms"]: raise ValueError(f"negative tool duration {cid}")
            intervals.append({"start":s["ts_ms"],"end":end,"call_id":cid,"tool":s.get("tool"),"dependency_group":s.get("dependency_group")})
    if starts: raise ValueError("unclosed tool calls: "+",".join(sorted(starts)))
    intervals.sort(key=lambda x:x["start"])
    yields=[]
    for it in intervals:
        if not yields or it["start"] > yields[-1]["end"]:
            yields.append({"start":it["start"],"end":it["end"],"calls":[it]})
        else:
            yields[-1]["end"]=max(yields[-1]["end"],it["end"]); yields[-1]["calls"].append(it)
    yd=[y["end"]-y["start"] for y in yields]
    wall=events[-1]["ts_ms"]-events[0]["ts_ms"]
    tool_union=sum(yd)
    serial_candidates=[]
    for a,b in zip(intervals, intervals[1:]):
        if a["end"] <= b["start"] and a.get("dependency_group") and a.get("dependency_group")==b.get("dependency_group") and a["dependency_group"].startswith("independent:"):
            serial_candidates.append({"first":a["call_id"],"second":b["call_id"],"gap_ms":b["start"]-a["end"],"estimated_pair_saving_ms":min(a["end"]-a["start"], b["end"]-b["start"])+(b["start"]-a["end"])})
    return {"wall_ms":wall,"tool_calls":len(intervals),"tool_yields":len(yields),"yield_p50_ms":percentile(yd,.5),"yield_p95_ms":percentile(yd,.95),"tool_active_union_ms":tool_union,"non_tool_orchestration_ms":max(0.0,wall-tool_union),"serial_independent_candidates":serial_candidates}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("trace"); ap.add_argument("--max-yield-p95-ms",type=float); ap.add_argument("--json",action="store_true"); args=ap.parse_args()
    try:
        report=analyze(load(args.trace))
        if args.json: print(json.dumps(report,indent=2,sort_keys=True))
        else:
            for k,v in report.items(): print(f"{k}={v}")
        if args.max_yield_p95_ms is not None and report["yield_p95_ms"] > args.max_yield_p95_ms: return 2
        return 0
    except (OSError,ValueError,json.JSONDecodeError) as e:
        print(f"analysis failure: {e}",file=sys.stderr); return 1
if __name__=="__main__": raise SystemExit(main())

#!/usr/bin/env python3
"""Compare host responsiveness probe JSON files with explicit regression thresholds."""
from __future__ import annotations
import argparse, json, math, sys
from pathlib import Path

def load(path):
    d=json.loads(Path(path).read_text(encoding="utf-8"))
    gaps=d.get("gap_ms")
    if not isinstance(gaps,list) or not gaps or not all(isinstance(x,(int,float)) and x>=0 for x in gaps):
        raise ValueError(f"{path}: gap_ms must be a non-empty numeric list")
    return d

def pct(xs,p):
    s=sorted(float(x) for x in xs); i=(len(s)-1)*p; lo=math.floor(i); hi=math.ceil(i)
    return s[lo] if lo==hi else s[lo]*(hi-i)+s[hi]*(i-lo)

def metrics(d):
    g=d["gap_ms"]
    return {"samples":len(g),"p50_ms":pct(g,.50),"p95_ms":pct(g,.95),"p99_ms":pct(g,.99),"max_ms":max(g),"stall_gt_16_7":sum(x>16.7 for x in g),"stall_gt_33_3":sum(x>33.3 for x in g),"stall_gt_64":sum(x>64 for x in g),"process":d.get("process",{})}

def ratio(a,b):
    if a==0: return 1.0 if b==0 else float("inf")
    return b/a

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--baseline",required=True); ap.add_argument("--affected",required=True); ap.add_argument("--max-p95-ratio",type=float,default=1.5); ap.add_argument("--max-stall64-ratio",type=float,default=2.0); a=ap.parse_args()
    try: b=metrics(load(a.baseline)); c=metrics(load(a.affected))
    except (OSError,ValueError,json.JSONDecodeError) as e:
        print(json.dumps({"error":str(e)}),file=sys.stderr); return 1
    p95r=ratio(b["p95_ms"],c["p95_ms"]); s64r=ratio(b["stall_gt_64"],c["stall_gt_64"])
    regression=p95r>a.max_p95_ratio or s64r>a.max_stall64_ratio
    report={"baseline":b,"affected":c,"p95_ratio":p95r,"stall64_ratio":s64r,"thresholds":{"max_p95_ratio":a.max_p95_ratio,"max_stall64_ratio":a.max_stall64_ratio},"regression":regression}
    print(json.dumps(report,indent=2,sort_keys=True))
    return 2 if regression else 0
if __name__=="__main__": raise SystemExit(main())

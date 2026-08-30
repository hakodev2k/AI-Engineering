#!/usr/bin/env python3
"""Profile agent spans and optionally gate regressions against a baseline report."""
from __future__ import annotations
import argparse, json, math, statistics, sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

ALLOWED_KINDS={"llm","tool","retrieval","sandbox","queue","orchestration","other"}

def load(path:Path)->list[dict[str,Any]]:
    text=path.read_text(encoding="utf-8").strip()
    if not text:return []
    data=json.loads(text) if text.startswith("[") else [json.loads(x) for x in text.splitlines() if x.strip()]
    if not isinstance(data,list) or not all(isinstance(x,dict) for x in data):raise ValueError("input must contain JSON objects")
    return data

def pct(values:list[float],q:float)->float:
    if not values:return 0.0
    xs=sorted(values); i=(len(xs)-1)*q; lo=math.floor(i); hi=math.ceil(i)
    return xs[lo] if lo==hi else xs[lo]*(hi-i)+xs[hi]*(i-lo)

def analyze(rows:list[dict[str,Any]])->dict[str,Any]:
    task_time=defaultdict(float); kind_time=defaultdict(float); call_keys=Counter(); retries=0; qualities=[]
    for n,r in enumerate(rows,1):
        tid=r.get("task_id"); kind=r.get("kind","other"); dur=r.get("duration_ms")
        if not isinstance(tid,str) or not tid:raise ValueError(f"row {n}: task_id required")
        if kind not in ALLOWED_KINDS:kind="other"
        if not isinstance(dur,(int,float)) or dur<0:raise ValueError(f"row {n}: duration_ms must be non-negative")
        task_time[tid]+=float(dur); kind_time[kind]+=float(dur)
        key=r.get("call_key")
        if isinstance(key,str) and key:call_keys[key]+=1
        if r.get("retry_of") is not None:retries+=1
        if isinstance(r.get("quality_pass"),bool):qualities.append(r["quality_pass"])
    totals=list(task_time.values()); total=sum(totals); duplicate=sum(c-1 for c in call_keys.values() if c>1)
    return {"tasks":len(task_time),"spans":len(rows),"task_latency_ms":{"p50":pct(totals,.5),"p95":pct(totals,.95)},"latency_share":{k:(v/total if total else 0.0) for k,v in sorted(kind_time.items())},"duplicate_call_count":duplicate,"duplicate_call_rate":(duplicate/sum(call_keys.values()) if call_keys else 0.0),"retry_count":retries,"retry_amplification_ratio":(retries/len(rows) if rows else 0.0),"quality_pass_rate":(sum(qualities)/len(qualities) if qualities else None)}

def compare(current:dict[str,Any],base:dict[str,Any],max_p95_regression:float,min_quality:float)->list[str]:
    v=[]; bp=float(base.get("task_latency_ms",{}).get("p95",0)); cp=float(current["task_latency_ms"]["p95"])
    if bp>0 and cp>bp*(1+max_p95_regression):v.append("p95_latency_regression")
    q=current.get("quality_pass_rate")
    if q is not None and q<min_quality:v.append("quality_below_floor")
    return v

def main()->int:
    p=argparse.ArgumentParser();p.add_argument("input",type=Path);p.add_argument("--compare",type=Path);p.add_argument("--json-out",type=Path);p.add_argument("--max-p95-regression",type=float,default=0.05);p.add_argument("--min-quality",type=float,default=1.0);a=p.parse_args()
    try:
        report=analyze(load(a.input)); violations=[]
        if a.compare:violations=compare(report,json.loads(a.compare.read_text(encoding="utf-8")),a.max_p95_regression,a.min_quality)
        report["violations"]=violations;report["ok"]=not violations;out=json.dumps(report,indent=2,sort_keys=True);print(out)
        if a.json_out:a.json_out.write_text(out+"\n",encoding="utf-8")
        return 0 if report["ok"] else 1
    except (OSError,ValueError,json.JSONDecodeError) as e:print(f"error: {e}",file=sys.stderr);return 2
if __name__=="__main__":raise SystemExit(main())

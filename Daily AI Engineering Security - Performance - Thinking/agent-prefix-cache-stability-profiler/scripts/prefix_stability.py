#!/usr/bin/env python3
"""Measure prefix volatility and cache/latency regressions from JSONL traces."""
from __future__ import annotations
import argparse, hashlib, json, math, statistics, sys
from collections import defaultdict
from pathlib import Path

INVALID, REGRESSION = 2, 3

def load_json(path: Path):
    try: value=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value,dict): raise ValueError("policy must be a JSON object")
    return value

def canon(value, order_insensitive=False):
    if isinstance(value,dict):
        return {k:canon(value[k],False) for k in sorted(value)}
    if isinstance(value,list):
        vals=[canon(v,False) for v in value]
        if order_insensitive:
            vals=sorted(vals,key=lambda x:json.dumps(x,sort_keys=True,separators=(",",":")))
        return vals
    if value is None or isinstance(value,(str,int,float,bool)): return value
    raise ValueError(f"unsupported value type: {type(value).__name__}")

def digest(value, order_insensitive=False):
    raw=json.dumps(canon(value,order_insensitive),sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()

def percentile(xs,p):
    if not xs:return 0.0
    ys=sorted(xs); pos=(len(ys)-1)*p; lo=math.floor(pos); hi=math.ceil(pos)
    return ys[lo] if lo==hi else ys[lo]+(ys[hi]-ys[lo])*(pos-lo)

def read_rows(path:Path):
    rows=[]
    try: lines=path.read_text(encoding="utf-8").splitlines()
    except OSError as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    for n,line in enumerate(lines,1):
        if not line.strip(): continue
        try:r=json.loads(line)
        except json.JSONDecodeError as exc: raise ValueError(f"line {n}: invalid JSON: {exc}") from exc
        if not isinstance(r,dict):raise ValueError(f"line {n}: row must be object")
        for k in ("task_id","variant"):
            if not isinstance(r.get(k),str) or not r[k]:raise ValueError(f"line {n}: {k} must be non-empty string")
        if not isinstance(r.get("prefix_sections"),dict):raise ValueError(f"line {n}: prefix_sections must be object")
        for k in ("input_tokens","cached_tokens","cache_write_tokens","latency_ms"):
            v=r.get(k,0)
            if isinstance(v,bool) or not isinstance(v,(int,float)) or v<0:raise ValueError(f"line {n}: {k} must be non-negative number")
        if r.get("cached_tokens",0)>r.get("input_tokens",0):raise ValueError(f"line {n}: cached_tokens exceeds input_tokens")
        rows.append(r)
    if not rows:raise ValueError("trace contains no rows")
    return rows

def summarize(rows,policy):
    stable=policy.get("stable_sections",[]); oi=set(policy.get("order_insensitive_sections",[]))
    if not isinstance(stable,list) or not all(isinstance(x,str) for x in stable):raise ValueError("stable_sections must be string list")
    section_hashes=defaultdict(list); by_variant=defaultdict(list)
    for r in rows:
        by_variant[r["variant"]].append(r)
        for s in stable:
            if s in r["prefix_sections"]:section_hashes[s].append(digest(r["prefix_sections"][s],s in oi))
    changes={}
    for s,hs in section_hashes.items():
        transitions=max(0,len(hs)-1); changed=sum(a!=b for a,b in zip(hs,hs[1:])); changes[s]=changed/transitions if transitions else 0.0
    variants={}
    for name,rs in by_variant.items():
        inp=sum(x.get("input_tokens",0) for x in rs); cached=sum(x.get("cached_tokens",0) for x in rs); writes=sum(x.get("cache_write_tokens",0) for x in rs)
        lat=[float(x.get("latency_ms",0)) for x in rs]
        variants[name]={"requests":len(rs),"input_tokens":inp,"cached_tokens":cached,"cache_write_tokens":writes,"uncached_tokens":max(0,inp-cached),"cache_ratio":cached/inp if inp else 0.0,"cache_write_ratio":writes/inp if inp else 0.0,"p50_latency_ms":percentile(lat,.50),"p95_latency_ms":percentile(lat,.95)}
    return changes,variants

def main():
    ap=argparse.ArgumentParser();ap.add_argument("trace",type=Path);ap.add_argument("--policy",type=Path,required=True);ap.add_argument("--output",type=Path);ap.add_argument("--quality-pass",choices=["true","false"])
    a=ap.parse_args()
    try:
        policy=load_json(a.policy);rows=read_rows(a.trace);changes,variants=summarize(rows,policy)
        base=variants.get(policy.get("baseline_variant","baseline"));cand=variants.get(policy.get("candidate_variant","candidate")); findings=[]
        max_change=float(policy.get("max_stable_section_change_rate",.1))
        for s,v in changes.items():
            if v>max_change: findings.append(f"stable section {s} change rate {v:.3f} exceeds {max_change:.3f}")
        if cand:
            if cand["cache_ratio"]<float(policy.get("min_candidate_cache_ratio",0)):findings.append("candidate cache ratio below minimum")
            if base:
                if cand["cache_ratio"] < base["cache_ratio"]-float(policy.get("max_cache_ratio_drop",.02)):findings.append("candidate cache ratio regressed")
                if base["p95_latency_ms"]>0:
                    reg=(cand["p95_latency_ms"]/base["p95_latency_ms"]-1)*100
                    if reg>float(policy.get("max_p95_latency_regression_pct",5)):findings.append(f"candidate p95 latency regressed {reg:.2f}%")
        if policy.get("require_quality_gate",True) and a.quality_pass != "true":findings.append("quality gate was not explicitly passed")
        report={"section_change_rate":changes,"variants":variants,"findings":findings,"status":"regression" if findings else "pass"}
        text=json.dumps(report,indent=2,sort_keys=True); print(text)
        if a.output:a.output.write_text(text+"\n",encoding="utf-8")
        return REGRESSION if findings else 0
    except (ValueError,TypeError,OSError) as exc:
        print(json.dumps({"status":"invalid","error":str(exc)}),file=sys.stderr);return INVALID
if __name__=="__main__":raise SystemExit(main())

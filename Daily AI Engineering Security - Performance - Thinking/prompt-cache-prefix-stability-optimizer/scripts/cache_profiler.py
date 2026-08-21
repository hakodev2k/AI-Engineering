#!/usr/bin/env python3
"""Profile exact prompt-segment stability and cache telemetry from JSONL samples.

Each line must be an object:
{
  "segments": [{"name":"system","content":"...","expected_stable":true}],
  "input_tokens": 10000,
  "cached_tokens": 8000,
  "latency_ms": 1200,
  "cost_usd": 0.02,
  "quality_ok": true
}

Raw content is hashed in memory and never emitted. Exit 0 success, 2 invalid,
3 strict comparison/threshold failure.
"""
from __future__ import annotations
import argparse, hashlib, json, statistics, sys
from pathlib import Path


def load_json(path: Path) -> dict:
    try: value=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value,dict): raise ValueError(f"{path} must contain an object")
    return value


def load_jsonl(path: Path) -> list[dict]:
    rows=[]
    try: lines=path.read_text(encoding="utf-8").splitlines()
    except OSError as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    for n,line in enumerate(lines,1):
        if not line.strip(): continue
        try: row=json.loads(line)
        except json.JSONDecodeError as exc: raise ValueError(f"{path}:{n}: invalid JSON: {exc}") from exc
        if not isinstance(row,dict): raise ValueError(f"{path}:{n}: row must be object")
        rows.append(row)
    if not rows: raise ValueError(f"{path}: no samples")
    return rows


def nonneg(row:dict,key:str,required:bool=False):
    if key not in row:
        if required: raise ValueError(f"missing {key}")
        return None
    v=row[key]
    if not isinstance(v,(int,float)) or isinstance(v,bool) or v<0: raise ValueError(f"{key} must be non-negative number")
    return float(v)


def parse_segments(row:dict) -> list[dict]:
    segs=row.get("segments")
    if not isinstance(segs,list) or not segs: raise ValueError("segments must be a non-empty list")
    out=[]
    for s in segs:
        if not isinstance(s,dict): raise ValueError("each segment must be object")
        name=s.get("name"); content=s.get("content"); stable=s.get("expected_stable",False)
        if not isinstance(name,str) or not name: raise ValueError("segment name must be non-empty string")
        if not isinstance(content,str): raise ValueError(f"segment {name}: content must be string")
        if not isinstance(stable,bool): raise ValueError(f"segment {name}: expected_stable must be boolean")
        out.append({"name":name,"hash":hashlib.sha256(content.encode("utf-8")).hexdigest(),"bytes":len(content.encode("utf-8")),"expected_stable":stable})
    return out


def profile(rows:list[dict]) -> dict:
    parsed=[]; ratios=[]; latencies=[]; costs=[]; quality=[]
    for row in rows:
        segs=parse_segments(row); parsed.append(segs)
        inp=nonneg(row,"input_tokens",True); cached=nonneg(row,"cached_tokens",True)
        if inp == 0: raise ValueError("input_tokens must be > 0")
        if cached > inp: raise ValueError("cached_tokens cannot exceed input_tokens")
        ratios.append(cached/inp)
        lat=nonneg(row,"latency_ms"); cost=nonneg(row,"cost_usd")
        if lat is not None: latencies.append(lat)
        if cost is not None: costs.append(cost)
        if "quality_ok" in row:
            if not isinstance(row["quality_ok"],bool): raise ValueError("quality_ok must be boolean")
            quality.append(row["quality_ok"])

    variants:dict[str,set[str]]={}; expected:dict[str,bool]={}
    for segs in parsed:
        for s in segs:
            variants.setdefault(s["name"],set()).add(s["hash"])
            expected[s["name"]]=expected.get(s["name"],False) or s["expected_stable"]

    divergent=[]
    first=None
    ref=parsed[0]
    for i,other in enumerate(parsed[1:],1):
        limit=min(len(ref),len(other)); found=None
        for j in range(limit):
            if ref[j]["name"] != other[j]["name"] or ref[j]["hash"] != other[j]["hash"]:
                found={"sample":i,"index":j,"reference":ref[j]["name"],"other":other[j]["name"]}; break
        if found is None and len(ref)!=len(other): found={"sample":i,"index":limit,"reference":"<end>" if len(ref)==limit else ref[limit]["name"],"other":"<end>" if len(other)==limit else other[limit]["name"]}
        if found:
            divergent.append(found)
            if first is None or found["index"] < first["index"]: first=found

    stable_violations={name:len(hashes) for name,hashes in variants.items() if expected.get(name) and len(hashes)>1}
    qrate=None if not quality else sum(1 for x in quality if x)/len(quality)
    return {
        "samples":len(rows),
        "mean_cached_input_ratio":sum(ratios)/len(ratios),
        "median_cached_input_ratio":statistics.median(ratios),
        "mean_latency_ms":None if not latencies else sum(latencies)/len(latencies),
        "mean_cost_usd":None if not costs else sum(costs)/len(costs),
        "quality_success_rate":qrate,
        "first_divergence":first,
        "divergent_sample_count":len(divergent),
        "expected_stable_hash_variants":stable_violations,
    }


def compare(base:dict,cand:dict,thr:dict) -> dict:
    reasons=[]
    minimum=int(thr.get("minimum_comparable_samples",5))
    if base["samples"]<minimum or cand["samples"]<minimum: reasons.append("insufficient comparable samples")
    target=float(thr.get("minimum_cached_input_ratio",0.60))
    if cand["mean_cached_input_ratio"]<target and cand["mean_cached_input_ratio"]<=base["mean_cached_input_ratio"]:
        reasons.append("candidate cache ratio neither meets target nor improves baseline")
    max_variants=int(thr.get("stable_segment_hash_variants_allowed",1))
    if any(v>max_variants for v in cand["expected_stable_hash_variants"].values()): reasons.append("candidate has unstable expected-stable segment")
    if thr.get("require_quality_evidence",True) and (base["quality_success_rate"] is None or cand["quality_success_rate"] is None):
        reasons.append("quality evidence missing")
    if base["quality_success_rate"] is not None and cand["quality_success_rate"] is not None:
        regression=base["quality_success_rate"]-cand["quality_success_rate"]
        if regression>float(thr.get("maximum_quality_regression_rate",0.01)): reasons.append("quality regression exceeds threshold")
    else: regression=None
    latency_regression=None
    if base["mean_latency_ms"] is not None and cand["mean_latency_ms"] is not None and base["mean_latency_ms"]>0:
        latency_regression=(cand["mean_latency_ms"]-base["mean_latency_ms"])/base["mean_latency_ms"]
        if latency_regression>float(thr.get("maximum_latency_regression_ratio",0.05)): reasons.append("latency regression exceeds threshold")
    return {"decision":"pass" if not reasons else "fail","cache_ratio_delta":cand["mean_cached_input_ratio"]-base["mean_cached_input_ratio"],"quality_regression":regression,"latency_regression_ratio":latency_regression,"reasons":reasons}


def main() -> int:
    p=argparse.ArgumentParser(); p.add_argument("baseline",type=Path); p.add_argument("--candidate",type=Path); p.add_argument("--thresholds",type=Path,required=True); p.add_argument("--strict",action="store_true")
    a=p.parse_args()
    try:
        thresholds=load_json(a.thresholds); base=profile(load_jsonl(a.baseline)); result={"baseline":base}
        if a.candidate:
            cand=profile(load_jsonl(a.candidate)); result["candidate"]=cand; result["comparison"]=compare(base,cand,thresholds)
    except (ValueError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2
    print(json.dumps(result,indent=2))
    if a.strict and result.get("comparison",{}).get("decision")=="fail": return 3
    return 0

if __name__=="__main__": raise SystemExit(main())

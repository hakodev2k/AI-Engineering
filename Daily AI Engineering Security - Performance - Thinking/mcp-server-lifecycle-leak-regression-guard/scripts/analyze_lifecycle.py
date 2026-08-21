#!/usr/bin/env python3
"""Analyze MCP lifecycle benchmark JSONL and enforce regression thresholds.

Each JSON line is one sample:
{"request":1,"server_id":"abc","heap_used_mb":120.4,"latency_ms":12.1,"ok":true}
A final teardown record may include:
{"event":"teardown","clean":true,"error":null}
Exit: 0 pass, 2 invalid input/config, 3 regression block.
"""
from __future__ import annotations
import argparse, json, math, statistics, sys
from pathlib import Path


def load_json(path: Path) -> dict:
    try: value=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value,dict): raise ValueError(f"{path} must contain an object")
    return value


def percentile(values, p):
    if not values: return None
    values=sorted(values)
    k=(len(values)-1)*(p/100.0)
    f=math.floor(k); c=math.ceil(k)
    if f==c: return values[int(k)]
    return values[f]*(c-k)+values[c]*(k-f)


def slope_per_1000(samples):
    if len(samples)<2: return 0.0
    xs=[float(s["request"]) for s in samples]; ys=[float(s["heap_used_mb"]) for s in samples]
    mx=statistics.fmean(xs); my=statistics.fmean(ys)
    denom=sum((x-mx)**2 for x in xs)
    if denom==0: return 0.0
    slope=sum((x-mx)*(y-my) for x,y in zip(xs,ys))/denom
    return slope*1000.0


def main():
    p=argparse.ArgumentParser(); p.add_argument("jsonl",type=Path); p.add_argument("--thresholds",type=Path,required=True); p.add_argument("--baseline-p95-ms",type=float)
    a=p.parse_args()
    try:
        cfg=load_json(a.thresholds)
        lines=a.jsonl.read_text(encoding="utf-8").splitlines()
        records=[json.loads(line) for line in lines if line.strip()]
        if not records or not all(isinstance(x,dict) for x in records): raise ValueError("JSONL must contain objects")
        teardown=[r for r in records if r.get("event")=="teardown"]
        req=[]
        for r in records:
            if r.get("event")=="teardown": continue
            for key in ("request","server_id","heap_used_mb","latency_ms","ok"):
                if key not in r: raise ValueError(f"request record missing {key}")
            if not isinstance(r["request"],int) or r["request"]<1: raise ValueError("request must be positive integer")
            if not isinstance(r["server_id"],str) or not r["server_id"]: raise ValueError("server_id must be non-empty string")
            if not isinstance(r["ok"],bool): raise ValueError("ok must be boolean")
            for key in ("heap_used_mb","latency_ms"):
                if not isinstance(r[key],(int,float)) or isinstance(r[key],bool) or r[key]<0: raise ValueError(f"{key} must be non-negative number")
            req.append(r)
        warm=int(cfg.get("warmup_requests",1000)); measured=[r for r in req if r["request"]>warm]
        findings=[]
        if len(measured)<int(cfg.get("minimum_measured_requests",5000)): findings.append("insufficient measured requests after warmup")
        ids=[r["server_id"] for r in req]
        duplicate_count=len(ids)-len(set(ids))
        if cfg.get("require_unique_server_instance_per_request",True) and duplicate_count>0: findings.append(f"duplicate server identities observed: {duplicate_count}")
        heap_slope=slope_per_1000(measured)
        if heap_slope>float(cfg.get("max_heap_growth_mb_per_1000_requests",1.0)): findings.append(f"heap slope {heap_slope:.3f} MB/1k exceeds threshold")
        error_rate=(100.0*sum(1 for r in measured if not r["ok"])/len(measured)) if measured else 100.0
        if error_rate>float(cfg.get("max_error_rate_percent",0.1)): findings.append(f"error rate {error_rate:.3f}% exceeds threshold")
        p95=percentile([float(r["latency_ms"]) for r in measured],95)
        regression=None
        if a.baseline_p95_ms is not None:
            if a.baseline_p95_ms<=0: raise ValueError("baseline p95 must be > 0")
            regression=100.0*((p95-a.baseline_p95_ms)/a.baseline_p95_ms) if p95 is not None else None
            if regression is not None and regression>float(cfg.get("max_p95_latency_regression_percent",15.0)): findings.append(f"p95 regression {regression:.2f}% exceeds threshold")
        clean=bool(teardown and teardown[-1].get("clean") is True and not teardown[-1].get("error"))
        if cfg.get("require_clean_teardown",True) and not clean: findings.append("clean teardown evidence missing or failed")
        result={"decision":"block" if findings else "pass","requests":len(req),"measured_requests":len(measured),"duplicate_server_instances":duplicate_count,"heap_growth_mb_per_1000_requests":round(heap_slope,4),"p95_latency_ms":None if p95 is None else round(p95,4),"p95_regression_percent":None if regression is None else round(regression,4),"error_rate_percent":round(error_rate,4),"clean_teardown":clean,"findings":findings}
    except (OSError,json.JSONDecodeError,ValueError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2
    print(json.dumps(result,indent=2)); return 3 if findings else 0

if __name__=="__main__": raise SystemExit(main())

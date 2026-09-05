#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,sys
from pathlib import Path
FIELDS=["provider","model","model_revision","dimensions","normalization","distance_metric","chunking_fingerprint","index_namespace"]
REQUIRED=FIELDS+["index_generation","rebuild_complete"]
def load(p):
    try:d=json.loads(Path(p).read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e: raise ValueError(str(e))
    if not isinstance(d,dict): raise ValueError("manifest must be object")
    miss=[k for k in REQUIRED if k not in d]
    if miss: raise ValueError("missing fields: "+", ".join(miss))
    if not isinstance(d["dimensions"],int) or d["dimensions"]<1: raise ValueError("dimensions must be positive integer")
    if d["normalization"] not in ("unit","none"): raise ValueError("invalid normalization")
    if d["distance_metric"] not in ("cosine","dot","l2"): raise ValueError("invalid distance_metric")
    if not isinstance(d["rebuild_complete"],bool): raise ValueError("rebuild_complete must be boolean")
    return d
def compare(b,c):
    changes=[{"field":k,"baseline":b[k],"candidate":c[k]} for k in FIELDS if b[k]!=c[k]]
    gen=c["index_generation"]!=b["index_generation"]
    safe=not changes or (gen and c["rebuild_complete"] is True)
    return {"status":"pass" if safe else "fail","breaking_changes":changes,"generation_changed":gen,"rebuild_complete":c["rebuild_complete"]}
def main():
    p=argparse.ArgumentParser();p.add_argument("--baseline",required=True);p.add_argument("--candidate",required=True);p.add_argument("--output",required=True);a=p.parse_args()
    try:r=compare(load(a.baseline),load(a.candidate))
    except ValueError as e: print(f"validation error: {e}",file=sys.stderr);return 2
    Path(a.output).write_text(json.dumps(r,indent=2)+"\n",encoding="utf-8")
    if r["status"]=="fail": print("embedding/index compatibility failed",file=sys.stderr);return 1
    print("embedding/index compatibility passed");return 0
if __name__=="__main__":raise SystemExit(main())

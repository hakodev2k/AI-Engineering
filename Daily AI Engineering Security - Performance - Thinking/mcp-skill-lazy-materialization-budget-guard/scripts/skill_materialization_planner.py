#!/usr/bin/env python3
"""Create a bounded lazy fetch plan for Skills-over-MCP catalog data."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

def load_json(path):
    data=json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, dict): raise ValueError(f"{path}: object required")
    return data

def validate_config(c):
    for k in ("max_requests","max_bytes","max_concurrency"):
        if int(c.get(k,0)) <= 0: raise ValueError(f"invalid_{k}")
    r=float(c.get("min_relevance",0.0))
    if not 0 <= r <= 1: raise ValueError("invalid_min_relevance")

def plan(catalog, config):
    validate_config(config)
    skills=catalog.get("skills")
    if not isinstance(skills,list): raise ValueError("catalog.skills must be a list")
    max_req=int(config["max_requests"]); max_bytes=int(config["max_bytes"]); threshold=float(config.get("min_relevance",0))
    candidates=[]
    for s in skills:
        sid=str(s.get("id",""))
        if not sid: raise ValueError("skill_missing_id")
        rel=float(s.get("relevance",0)); req=bool(s.get("required",False))
        if not req and rel < threshold: continue
        resources=s.get("resources",[])
        if not isinstance(resources,list): raise ValueError(f"{sid}: resources must be list")
        candidates.append((0 if req else 1, -rel, sid, req, resources))
    candidates.sort()
    seen=set(); fetch=[]; skipped=[]; req_count=0; byte_count=0; required_over_budget=[]
    for _, negrel, sid, required, resources in candidates:
        for r in resources:
            uri=str(r.get("uri","")); digest=str(r.get("digest","")); size=int(r.get("size",0))
            if not uri: raise ValueError(f"{sid}: resource_missing_uri")
            if size < 0: raise ValueError(f"{sid}:{uri}: invalid_size")
            key=(uri,digest)
            if key in seen:
                skipped.append({"skill":sid,"uri":uri,"reason":"duplicate"}); continue
            seen.add(key)
            if digest and r.get("cached_digest")==digest:
                skipped.append({"skill":sid,"uri":uri,"reason":"cache_hit"}); continue
            would_req=req_count+1; would_bytes=byte_count+size
            if would_req>max_req or would_bytes>max_bytes:
                entry={"skill":sid,"uri":uri,"reason":"budget","required":required}; skipped.append(entry)
                if required: required_over_budget.append(entry)
                continue
            fetch.append({"skill":sid,"uri":uri,"digest":digest,"size":size,"required":required,"relevance":-negrel})
            req_count=would_req; byte_count=would_bytes
    status="required_budget_exceeded" if required_over_budget else "ok"
    concurrency=min(int(config["max_concurrency"]), max(1,req_count)) if req_count else 0
    return {"status":status,"projected_requests":req_count,"projected_bytes":byte_count,"max_concurrency":concurrency,"fetch":fetch,"skipped":skipped}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--catalog",required=True); ap.add_argument("--config",required=True); ap.add_argument("--output"); args=ap.parse_args()
    try:
        result=plan(load_json(args.catalog),load_json(args.config)); text=json.dumps(result,indent=2,sort_keys=True)
        if args.output: Path(args.output).write_text(text+"\n",encoding="utf-8")
        else: print(text)
        return 3 if result["status"]=="required_budget_exceeded" else 0
    except (OSError,json.JSONDecodeError,ValueError,TypeError) as exc:
        print(json.dumps({"status":"error","reason":str(exc)}),file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())

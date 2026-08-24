#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc

def main():
    p=argparse.ArgumentParser(description="Check agent bootstrap context against a model-aware budget")
    p.add_argument("--context-window", type=int, required=True)
    p.add_argument("--manifest", required=True)
    p.add_argument("--policy", required=True)
    args=p.parse_args()
    try:
        if args.context_window <= 0: raise ValueError("context window must be positive")
        manifest=load_json(args.manifest); policy=load_json(args.policy)
        if not isinstance(manifest,list): raise ValueError("manifest must be a JSON array")
        max_ratio=float(policy["max_bootstrap_ratio"]); task_ratio=float(policy["min_task_reserve_ratio"]); out_ratio=float(policy["min_output_reserve_ratio"])
        if max_ratio<=0 or task_ratio<0 or out_ratio<0 or max_ratio+task_ratio+out_ratio>1.000001: raise ValueError("invalid budget ratios")
        required_kinds=set(policy.get("required_kinds",[])); seen=set(); total=0; optional=[]
        for i,c in enumerate(manifest):
            if not isinstance(c,dict): raise ValueError(f"manifest[{i}] must be object")
            name=str(c.get("name",f"item-{i}")); kind=str(c.get("kind","other")); tokens=int(c.get("tokens",-1))
            if tokens < 0: raise ValueError(f"negative/missing tokens for {name}")
            required=bool(c.get("required",False)); priority=int(c.get("priority",100)); total += tokens
            if required: seen.add(kind)
            else: optional.append({"name":name,"kind":kind,"tokens":tokens,"priority":priority})
        missing=sorted(required_kinds-seen); cap=int(args.context_window*max_ratio)
        report={"status":"pass" if total<=cap and not missing else "fail","context_window":args.context_window,"bootstrap_tokens":total,"bootstrap_ratio":round(total/args.context_window,6),"bootstrap_cap":cap,"task_reserve":int(args.context_window*task_ratio),"output_reserve":int(args.context_window*out_ratio),"excess_tokens":max(0,total-cap),"missing_required_kinds":missing,"optional_eviction_candidates":sorted(optional,key=lambda x:(x["priority"],-x["tokens"]),reverse=True)}
        print(json.dumps(report,indent=2)); return 0 if report["status"]=="pass" else 2
    except (ValueError,KeyError,TypeError) as exc:
        print(json.dumps({"status":"error","error":str(exc)}),file=sys.stderr); return 1

if __name__=="__main__": sys.exit(main())

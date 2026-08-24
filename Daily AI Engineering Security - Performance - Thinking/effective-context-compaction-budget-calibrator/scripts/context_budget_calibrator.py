#!/usr/bin/env python3
import argparse,json,sys

def main():
    p=argparse.ArgumentParser(description="Validate effective context and compaction trigger accounting.")
    p.add_argument("snapshot")
    p.add_argument("--min-headroom-ratio",type=float,default=.10)
    p.add_argument("--max-accounting-error-ratio",type=float,default=.05)
    a=p.parse_args()
    try:
        with open(a.snapshot,encoding="utf-8") as f:d=json.load(f)
    except (OSError,json.JSONDecodeError) as e:
        print(f"error: {e}",file=sys.stderr);return 1
    req=["raw_window","reserved_output","provider_reserve","observed_prompt_tokens","runtime_counted_tokens","compaction_trigger_tokens"]
    if any(k not in d for k in req):
        print("error: missing required keys",file=sys.stderr);return 1
    try:v={k:int(d[k]) for k in req}
    except (TypeError,ValueError):
        print("error: required token values must be integers",file=sys.stderr);return 1
    if min(v.values())<0 or v["raw_window"]<=0:
        print("error: token values must be non-negative and raw_window > 0",file=sys.stderr);return 1
    usable=v["raw_window"]-v["reserved_output"]-v["provider_reserve"]
    if usable<=0:
        print("error: reserves consume the full context window",file=sys.stderr);return 1
    observed=v["observed_prompt_tokens"]
    err=abs(v["runtime_counted_tokens"]-observed)/max(observed,1)
    head=(usable-v["compaction_trigger_tokens"])/usable
    violations=[]
    if err>a.max_accounting_error_ratio:violations.append(f"accounting_error_ratio={err:.4f}")
    if v["compaction_trigger_tokens"]>usable:violations.append("trigger_exceeds_usable_context")
    if head<a.min_headroom_ratio:violations.append(f"headroom_ratio={head:.4f}")
    out={"raw_window":v["raw_window"],"usable_context":usable,"observed_prompt_tokens":observed,"runtime_counted_tokens":v["runtime_counted_tokens"],"accounting_error_ratio":round(err,6),"compaction_trigger_tokens":v["compaction_trigger_tokens"],"trigger_ratio_of_usable":round(v["compaction_trigger_tokens"]/usable,6),"headroom_ratio":round(head,6),"status":"fail" if violations else "pass","violations":violations}
    print(json.dumps(out,indent=2,sort_keys=True));return 2 if violations else 0

if __name__=="__main__":raise SystemExit(main())

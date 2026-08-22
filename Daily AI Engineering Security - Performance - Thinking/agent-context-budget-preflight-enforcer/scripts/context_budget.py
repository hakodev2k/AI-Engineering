#!/usr/bin/env python3
"""Analyze measured agent context components before a model call.
Exit 0 allow, 2 invalid input/config, 3 reduce/block required.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path


def load(path: Path) -> dict:
    try: obj=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj,dict): raise ValueError(f"{path} must contain object")
    return obj


def analyze(ctx: dict, policy: dict) -> tuple[dict,int]:
    window=policy.get("context_window_tokens"); reserve=policy.get("reserved_output_tokens"); margin=policy.get("safety_margin_tokens")
    for name,val in [("context_window_tokens",window),("reserved_output_tokens",reserve),("safety_margin_tokens",margin)]:
        if not isinstance(val,int) or val < 0: raise ValueError(f"{name} must be non-negative int")
    usable=window-reserve-margin
    if usable <= 0: raise ValueError("output reserve plus margin leaves no input budget")
    comps=ctx.get("components")
    if not isinstance(comps,list) or not comps: raise ValueError("components must be non-empty list")
    protected=set(policy.get("protected_kinds",[])); reducible_priorities=set(policy.get("reducible_priorities",["low","medium"]))
    total=0; protected_tokens=0; candidates=[]
    for i,c in enumerate(comps):
        if not isinstance(c,dict): raise ValueError(f"component {i} must be object")
        name=c.get("name"); kind=c.get("kind"); tok=c.get("tokens"); priority=c.get("priority","medium"); critical=bool(c.get("critical",False))
        if not isinstance(name,str) or not name: raise ValueError(f"component {i} name required")
        if not isinstance(kind,str) or not kind: raise ValueError(f"component {i} kind required")
        if not isinstance(tok,int) or tok < 0: raise ValueError(f"component {name} tokens invalid")
        total += tok
        is_protected = critical or kind in protected
        if is_protected: protected_tokens += tok
        elif priority in reducible_priorities:
            candidates.append({"name":name,"kind":kind,"tokens":tok,"priority":priority,"reloadable":bool(c.get("reloadable",False))})
    deficit=max(0,total-usable)
    candidates.sort(key=lambda x:(not x["reloadable"], x["priority"] != "low", -x["tokens"]))
    picked=[]; savings=0
    for c in candidates:
        if savings >= deficit: break
        picked.append(c); savings += c["tokens"]
    report={"total_input_tokens":total,"usable_input_budget":usable,"context_window_tokens":window,"reserved_output_tokens":reserve,"safety_margin_tokens":margin,"utilization":round(total/usable,4),"deficit_tokens":deficit,"protected_tokens":protected_tokens,"candidate_capacity_tokens":sum(x["tokens"] for x in candidates),"suggested_candidates":picked}
    if total <= usable:
        report["decision"]="allow"; return report,0
    if protected_tokens > usable or savings < deficit:
        report["decision"]="block"; report["reason"]="insufficient_safe_reduction_capacity"; return report,3
    report["decision"]="reduce"; report["reason"]="safe_candidates_available"; return report,3


def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument("context",type=Path); ap.add_argument("--policy",required=True,type=Path); a=ap.parse_args()
    try: out,code=analyze(load(a.context),load(a.policy))
    except (ValueError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2
    print(json.dumps(out,indent=2,sort_keys=True)); return code
if __name__=="__main__": raise SystemExit(main())

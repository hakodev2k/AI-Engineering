#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(path):
    try:
        data=json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read plan: {e}")
    if not isinstance(data,dict):
        raise ValueError("plan must be a JSON object")
    return data

def evaluate(plan,max_amplification=3.0,max_child_tokens=120000):
    parent=plan.get("parent_tokens")
    children=plan.get("children")
    if not isinstance(parent,int) or parent < 1:
        raise ValueError("parent_tokens must be a positive integer")
    if not isinstance(children,list) or not children:
        raise ValueError("children must be a non-empty list")
    total_projected=0
    reasons=[]
    child_metrics=[]
    for i,c in enumerate(children,1):
        for k in ("name","required_tokens","optional_inherited_tokens","expected_turns","context_window"):
            if k not in c:
                raise ValueError(f"child {i} missing {k}")
        numeric=(c["required_tokens"],c["optional_inherited_tokens"],c["expected_turns"],c["context_window"])
        if not all(isinstance(v,int) and v>=0 for v in numeric):
            raise ValueError(f"child {i} numeric fields must be non-negative integers")
        if c["expected_turns"] < 1 or c["context_window"] < 1:
            raise ValueError(f"child {i} expected_turns/context_window must be positive")
        per_turn=c["required_tokens"]+c["optional_inherited_tokens"]
        projected=per_turn*c["expected_turns"]
        total_projected += projected
        if per_turn > c["context_window"]:
            reasons.append(f"{c['name']}:context_window_exceeded")
        if per_turn > max_child_tokens:
            reasons.append(f"{c['name']}:child_budget_exceeded")
        child_metrics.append({"name":c["name"],"per_turn_tokens":per_turn,"projected_tokens":projected,"context_window":c["context_window"]})
    amplification=total_projected/parent
    if amplification > max_amplification:
        reasons.append("aggregate_amplification_exceeded")
    required_loss=bool(plan.get("required_context_removed",False))
    if required_loss:
        reasons.append("required_context_removed")
    if required_loss or any("context_window_exceeded" in r for r in reasons):
        decision="block-fanout"
    elif reasons:
        decision="reduce-context"
    else:
        decision="allow"
    return {"decision":decision,"reasons":reasons,"parent_tokens":parent,"projected_child_tokens":total_projected,"amplification_factor":round(amplification,4),"children":child_metrics}

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--plan",required=True)
    ap.add_argument("--max-amplification",type=float,default=3.0)
    ap.add_argument("--max-child-tokens",type=int,default=120000)
    a=ap.parse_args()
    if a.max_amplification <= 0 or a.max_child_tokens < 1:
        print("invalid thresholds",file=sys.stderr); return 2
    try:
        result=evaluate(load(a.plan),a.max_amplification,a.max_child_tokens)
    except ValueError as e:
        print(str(e),file=sys.stderr); return 2
    print(json.dumps(result,indent=2,sort_keys=True))
    return 0 if result["decision"]=="allow" else 3

if __name__=="__main__":
    raise SystemExit(main())

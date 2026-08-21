#!/usr/bin/env python3
import argparse, json, sys
from collections import defaultdict

def load(path):
    try:
        with open(path, "r", encoding="utf-8") as f: return json.load(f)
    except Exception as exc:
        print(json.dumps({"status":"block","reasons":[f"cannot load {path}: {exc}"]}, indent=2)); sys.exit(2)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--plan",required=True); ap.add_argument("--ledger",required=True); ap.add_argument("--policy",required=True); ap.add_argument("--next-stage"); ap.add_argument("--next-operation"); a=ap.parse_args()
    plan, ledger, policy=load(a.plan),load(a.ledger),load(a.policy)
    reasons=[]; approval=[]; spend=defaultdict(float); attempts=defaultdict(set); plan_ops={}
    for s in plan.get("stages",[]):
        for op in s.get("operations",[]): plan_ops[(s.get("name"),op.get("id"))]=op
    seen=set(); total=0.0
    if plan.get("task_id")!=ledger.get("task_id") or plan.get("currency")!=ledger.get("currency"): reasons.append("plan/ledger identity mismatch")
    for e in ledger.get("entries",[]):
        key=(e.get("stage"),e.get("operation"),e.get("attempt"))
        if key in seen: reasons.append(f"duplicate ledger key {key}")
        seen.add(key)
        c=e.get("actual_cost")
        if not isinstance(c,(int,float)) or c<0: reasons.append(f"invalid cost for {key}"); continue
        total+=c; spend[e.get("stage")]+=c; attempts[(e.get("stage"),e.get("operation"))].add(e.get("attempt"))
        if (e.get("stage"),e.get("operation")) not in plan_ops: reasons.append(f"unplanned metered operation {e.get('stage')}/{e.get('operation')}")
    hard=float(plan.get("task_hard_limit",0)); reserve=float(plan.get("verification_reserve",0)); soft=hard*float(policy.get("soft_limit_ratio",0.8))
    if total>hard+1e-9: reasons.append("task hard limit exceeded")
    stage_limits={s.get("name"):float(s.get("hard_limit",0)) for s in plan.get("stages",[])}
    for st,val in spend.items():
        if st in stage_limits and val>stage_limits[st]+1e-9: reasons.append(f"stage hard limit exceeded: {st}")
    nonver=total-spend.get("verification",0.0)
    if nonver>hard-reserve+1e-9: reasons.append("protected verification reserve consumed by non-verification work")
    max_attempts=1+int(policy.get("max_retries_per_operation",0))
    for key,vals in attempts.items():
        if len(vals)>max_attempts or (vals and max(vals)>max_attempts): reasons.append(f"retry cap exceeded: {key[0]}/{key[1]}")
    if total>=soft and not reasons: approval.append("task soft limit reached")
    if a.next_stage and a.next_operation:
        op=plan_ops.get((a.next_stage,a.next_operation))
        if not op: reasons.append("next operation is not in approved plan")
        else:
            cls=op.get("cost_class"); est=float(op.get("estimated_cost",0))
            if cls=="metered-unknown" and not policy.get("allow_unknown_cost_operations",False): approval.append("next operation has unknown metered cost")
            if cls=="high-cost" or est>=float(policy.get("high_cost_operation_threshold",2.0)): approval.append("next operation is high-cost")
            if total+est>hard+1e-9: reasons.append("next operation would exceed task hard limit")
            if a.next_stage!="verification" and nonver+est>hard-reserve+1e-9: reasons.append("next operation would consume verification reserve")
    status="block" if reasons else ("human-approval-required" if approval else "allow")
    print(json.dumps({"status":status,"reasons":reasons,"approval_reasons":approval,"actual_cost":round(total,8),"remaining_budget":round(max(0,hard-total),8)}, indent=2))
    sys.exit(0 if status=="allow" else (3 if status=="human-approval-required" else 1))
if __name__=="__main__": main()

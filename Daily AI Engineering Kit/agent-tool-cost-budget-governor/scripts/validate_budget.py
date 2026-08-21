#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as exc:
        print(json.dumps({"valid": False, "errors": [f"cannot load {path}: {exc}"]}, indent=2))
        sys.exit(2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plan", required=True)
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    plan, policy = load(args.plan), load(args.policy)
    errors = []

    required = ["version","task_id","currency","risk_level","task_hard_limit","verification_reserve","stages","approval"]
    for key in required:
        if key not in plan:
            errors.append(f"missing plan field: {key}")
    if errors:
        print(json.dumps({"valid": False, "errors": errors}, indent=2)); sys.exit(1)

    if plan.get("version") != 1: errors.append("plan.version must be 1")
    if policy.get("version") != 1: errors.append("policy.version must be 1")
    if plan.get("currency") != policy.get("currency"): errors.append("plan currency must match policy currency")
    hard = plan.get("task_hard_limit")
    reserve = plan.get("verification_reserve")
    if not isinstance(hard, (int,float)) or hard <= 0: errors.append("task_hard_limit must be > 0")
    if not isinstance(reserve, (int,float)) or reserve < 0: errors.append("verification_reserve must be >= 0")
    if isinstance(hard,(int,float)) and isinstance(reserve,(int,float)):
        minimum = hard * float(policy.get("minimum_verification_reserve_ratio", 0))
        if reserve + 1e-9 < minimum: errors.append(f"verification_reserve {reserve} is below policy minimum {minimum:.6f}")

    stages = plan.get("stages")
    if not isinstance(stages, list) or not stages: errors.append("stages must be a non-empty array"); stages = []
    names = set(); op_ids = set(); stage_sum = 0.0
    max_policy_retry = int(policy.get("max_retries_per_operation", 0))
    approval_classes = set(policy.get("approval_required_cost_classes", []))
    approval_status = (plan.get("approval") or {}).get("status")
    needs_approval = False

    for stage in stages:
        name = stage.get("name")
        if not name or name in names: errors.append(f"stage name missing or duplicate: {name}")
        names.add(name)
        limit = stage.get("hard_limit")
        if not isinstance(limit,(int,float)) or limit < 0: errors.append(f"stage {name}: hard_limit must be >= 0")
        else: stage_sum += limit
        retries = stage.get("max_retries_per_operation")
        if not isinstance(retries,int) or retries < 0 or retries > max_policy_retry:
            errors.append(f"stage {name}: retry limit exceeds policy or is invalid")
        for op in stage.get("operations", []):
            oid = op.get("id")
            if not oid or oid in op_ids: errors.append(f"operation id missing or duplicate: {oid}")
            op_ids.add(oid)
            cls = op.get("cost_class")
            est = op.get("estimated_cost")
            if cls not in {"free","metered-known","metered-unknown","high-cost"}: errors.append(f"operation {oid}: invalid cost_class")
            if not isinstance(est,(int,float)) or est < 0: errors.append(f"operation {oid}: estimated_cost must be >= 0")
            if cls == "free" and isinstance(est,(int,float)) and est != 0: errors.append(f"operation {oid}: free operation must estimate 0")
            if cls == "metered-unknown" and not policy.get("allow_unknown_cost_operations", False): needs_approval = True
            if cls in approval_classes: needs_approval = True
            if cls == "high-cost" and isinstance(est,(int,float)) and est >= float(policy.get("high_cost_operation_threshold", 0)): needs_approval = True

    if isinstance(hard,(int,float)) and stage_sum > hard + 1e-9: errors.append(f"sum of stage hard limits {stage_sum} exceeds task hard limit {hard}")
    if "verification" not in names and policy.get("final_gate_requires_verification_stage", True): errors.append("verification stage is required")
    if needs_approval and approval_status not in {"pending","approved"}: errors.append("plan contains approval-sensitive operations but approval.status is not pending/approved")
    if plan.get("expected_cost") is not None and plan.get("worst_case_cost") is not None:
        if plan["expected_cost"] > plan["worst_case_cost"] + 1e-9: errors.append("expected_cost cannot exceed worst_case_cost")
        if plan["worst_case_cost"] > hard + 1e-9: errors.append("worst_case_cost cannot exceed task_hard_limit")

    result = {"valid": not errors, "errors": errors, "task_id": plan.get("task_id"), "stage_hard_limit_sum": round(stage_sum, 8), "approval_sensitive": needs_approval}
    print(json.dumps(result, indent=2))
    sys.exit(0 if not errors else 1)

if __name__ == "__main__": main()

#!/usr/bin/env python3
import argparse, json, sys
from collections import defaultdict


def load(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"cannot load {path}: {exc}"}, indent=2))
        sys.exit(2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plan", required=True)
    ap.add_argument("--ledger", required=True)
    ap.add_argument("--policy", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    plan, ledger, policy = load(args.plan), load(args.ledger), load(args.policy)
    errors = []
    if plan.get("task_id") != ledger.get("task_id"): errors.append("task_id mismatch")
    if plan.get("currency") != ledger.get("currency"): errors.append("currency mismatch")

    stage_limits = {s.get("name"): float(s.get("hard_limit", 0)) for s in plan.get("stages", [])}
    stage_spend = defaultdict(float)
    operation_attempts = defaultdict(list)
    seen = set()
    total = 0.0
    unexplained = []
    plan_ops = {(s.get("name"), op.get("id")) for s in plan.get("stages", []) for op in s.get("operations", [])}

    for entry in ledger.get("entries", []):
        key = (entry.get("stage"), entry.get("operation"), entry.get("attempt"))
        if key in seen: errors.append(f"duplicate operation-attempt key: {key}")
        seen.add(key)
        cost = entry.get("actual_cost")
        if not isinstance(cost, (int,float)) or cost < 0:
            errors.append(f"invalid actual_cost for {key}")
            continue
        stage = entry.get("stage"); operation = entry.get("operation")
        if (stage, operation) not in plan_ops: unexplained.append({"stage":stage,"operation":operation,"attempt":entry.get("attempt")})
        stage_spend[stage] += float(cost); total += float(cost)
        operation_attempts[(stage, operation)].append(int(entry.get("attempt", 0)))

    max_retry = int(policy.get("max_retries_per_operation", 0))
    retry_violations = []
    for key, attempts in operation_attempts.items():
        max_attempts = 1 + max_retry
        if len(set(attempts)) > max_attempts or (attempts and max(attempts) > max_attempts):
            retry_violations.append({"stage":key[0],"operation":key[1],"attempts":sorted(set(attempts)),"max_attempts":max_attempts})

    stage_overages = []
    for stage, spend in stage_spend.items():
        if stage not in stage_limits:
            continue
        if spend > stage_limits[stage] + 1e-9:
            stage_overages.append({"stage":stage,"actual":round(spend,8),"hard_limit":stage_limits[stage]})

    hard = float(plan.get("task_hard_limit", 0))
    reserve = float(plan.get("verification_reserve", 0))
    verification_spend = stage_spend.get("verification", 0.0)
    non_verification_spend = total - verification_spend
    reserve_remaining = max(0.0, reserve - verification_spend)
    non_verification_capacity = max(0.0, hard - reserve)
    reserve_violation = non_verification_spend > non_verification_capacity + 1e-9

    report = {
        "ok": not errors,
        "task_id": plan.get("task_id"),
        "currency": plan.get("currency"),
        "total_actual_cost": round(total, 8),
        "task_hard_limit": hard,
        "remaining_task_budget": round(max(0.0, hard-total), 8),
        "stage_actual_cost": {k: round(v,8) for k,v in sorted(stage_spend.items())},
        "stage_overages": stage_overages,
        "verification_reserve": reserve,
        "verification_spend": round(verification_spend,8),
        "remaining_verification_reserve": round(reserve_remaining,8),
        "reserve_violation": reserve_violation,
        "retry_violations": retry_violations,
        "unexplained_operations": unexplained,
        "errors": errors
    }
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
        f.write("\n")
    print(json.dumps(report, indent=2))
    sys.exit(0 if not errors else 1)

if __name__ == "__main__": main()

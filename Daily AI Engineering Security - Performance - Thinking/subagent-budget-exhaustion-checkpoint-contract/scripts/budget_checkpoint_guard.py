#!/usr/bin/env python3
import argparse, json
from pathlib import Path

def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def evaluate(event, policy):
    required = ["task_id", "budget_tokens", "used_tokens", "estimated_next_call_tokens", "checkpoint"]
    missing = [key for key in required if key not in event]
    if missing:
        return {"ok": False, "decision": "block", "reasons": ["missing:" + key for key in missing]}
    budget = int(event["budget_tokens"])
    used = int(event["used_tokens"])
    next_call = int(event["estimated_next_call_tokens"])
    reserve = int(policy.get("reserve_tokens_for_checkpoint", 2048))
    if budget <= 0 or used < 0 or next_call < 0:
        return {"ok": False, "decision": "block", "reasons": ["invalid_budget_values"]}
    remaining = max(0, budget - used)
    checkpoint = event.get("checkpoint") or {}
    checkpoint_complete = all(checkpoint.get(key) for key in ["goal", "facts", "completed_steps", "next_step", "verification_status"])
    soft = float(policy.get("soft_budget_ratio", 0.8)) * budget
    hard = float(policy.get("hard_budget_ratio", 0.95)) * budget
    if used + next_call + reserve > budget:
        return {"ok": False, "decision": "checkpoint_and_yield", "remaining_tokens": remaining, "checkpoint_complete": checkpoint_complete, "reasons": ["next_call_would_violate_checkpoint_reserve"]}
    if used >= hard:
        return {"ok": False, "decision": "checkpoint_and_yield", "remaining_tokens": remaining, "checkpoint_complete": checkpoint_complete, "reasons": ["hard_budget_pressure"]}
    if used >= soft:
        return {"ok": True, "decision": "checkpoint_then_continue", "remaining_tokens": remaining, "checkpoint_complete": checkpoint_complete, "reasons": []}
    return {"ok": True, "decision": "continue", "remaining_tokens": remaining, "checkpoint_complete": checkpoint_complete, "reasons": []}

def main():
    parser = argparse.ArgumentParser(description="Pre-call token-budget admission and checkpoint-reserve guard")
    parser.add_argument("--event", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = evaluate(load_json(args.event), load_json(args.policy))
    except Exception as exc:
        print(json.dumps({"ok": False, "decision": "block", "reasons": ["input_error:" + str(exc)]}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__ == "__main__":
    raise SystemExit(main())

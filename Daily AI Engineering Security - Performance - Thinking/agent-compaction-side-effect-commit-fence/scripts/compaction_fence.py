#!/usr/bin/env python3
import argparse, json
from pathlib import Path

ACTIVE = {"issued", "executing"}
VALID = {"planned", "issued", "executing", "confirmed", "failed", "indeterminate"}

def load(path):
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read ledger: {exc}") from exc
    if not isinstance(data, dict) or not isinstance(data.get("actions"), list):
        raise ValueError("ledger must contain actions array")
    return data

def evaluate(data):
    reasons, escalations, seen = [], [], set()
    for index, action in enumerate(data["actions"]):
        if not isinstance(action, dict):
            reasons.append(f"action[{index}]:not_object")
            continue
        action_id = action.get("action_id")
        if not isinstance(action_id, str) or not action_id:
            reasons.append(f"action[{index}]:missing_action_id")
            continue
        if action_id in seen:
            reasons.append(f"{action_id}:duplicate_action_id")
        seen.add(action_id)
        if not isinstance(action.get("mutating"), bool):
            reasons.append(f"{action_id}:mutating_not_boolean")
            continue
        state = action.get("state")
        if state not in VALID:
            reasons.append(f"{action_id}:invalid_state")
            continue
        if action["mutating"] and state in ACTIVE:
            reasons.append(f"{action_id}:mutating_in_flight")
        if action["mutating"] and state == "planned":
            reasons.append(f"{action_id}:mutation_not_started_but_pending")
        if action["mutating"] and state == "indeterminate":
            reasons.append(f"{action_id}:mutation_indeterminate")
            if not action.get("idempotency_key"):
                escalations.append(f"{action_id}:non_idempotent_indeterminate")
        if action["mutating"] and state == "confirmed" and not action.get("evidence"):
            reasons.append(f"{action_id}:confirmed_without_evidence")
    decision = "escalate" if escalations else ("defer" if reasons else "allow")
    return {"ok": decision == "allow", "decision": decision,
            "reasons": sorted(set(reasons)), "escalations": sorted(set(escalations))}

def main():
    parser = argparse.ArgumentParser(description="Block unsafe context compaction while side effects are unresolved.")
    parser.add_argument("ledger")
    args = parser.parse_args()
    try:
        result = evaluate(load(args.ledger))
    except ValueError as exc:
        print(json.dumps({"ok": False, "decision": "defer", "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__ == "__main__":
    raise SystemExit(main())

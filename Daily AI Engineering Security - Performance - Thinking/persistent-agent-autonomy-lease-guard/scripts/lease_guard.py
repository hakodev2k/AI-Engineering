#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

REQ_STATE = (
    "now_epoch", "lease_started_epoch", "lease_expires_epoch", "goal_hash",
    "approved_goal_hash", "actions_in_lease", "side_effects_in_lease",
    "checkpoint_age_seconds", "evidence_age_seconds", "progress_delta", "renewal_count"
)
REQ_POLICY = (
    "max_lease_seconds", "max_actions_per_lease", "max_side_effects_per_lease",
    "max_checkpoint_age_seconds", "max_evidence_age_seconds",
    "min_progress_delta_for_renewal", "max_renewals_without_human_review"
)

def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def evaluate(state, policy):
    missing = [f"missing_state:{k}" for k in REQ_STATE if k not in state]
    missing += [f"missing_policy:{k}" for k in REQ_POLICY if k not in policy]
    if missing:
        return {"ok": False, "decision": "stop", "reasons": missing}
    reasons = []
    try:
        now = int(state["now_epoch"]); started = int(state["lease_started_epoch"]); expires = int(state["lease_expires_epoch"])
        actions = int(state["actions_in_lease"]); side = int(state["side_effects_in_lease"])
        checkpoint_age = int(state["checkpoint_age_seconds"]); evidence_age = int(state["evidence_age_seconds"])
        progress = int(state["progress_delta"]); renewals = int(state["renewal_count"])
        max_lease = int(policy["max_lease_seconds"])
    except (TypeError, ValueError) as exc:
        return {"ok": False, "decision": "stop", "reasons": [f"invalid_numeric_input:{exc}"]}
    if state["goal_hash"] != state["approved_goal_hash"]:
        reasons.append("goal_mismatch")
    if expires <= started or expires - started > max_lease:
        reasons.append("invalid_lease_window")
    expired = now >= expires
    if actions > int(policy["max_actions_per_lease"]): reasons.append("action_budget_exceeded")
    if side > int(policy["max_side_effects_per_lease"]): reasons.append("side_effect_budget_exceeded")
    if checkpoint_age > int(policy["max_checkpoint_age_seconds"]): reasons.append("checkpoint_stale")
    if evidence_age > int(policy["max_evidence_age_seconds"]): reasons.append("evidence_stale")
    if reasons:
        return {"ok": False, "decision": "stop", "reasons": sorted(set(reasons))}
    if expired:
        if progress < int(policy["min_progress_delta_for_renewal"]):
            return {"ok": False, "decision": "stop", "reasons": ["no_measurable_progress"]}
        if renewals >= int(policy["max_renewals_without_human_review"]):
            return {"ok": False, "decision": "stop", "reasons": ["human_review_required"]}
        return {"ok": True, "decision": "renew", "reasons": ["lease_expired_with_progress"]}
    return {"ok": True, "decision": "allow", "reasons": []}

def main():
    ap = argparse.ArgumentParser(description="Validate persistent-agent autonomy lease")
    ap.add_argument("--state", required=True); ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    try:
        result = evaluate(load(args.state), load(args.policy))
    except Exception as exc:
        print(json.dumps({"ok": False, "decision": "stop", "reasons": [f"input_error:{exc}"]}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__ == "__main__":
    sys.exit(main())

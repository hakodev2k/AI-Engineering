#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"invalid_json:{exc}"}))
        raise SystemExit(2)


def evaluate(event, policy):
    reasons = []
    for field in ("action", "actor_id", "target_branch", "change_reference"):
        if policy.get("require_actor_id", True) and field == "actor_id" and not event.get(field):
            reasons.append("missing_actor_id")
        elif policy.get("require_change_reference", True) and field == "change_reference" and not event.get(field):
            reasons.append("missing_change_reference")
        elif field in ("action", "target_branch") and not event.get(field):
            reasons.append(f"missing_{field}")

    action = event.get("action", "")
    actor = event.get("actor_id")
    approver = event.get("approver_id")
    branch = event.get("target_branch", "")

    forbidden = set(policy.get("forbidden_actions", []))
    high_risk = set(policy.get("high_risk_actions", []))
    protected = set(policy.get("protected_branches", []))

    if action in forbidden:
        reasons.append("forbidden_action")

    if action == "push" and branch in protected and not policy.get("allow_direct_push_to_protected_branch", False):
        reasons.append("direct_push_to_protected_branch")

    if action in high_risk and policy.get("require_human_approval_for_high_risk", True):
        if not event.get("human_approved", False):
            reasons.append("human_approval_required")
        if policy.get("require_independent_approver", True):
            if not approver:
                reasons.append("independent_approver_required")
            elif actor and approver == actor:
                reasons.append("self_approval_forbidden")

    if not policy.get("allow_agent_to_approve_self", False) and event.get("approval_actor_type") == "agent":
        reasons.append("agent_approval_forbidden")

    if event.get("history_mutation", False):
        reasons.append("audit_history_mutation_forbidden")

    if event.get("external_identity_created", False):
        reasons.append("external_identity_creation_forbidden")

    return {
        "ok": not reasons,
        "decision": "allow" if not reasons else "block",
        "action": action,
        "actor_id": actor,
        "target_branch": branch,
        "reasons": sorted(set(reasons)),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--event", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    result = evaluate(read_json(args.event), read_json(args.policy))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())

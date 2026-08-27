#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}))
        raise SystemExit(2)


def evaluate(message, policy):
    reasons = []
    for field in policy.get("required_fields", []):
        if field not in message:
            reasons.append(f"missing:{field}")
    if reasons:
        return {"ok": False, "decision": "block", "reasons": reasons}

    source = message["source_type"]
    role = message["role"]
    original = message["original_role"]
    trusted = set(policy.get("trusted_user_sources", []))
    forbidden = set(policy.get("forbidden_user_sources", []))

    if role == "user" and source not in trusted:
        reasons.append("non_user_source_promoted_to_user_role")
    if source in forbidden and role == "user":
        reasons.append("forbidden_source_user_role")
    if source in forbidden and original == "user":
        reasons.append("forbidden_source_claims_user_origin")

    hops = message.get("transport_hops")
    if not isinstance(hops, list):
        reasons.append("transport_hops_not_list")
    elif len(hops) > int(policy.get("max_transport_hops", 16)):
        reasons.append("transport_hop_limit_exceeded")

    requested = set(message.get("requested_tools", []))
    privileged = set(policy.get("privileged_tools", []))
    if requested & privileged:
        if source not in trusted:
            reasons.append("privileged_request_not_user_origin")
        if policy.get("require_human_approval_for_privileged", True) and not message.get("human_approved", False):
            reasons.append("privileged_request_requires_human_approval")

    return {
        "ok": not reasons,
        "decision": "allow" if not reasons else "block",
        "message_id": message.get("id"),
        "source_type": source,
        "role": role,
        "reasons": sorted(set(reasons)),
    }


def main():
    ap = argparse.ArgumentParser(description="Validate message role/provenance invariants")
    ap.add_argument("--message", required=True)
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    result = evaluate(load(args.message), load(args.policy))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())

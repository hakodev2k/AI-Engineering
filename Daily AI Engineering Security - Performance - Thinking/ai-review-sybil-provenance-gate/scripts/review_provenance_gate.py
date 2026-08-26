#!/usr/bin/env python3
import argparse
import json
from pathlib import Path


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def evaluate(event, policy):
    reviews = event.get("reviews", [])
    author_controller = event.get("author_controller_id")
    counted = []
    rejected = []
    controllers = set()
    human_codeowner = False

    for review in reviews:
        if review.get("decision") != "approved":
            continue
        controller = review.get("controller_id")
        provenance = review.get("provenance_status", "unknown")
        if not controller or provenance != "verified":
            rejected.append({"login": review.get("login"), "reason": "unverified_or_missing_controller"})
            continue
        if not policy.get("allow_author_controller_approval", False) and controller == author_controller:
            rejected.append({"login": review.get("login"), "reason": "author_controlled_approval"})
            continue
        if controller in controllers:
            rejected.append({"login": review.get("login"), "reason": "duplicate_controlling_principal"})
            continue
        controllers.add(controller)
        counted.append(review.get("login"))
        if review.get("identity_type") == "human" and bool(review.get("codeowner")):
            human_codeowner = True

    required = int(policy.get("required_unique_controllers", 2))
    reasons = []
    if len(controllers) < required:
        reasons.append("insufficient_independent_controllers")
    if policy.get("require_human_codeowner", True) and not human_codeowner:
        reasons.append("trusted_human_codeowner_required")

    return {
        "ok": not reasons,
        "decision": "allow_merge" if not reasons else "block_merge",
        "counted_reviewers": counted,
        "unique_controllers": len(controllers),
        "rejected_reviews": rejected,
        "reasons": reasons,
    }


def main():
    parser = argparse.ArgumentParser(description="Verify independent review provenance before merge.")
    parser.add_argument("--event", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = evaluate(load(args.event), load(args.policy))
    except Exception as exc:
        print(json.dumps({"ok": False, "decision": "block_merge", "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())

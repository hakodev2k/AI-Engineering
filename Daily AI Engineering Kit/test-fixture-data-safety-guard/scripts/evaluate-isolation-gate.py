#!/usr/bin/env python3
import argparse
import json
import sys


def load(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--manifest", required=True)
    p.add_argument("--review", required=True)
    p.add_argument("--policy", required=True)
    args = p.parse_args()

    try:
        manifest = load(args.manifest)
        review = load(args.review)
        policy = load(args.policy)
    except Exception as exc:
        print(json.dumps({"decision": "blocked", "errors": [f"load-error: {exc}"]}, indent=2))
        return 2

    errors = []
    if review.get("run_id") != manifest.get("run_id"):
        errors.append("run-id-mismatch")
    if review.get("reviewer_role") in (None, "", "fixture-safety-analyst", "test-implementation-agent"):
        errors.append("reviewer-not-independent")
    if review.get("cleanup_verified") is not True:
        errors.append("cleanup-not-verified")
    if review.get("cross_boundary_changes", []):
        errors.append("cross-boundary-changes-detected")
    if review.get("unexpected_external_side_effects", []):
        errors.append("unexpected-external-side-effects")
    if review.get("created_resources_accounted_for") is not True:
        errors.append("created-resources-not-accounted-for")
    if review.get("evidence_complete") is not True:
        errors.append("evidence-incomplete")

    decision = review.get("decision")
    allowed = policy.get("review_decisions", [])
    if decision not in allowed:
        errors.append("invalid-review-decision")

    if decision == "human-approval-required":
        approval = review.get("approval", {})
        if not approval.get("approved") or not approval.get("evidence"):
            print(json.dumps({"decision": "human-approval-required", "errors": errors}, indent=2))
            return 3
    elif decision == "blocked":
        errors.append("review-blocked")

    if errors:
        print(json.dumps({"decision": "blocked", "errors": errors}, indent=2))
        return 2

    print(json.dumps({"decision": "verified", "errors": []}, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())

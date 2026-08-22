#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def canonical_hash(obj):
    raw = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return "sha256:" + hashlib.sha256(raw).hexdigest()


def main():
    p = argparse.ArgumentParser(description="Final gate for an evidence-retention plan.")
    p.add_argument("--bundle", required=True)
    p.add_argument("--validation", required=True)
    p.add_argument("--retention", required=True)
    p.add_argument("--policy", required=True)
    p.add_argument("--implementation-owner", required=True)
    p.add_argument("--review")
    p.add_argument("--approval-ref")
    p.add_argument("--output", required=True)
    args = p.parse_args()

    try:
        bundle = load_json(args.bundle)
        validation = load_json(args.validation)
        retention = load_json(args.retention)
        policy = load_json(args.policy)
        review = load_json(args.review) if args.review else None
    except Exception as exc:
        print(f"input-error: {exc}", file=sys.stderr)
        return 2

    bundle_fp = canonical_hash(bundle)
    reasons = []
    if validation.get("status") != "verified":
        reasons.append("bundle-validation-not-verified")
    if validation.get("bundle_fingerprint") != bundle_fp:
        reasons.append("stale-validation")
    if retention.get("status") != "verified":
        reasons.append("retention-plan-not-verified")
    if retention.get("bundle_fingerprint") != bundle_fp:
        reasons.append("stale-retention-plan")

    critical = any(e.get("importance") == "critical" for e in bundle.get("evidence", []))
    review_required = critical and "critical" in policy.get("review", {}).get("independent_review_for", [])
    if review_required:
        if not review:
            reasons.append("independent-review-required")
        else:
            expected_retention_fp = retention.get("retention_fingerprint")
            if review.get("status") != "approved":
                reasons.append("review-not-approved")
            if review.get("bundle_fingerprint") != bundle_fp:
                reasons.append("review-bundle-fingerprint-mismatch")
            if review.get("retention_fingerprint") != expected_retention_fp:
                reasons.append("review-retention-fingerprint-mismatch")
            if not policy.get("review", {}).get("allow_self_review", False) and review.get("reviewer") == args.implementation_owner:
                reasons.append("self-review-not-allowed")

    dangerous = set()
    for claim in bundle.get("claims", []):
        if claim.get("status") == "decision" and claim.get("id", "").startswith("approval-action:"):
            dangerous.add(claim["id"].split(":", 1)[1])
    approval_actions = set(policy.get("approval_required_actions", []))
    needs_approval = bool(dangerous & approval_actions)
    if needs_approval and not args.approval_ref:
        reasons.append("human-approval-required")

    status = "blocked" if reasons else "verified"
    result = {
        "status": status,
        "bundle_fingerprint": bundle_fp,
        "retention_fingerprint": retention.get("retention_fingerprint"),
        "review_required": review_required,
        "human_approval_required": needs_approval,
        "approval_ref": args.approval_ref,
        "reasons": reasons,
    }
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(status)
    return 0 if status == "verified" else 1

if __name__ == "__main__":
    sys.exit(main())

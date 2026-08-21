#!/usr/bin/env python3
import argparse, json, os, sys


def load(path, required=True):
    if not path or not os.path.exists(path):
        if required: raise FileNotFoundError(path)
        return None
    with open(path, encoding="utf-8") as f: return json.load(f)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--evaluation", required=True)
    ap.add_argument("--review")
    ap.add_argument("--implementation-owner", required=True)
    ap.add_argument("--tests-status", choices=["passed", "failed", "not-run"], required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()
    ev = load(args.evaluation)
    reasons = []
    if args.tests_status != "passed": reasons.append("tests-not-passed")
    if ev.get("status") == "blocked": reasons.append("parity-evaluation-blocked")
    review = load(args.review, required=False)
    if ev.get("requires_independent_review") or ev.get("status") == "review-required":
        if not review: reasons.append("independent-review-missing")
        else:
            if review.get("reviewer_id") == args.implementation_owner: reasons.append("review-not-independent")
            if review.get("verdict") != "approved": reasons.append("review-not-approved")
            if review.get("contract_fingerprint") != ev.get("contract_fingerprint"): reasons.append("review-contract-fingerprint-stale")
            if review.get("snapshot_fingerprint") != ev.get("snapshot_fingerprint"): reasons.append("review-snapshot-fingerprint-stale")
    if ev.get("gaps") and not review and ev.get("status") != "blocked": reasons.append("unreviewed-parity-gaps")
    result = {"version": 1, "status": "verified" if not reasons else "blocked", "reasons": reasons, "tests_status": args.tests_status, "parity_status": ev.get("status"), "score": ev.get("score")}
    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f: json.dump(result, f, indent=2, sort_keys=True)
    print(result["status"])
    return 0 if result["status"] == "verified" else 3

if __name__ == "__main__": sys.exit(main())

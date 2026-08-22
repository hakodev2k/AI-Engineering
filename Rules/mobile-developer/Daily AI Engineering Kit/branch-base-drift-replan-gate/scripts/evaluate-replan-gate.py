#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--record", required=True)
    ap.add_argument("--drift", required=True)
    ap.add_argument("--policy", required=True)
    ap.add_argument("--review")
    ap.add_argument("--output", required=True)
    ns = ap.parse_args()
    try:
        record, drift, policy = load(ns.record), load(ns.drift), load(ns.policy)
        review = load(ns.review) if ns.review else None
        reasons = []
        status = "verified"
        if record.get("plan_id") != drift.get("plan_id") or record.get("plan_revision") != drift.get("plan_revision"):
            reasons.append("plan-binding-mismatch")
        refs = record.get("refs", {})
        cur = drift.get("current", {})
        if refs.get("target_sha") != cur.get("target_sha") or refs.get("head_sha") != cur.get("head_sha") or refs.get("merge_base_sha") != cur.get("merge_base_sha"):
            reasons.append("record-not-bound-to-current-refs")
        blocked_steps = [s.get("id") for s in record.get("steps", []) if s.get("disposition") == "blocked"]
        unresolved = [a.get("id") for a in record.get("assumptions", []) if a.get("status") in {"invalid", "open-question", "revalidate"}]
        if blocked_steps: reasons.append("blocked-plan-steps")
        if unresolved: reasons.append("unresolved-assumptions")
        review_reasons = drift.get("review_reasons", [])
        review_required = bool(review_reasons)
        if review_required:
            if not review:
                reasons.append("independent-review-required")
            else:
                if review.get("status") != "approved": reasons.append("review-not-approved")
                if review.get("plan_id") != record.get("plan_id") or review.get("plan_revision") != record.get("plan_revision"): reasons.append("review-plan-binding-mismatch")
                rrefs = review.get("refs", {})
                for key in ["target_sha", "head_sha", "merge_base_sha"]:
                    if rrefs.get(key) != refs.get(key): reasons.append(f"review-{key}-mismatch")
                if record.get("risk") == "high" and review.get("reviewer_id") == review.get("planner_id"):
                    reasons.append("high-risk-review-not-independent")
        if drift.get("status") == "replan-required" and record.get("plan_revision", 1) <= drift.get("plan_revision", 1):
            reasons.append("replan-not-recorded")
        if reasons:
            status = "blocked"
        out = {"version": "1.0.0", "status": status, "plan_id": record.get("plan_id"), "plan_revision": record.get("plan_revision"), "reasons": sorted(set(reasons)), "review_required": review_required}
        Path(ns.output).write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")
        print(status)
        return 0 if status == "verified" else 4
    except (OSError, KeyError, ValueError, json.JSONDecodeError) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 2

if __name__ == "__main__": raise SystemExit(main())

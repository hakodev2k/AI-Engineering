#!/usr/bin/env python3
import hashlib
import json
import pathlib
import sys


def canonical(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def fp(obj):
    return hashlib.sha256(canonical(obj)).hexdigest()


def load(path):
    return json.loads(pathlib.Path(path).read_text(encoding="utf-8"))


def main():
    if len(sys.argv) not in (4, 5):
        print("usage: evaluate-final-gate.py <plan.json> <manifest.json> <validation.json> [review.json]", file=sys.stderr)
        return 2
    try:
        plan = load(sys.argv[1]); manifest = load(sys.argv[2]); validation = load(sys.argv[3])
        review = load(sys.argv[4]) if len(sys.argv) == 5 else None
    except Exception as exc:
        print(json.dumps({"status":"blocked","reasons":[f"invalid-json:{exc}"]}, indent=2))
        return 2

    reasons = []
    plan_fp, manifest_fp = fp(plan), fp(manifest)
    if validation.get("plan_fingerprint") != plan_fp:
        reasons.append("stale-validation-plan")
    if validation.get("manifest_fingerprint") != manifest_fp:
        reasons.append("stale-validation-manifest")
    if validation.get("status") == "blocked":
        reasons.extend(validation.get("errors", []) or ["traceability-validation-blocked"])

    high_risk = any(x.get("risk") in ("high", "critical") or x.get("requires_approval") for x in plan.get("plan_items", []))
    needs_review = validation.get("status") == "review-required" or high_risk
    if needs_review:
        if not review:
            reasons.append("review-required")
        else:
            if review.get("plan_fingerprint") != plan_fp: reasons.append("review-plan-fingerprint-mismatch")
            if review.get("manifest_fingerprint") != manifest_fp: reasons.append("review-manifest-fingerprint-mismatch")
            if high_risk and review.get("reviewer") == review.get("actor"): reasons.append("high-risk-self-review")
            if review.get("actor") != manifest.get("actor"): reasons.append("review-actor-mismatch")
            if review.get("verdict") != "approve": reasons.append("review-rejected")

    approval_missing = []
    for c in manifest.get("changes", []):
        cats = set(c.get("risk_categories", []))
        if cats & {"breaking-api","database-schema","production-config","security-control","infrastructure","secret-change","data-deletion","force-push","irreversible-migration","large-dependency-upgrade"} and not c.get("approval_id"):
            approval_missing.append(c.get("path", "unknown"))
    if approval_missing:
        reasons.extend([f"approval-missing:{p}" for p in approval_missing])

    status = "verified" if not reasons else ("approval-required" if any(r.startswith("approval-missing") for r in reasons) else "blocked")
    print(json.dumps({"status": status, "reasons": reasons, "plan_fingerprint": plan_fp, "manifest_fingerprint": manifest_fp}, indent=2))
    return 0 if status == "verified" else 5


if __name__ == "__main__":
    raise SystemExit(main())

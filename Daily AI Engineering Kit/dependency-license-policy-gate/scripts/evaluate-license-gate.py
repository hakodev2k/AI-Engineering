#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def load_json(path, required=True):
    if not path:
        if required:
            raise ValueError("required JSON path missing")
        return None
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}")


def canonical_hash(value):
    payload = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def parse_time(value):
    if not isinstance(value, str) or not value.strip():
        raise ValueError("timestamp must be a non-empty string")
    normalized = value.replace("Z", "+00:00")
    dt = datetime.fromisoformat(normalized)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def exception_matches(exception, finding, policy, now):
    reasons = []
    required = policy.get("exception_policy", {}).get("required_fields", [])
    for field in required:
        if not exception.get(field):
            reasons.append(f"exception missing {field}")
    checks = {
        "package_key": finding.get("package_key"),
        "version": finding.get("version"),
        "source_fingerprint": finding.get("source_fingerprint"),
        "license_expression": finding.get("license_expression"),
        "policy_version": policy.get("policy_version")
    }
    for field, expected in checks.items():
        if exception.get(field) != expected:
            reasons.append(f"exception {field} mismatch")
    try:
        approved_at = parse_time(exception.get("approved_at"))
        expires_at = parse_time(exception.get("expires_at"))
        if expires_at <= approved_at:
            reasons.append("exception expires_at must be after approved_at")
        if now >= expires_at:
            reasons.append("exception expired")
        max_hours = int(policy.get("exception_policy", {}).get("max_validity_hours", 0))
        if max_hours > 0 and (expires_at - approved_at).total_seconds() > max_hours * 3600:
            reasons.append("exception validity exceeds policy maximum")
    except Exception as exc:
        reasons.append(f"invalid exception timestamps: {exc}")
    return reasons


def main():
    parser = argparse.ArgumentParser(description="Evaluate final dependency license gate")
    parser.add_argument("--inventory", required=True)
    parser.add_argument("--evaluation", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--review")
    parser.add_argument("--exception")
    parser.add_argument("--now", help="ISO-8601 current time for deterministic tests")
    args = parser.parse_args()

    try:
        inventory = load_json(args.inventory)
        evaluation = load_json(args.evaluation)
        policy = load_json(args.policy)
        review = load_json(args.review, required=False)
        exception = load_json(args.exception, required=False)
        now = parse_time(args.now) if args.now else datetime.now(timezone.utc)
    except ValueError as exc:
        print(json.dumps({"status": "blocked", "reasons": [str(exc)]}, sort_keys=True))
        return 2

    reasons = []
    inv_fp = canonical_hash(inventory)
    if evaluation.get("inventory_fingerprint") != inv_fp:
        reasons.append("evaluation inventory fingerprint is stale")
    if evaluation.get("policy_version") != policy.get("policy_version"):
        reasons.append("evaluation policy version mismatch")

    findings = evaluation.get("findings", [])
    non_allowed = [f for f in findings if f.get("category") != "allowed"]
    review_required_categories = set(policy.get("require_independent_review_for", []))
    review_required = any(f.get("category") in review_required_categories for f in non_allowed)

    if review_required:
        if not review:
            reasons.append("independent review required")
        else:
            if review.get("inventory_fingerprint") != inv_fp:
                reasons.append("review inventory fingerprint mismatch")
            if review.get("policy_version") != policy.get("policy_version"):
                reasons.append("review policy version mismatch")
            if review.get("status") == "blocked":
                reasons.append("review blocked the dependency set")
            analyst_id = review.get("analyst_id")
            reviewer_id = review.get("reviewer_id")
            if analyst_id and reviewer_id and analyst_id == reviewer_id:
                reasons.append("independent review required: reviewer equals analyst")

    blocked_findings = [f for f in findings if f.get("status") == "blocked"]
    if blocked_findings:
        reasons.extend([f"blocked dependency: {f.get('package_key')} ({f.get('category')})" for f in blocked_findings])

    approval_findings = [f for f in findings if f.get("status") == "human-approval-required"]
    if approval_findings:
        if not exception:
            if not reasons:
                print(json.dumps({"status": "human-approval-required", "reasons": ["valid exception approval missing"]}, sort_keys=True))
                return 3
            reasons.append("valid exception approval missing")
        elif len(approval_findings) != 1:
            reasons.append("single exception file may bind only one approval-required dependency")
        else:
            finding = approval_findings[0]
            if not finding.get("exception_permitted"):
                reasons.append("policy does not permit exception for finding")
            reasons.extend(exception_matches(exception, finding, policy, now))

    if reasons:
        print(json.dumps({"status": "blocked", "reasons": reasons}, sort_keys=True))
        return 4

    if review_required and review and review.get("status") == "approval-required" and not exception:
        print(json.dumps({"status": "human-approval-required", "reasons": ["review requires approval"]}, sort_keys=True))
        return 3

    print(json.dumps({"status": "verified", "reasons": []}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone

IMPORTANCE_SCORE = {"critical": 400, "high": 300, "medium": 200, "low": 100}


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def parse_dt(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)


def canonical_hash(obj):
    raw = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return "sha256:" + hashlib.sha256(raw).hexdigest()


def main():
    p = argparse.ArgumentParser(description="Build a deterministic context-retention plan from evidence metadata.")
    p.add_argument("--bundle", required=True)
    p.add_argument("--validation", required=True)
    p.add_argument("--policy", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--now", help="ISO-8601 UTC override for deterministic tests")
    args = p.parse_args()

    try:
        bundle = load_json(args.bundle)
        validation = load_json(args.validation)
        policy = load_json(args.policy)
        now = parse_dt(args.now) if args.now else datetime.now(timezone.utc)
    except Exception as exc:
        print(f"input-error: {exc}", file=sys.stderr)
        return 2

    expected = canonical_hash(bundle)
    if validation.get("status") != "verified" or validation.get("bundle_fingerprint") != expected:
        print("validation is missing, failed, or stale", file=sys.stderr)
        return 1

    budget = policy["budget"]
    retention = policy["retention"]
    max_bytes = int(budget["max_context_bytes"])
    summary_cost = int(budget["summary_cost_bytes"])
    reference_cost = int(budget["reference_cost_bytes"])
    max_full_items = int(budget["max_full_items"])
    max_summary_items = int(budget["max_summary_items"])
    mandatory_types = set(retention.get("mandatory_types", []))
    never_embed = set(retention.get("never_embed_sensitivity", []))
    required_ids = set(validation.get("required_evidence_ids", []))
    max_age = int(policy.get("freshness", {}).get("max_age_minutes_for_active_verification", 0))
    stale_blocks = bool(policy.get("freshness", {}).get("stale_active_evidence_blocks", True))

    records = []
    blocking = []
    for item in bundle.get("evidence", []):
        eid = item["id"]
        mandatory = eid in required_ids or item.get("type") in mandatory_types
        age_minutes = max(0.0, (now - parse_dt(item["observed_at"])).total_seconds() / 60.0)
        if mandatory and max_age and age_minutes > max_age and stale_blocks:
            blocking.append(f"mandatory active evidence is stale: {eid}")
        score = IMPORTANCE_SCORE.get(item.get("importance"), 0)
        if mandatory:
            score += 1000
        if item.get("required_for"):
            score += min(len(item["required_for"]), 20) * 5
        records.append((score, item, mandatory, age_minutes))

    records.sort(key=lambda x: (-x[0], x[1]["id"]))
    used_bytes = 0
    full_count = 0
    summary_count = 0
    decisions = []

    for score, item, mandatory, age_minutes in records:
        sensitivity = item["sensitivity"]
        full_cost = int(item.get("context_cost_bytes", 0))
        has_summary = bool(item.get("summary"))
        mode = "reference-only"
        reason = "budgeted-reference"
        cost = reference_cost

        if sensitivity in never_embed:
            mode, reason, cost = "reference-only", "sensitivity-policy", reference_cost
        elif mandatory:
            if full_count < max_full_items and used_bytes + full_cost <= max_bytes:
                mode, reason, cost = "keep-full", "mandatory-evidence", full_cost
            elif has_summary and summary_count < max_summary_items and used_bytes + summary_cost <= max_bytes:
                mode, reason, cost = "keep-summary", "mandatory-budget-fallback", summary_cost
            else:
                mode, reason, cost = "reference-only", "mandatory-budget-exceeded", reference_cost
        elif item.get("importance") in retention.get("prefer_full_importance", []) and full_count < max_full_items and used_bytes + full_cost <= max_bytes:
            mode, reason, cost = "keep-full", "high-priority", full_cost
        elif item.get("importance") in retention.get("prefer_summary_importance", []) and has_summary and summary_count < max_summary_items and used_bytes + summary_cost <= max_bytes:
            mode, reason, cost = "keep-summary", "summary-priority", summary_cost

        if used_bytes + cost > max_bytes:
            mode, reason, cost = "exclude-context", "context-budget-exhausted", 0
            if mandatory:
                blocking.append(f"budget cannot retain minimum metadata for mandatory evidence: {item['id']}")

        used_bytes += cost
        if mode == "keep-full":
            full_count += 1
        elif mode == "keep-summary":
            summary_count += 1
        decisions.append({
            "evidence_id": item["id"],
            "mode": mode,
            "reason": reason,
            "estimated_context_bytes": cost,
            "mandatory": mandatory,
            "age_minutes": round(age_minutes, 2),
            "content_hash": item["content_hash"],
            "storage_ref": item["storage_ref"],
        })

    status = "blocked" if blocking else "verified"
    result = {
        "status": status,
        "bundle_id": bundle.get("bundle_id"),
        "bundle_fingerprint": expected,
        "policy_version": policy.get("version"),
        "context_budget_bytes": max_bytes,
        "estimated_context_bytes": used_bytes,
        "full_items": full_count,
        "summary_items": summary_count,
        "decisions": decisions,
        "blocking_reasons": blocking,
    }
    result["retention_fingerprint"] = canonical_hash(result)
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(status)
    return 0 if status == "verified" else 1

if __name__ == "__main__":
    sys.exit(main())

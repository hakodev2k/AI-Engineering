#!/usr/bin/env python3
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}")


def canonical_hash(value):
    payload = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def tokenize_expression(expr):
    tokens = re.split(r"\s+(?:OR|AND)\s+", expr.strip(), flags=re.IGNORECASE)
    return [t.strip("() ") for t in tokens if t.strip("() ")]


def classify_expression(expr, policy):
    allowed = set(policy.get("licenses", {}).get("allowed", []))
    restricted = set(policy.get("licenses", {}).get("restricted", []))
    prohibited = set(policy.get("licenses", {}).get("prohibited", []))
    tokens = tokenize_expression(expr)
    if not tokens:
        return "unknown", ["empty license expression"]
    categories = []
    reasons = []
    for token in tokens:
        if token in prohibited:
            categories.append("prohibited")
        elif token in restricted:
            categories.append("restricted")
        elif token in allowed:
            categories.append("allowed")
        else:
            categories.append("unknown")
    unique = set(categories)
    upper = expr.upper()
    if " OR " in upper and len(unique) > 1:
        return "ambiguous-expression", [f"OR expression spans categories: {sorted(unique)}"]
    if "unknown" in unique:
        return "unknown", ["expression contains unclassified license identifier"]
    if "prohibited" in unique:
        return "prohibited", ["expression includes prohibited license"]
    if "restricted" in unique:
        return "restricted", ["expression includes restricted license"]
    return "allowed", reasons


def main():
    parser = argparse.ArgumentParser(description="Evaluate dependency license inventory against policy")
    parser.add_argument("--inventory", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    try:
        inventory = load_json(args.inventory)
        policy = load_json(args.policy)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    findings = []
    overall = "verified"
    exception_categories = set(policy.get("exception_policy", {}).get("enabled_for_categories", []))
    allow_prohibited_exception = bool(policy.get("exception_policy", {}).get("enabled_for_prohibited", False))
    accepted_confidence = set(policy.get("provenance", {}).get("accepted_confidence", ["verified"]))

    for dep in inventory.get("dependencies", []):
        category, reasons = classify_expression(dep.get("license_expression", ""), policy)
        confidence = dep.get("evidence_confidence", "unknown")
        if confidence not in accepted_confidence:
            reasons.append(f"evidence confidence is {confidence}")
            if category == "allowed":
                category = "partial" if confidence == "partial" else "unknown"
        if category == "allowed":
            status = "verified"
            exception_permitted = False
        elif category == "prohibited":
            status = "human-approval-required" if allow_prohibited_exception else "blocked"
            exception_permitted = allow_prohibited_exception
        else:
            exception_permitted = category in exception_categories
            status = "human-approval-required" if exception_permitted else "blocked"
        if status == "blocked":
            overall = "blocked"
        elif status == "human-approval-required" and overall != "blocked":
            overall = "human-approval-required"
        findings.append({
            "package_key": dep.get("package_key"),
            "version": dep.get("version"),
            "source_fingerprint": dep.get("source_fingerprint"),
            "license_expression": dep.get("license_expression"),
            "evidence_confidence": confidence,
            "category": category,
            "status": status,
            "exception_permitted": exception_permitted,
            "reasons": reasons
        })

    result = {
        "evaluation_version": "1.0.0",
        "inventory_fingerprint": canonical_hash(inventory),
        "policy_version": policy.get("policy_version"),
        "status": overall,
        "findings": findings
    }
    Path(args.output).write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(overall)
    return 0 if overall == "verified" else 3 if overall == "human-approval-required" else 4


if __name__ == "__main__":
    raise SystemExit(main())

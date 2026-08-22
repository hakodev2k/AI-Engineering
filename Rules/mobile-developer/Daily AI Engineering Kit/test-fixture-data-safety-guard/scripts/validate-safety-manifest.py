#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def load(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--manifest", required=True)
    p.add_argument("--policy", required=True)
    args = p.parse_args()

    try:
        manifest = load(args.manifest)
        policy = load(args.policy)
    except Exception as exc:
        print(json.dumps({"decision": "blocked", "errors": [f"load-error: {exc}"]}, indent=2))
        return 2

    errors = []
    approval_reasons = []

    required_top = ["version", "run_id", "target", "fixture", "mutations", "isolation", "cleanup", "side_effects", "approval", "status"]
    for key in required_top:
        if key not in manifest:
            errors.append(f"missing:{key}")

    if errors:
        print(json.dumps({"decision": "blocked", "errors": errors}, indent=2))
        return 2

    env = manifest["target"].get("environment_class")
    prov = manifest["fixture"].get("provenance")
    if env not in policy["environment_classes"]:
        errors.append("invalid-environment-class")
    if prov not in policy["fixture_provenance"]:
        errors.append("invalid-fixture-provenance")

    if env in policy["blocked_environments"]:
        errors.append(f"blocked-environment:{env}")
    elif env in policy["review_environments"]:
        approval_reasons.append(f"review-environment:{env}")

    if prov in policy["blocked_fixture_provenance"]:
        errors.append(f"blocked-fixture-provenance:{prov}")
    elif prov in policy["review_fixture_provenance"]:
        approval_reasons.append(f"review-fixture-provenance:{prov}")

    fixture = manifest["fixture"]
    if fixture.get("contains_sensitive_data") and not fixture.get("sanitization_evidence"):
        errors.append("sensitive-data-without-sanitization-evidence")

    if policy.get("require_run_id") and not str(manifest.get("run_id", "")).strip():
        errors.append("missing-run-id")

    isolation = manifest.get("isolation", {})
    if policy.get("require_isolation_boundary"):
        if not isolation.get("boundary_type") or not isolation.get("boundary_id") or not isolation.get("evidence"):
            errors.append("missing-isolation-boundary-evidence")

    mutations = manifest.get("mutations", [])
    cleanup = manifest.get("cleanup", {})
    if mutations and policy.get("require_cleanup_strategy_for_mutations"):
        if not cleanup.get("strategy") or not cleanup.get("command_or_method"):
            errors.append("missing-cleanup-strategy")
        if cleanup.get("scoped_to_run") is not True:
            errors.append("cleanup-not-scoped-to-run")

    side_effects = set(manifest.get("side_effects", []))
    approval_side_effects = set(policy.get("approval_required_side_effects", []))
    risky = sorted(side_effects & approval_side_effects)
    approval_reasons.extend([f"approval-side-effect:{x}" for x in risky])

    forbidden = set(manifest.get("forbidden_identifiers_present", [])) & set(policy.get("forbidden_identifiers", []))
    if forbidden:
        errors.append("forbidden-identifiers:" + ",".join(sorted(forbidden)))

    approval = manifest.get("approval", {})
    if approval_reasons:
        if not approval.get("required"):
            errors.append("approval-required-flag-missing")
        if not approval.get("approved") or not approval.get("evidence"):
            decision = "human-approval-required" if not errors else "blocked"
            print(json.dumps({"decision": decision, "approval_reasons": approval_reasons, "errors": errors}, indent=2))
            return 3 if decision == "human-approval-required" else 2

    if errors:
        print(json.dumps({"decision": "blocked", "errors": errors, "approval_reasons": approval_reasons}, indent=2))
        return 2

    print(json.dumps({"decision": "safe", "approval_reasons": approval_reasons, "errors": []}, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())

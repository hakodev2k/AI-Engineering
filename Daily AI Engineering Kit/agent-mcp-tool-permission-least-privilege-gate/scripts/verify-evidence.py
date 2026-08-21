#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def load_json(path: str):
    with Path(path).open("r", encoding="utf-8") as f:
        return json.load(f)


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify permission execution evidence for least-privilege compliance.")
    parser.add_argument("--policy", required=True)
    parser.add_argument("--evidence", required=True)
    args = parser.parse_args()

    try:
        policy = load_json(args.policy)
        evidence = load_json(args.evidence)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"INPUT_ERROR: {exc}", file=sys.stderr)
        return 2

    invocations = evidence.get("invocations", [])
    if not isinstance(invocations, list):
        print("VALIDATION_ERROR: invocations must be a list", file=sys.stderr)
        return 2

    required_approval = set(policy.get("approval_required_risk", []))
    errors = []

    for i, item in enumerate(invocations):
        risk = item.get("risk")
        approval = item.get("approval_id")
        if risk in required_approval and not approval:
            errors.append(f"invocation[{i}] missing approval_id for risk={risk}")
        if item.get("authorized") is not True:
            errors.append(f"invocation[{i}] not marked authorized")
        if item.get("argument_boundary_ok") is not True:
            errors.append(f"invocation[{i}] exceeded or did not verify argument boundary")

    if evidence.get("unknown_permissions"):
        errors.append("unknown_permissions is non-empty")
    if evidence.get("excess_permissions"):
        errors.append("excess_permissions is non-empty")
    if evidence.get("temporary_permissions_supported") and evidence.get("temporary_permissions_revoked") is not True:
        errors.append("temporary permissions were not confirmed revoked")
    if evidence.get("verifier_status") != "verified":
        errors.append("verifier_status must be verified")

    if errors:
        for error in errors:
            print(f"FAIL: {error}", file=sys.stderr)
        return 1

    print(f"VERIFIED: {len(invocations)} invocation(s) satisfy evidence checks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

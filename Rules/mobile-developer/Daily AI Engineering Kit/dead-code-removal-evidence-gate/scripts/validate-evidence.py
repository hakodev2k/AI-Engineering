#!/usr/bin/env python3
"""Validate dead-code evidence records and enforce removal/verification gates using stdlib only."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys


def load_json(path: str) -> dict:
    p = Path(path)
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}")


def validate(record: dict, policy: dict, require_removal_ready: bool, require_verified: bool) -> list[str]:
    errors: list[str] = []
    for key in ["candidate", "repository", "status", "verification_status", "channels", "review", "approvals", "artifacts", "remaining_risks"]:
        if key not in record:
            errors.append(f"missing top-level field: {key}")

    candidate = record.get("candidate", {})
    for key in ["identifier", "kind", "path", "visibility", "exposure"]:
        if not candidate.get(key):
            errors.append(f"candidate.{key} is required")

    repository = record.get("repository", {})
    for key in ["root", "revision"]:
        if not repository.get(key):
            errors.append(f"repository.{key} is required")

    status = record.get("status")
    if status not in policy.get("allowed_candidate_statuses", []):
        errors.append(f"invalid status: {status}")
    verification = record.get("verification_status")
    if verification not in policy.get("allowed_verification_statuses", []):
        errors.append(f"invalid verification_status: {verification}")

    channels = record.get("channels", {})
    required = list(policy.get("required_channels", []))
    if candidate.get("exposure") in policy.get("runtime_evidence_required_for_exposure", []):
        required.append("runtime-evidence")

    for channel in required:
        item = channels.get(channel)
        if not isinstance(item, dict):
            errors.append(f"missing required channel: {channel}")
            continue
        state = item.get("status")
        if state not in {"clear", "reference-found", "unknown", "not-applicable"}:
            errors.append(f"invalid channel status {channel}: {state}")
            continue
        if policy.get("fail_on_live_reference", True) and state == "reference-found":
            errors.append(f"blocking live reference in channel: {channel}")
        if policy.get("fail_on_unknown_required_channel", True) and state == "unknown":
            errors.append(f"required channel is unknown: {channel}")
        if not isinstance(item.get("evidence", []), list):
            errors.append(f"channel evidence must be an array: {channel}")

    review = record.get("review", {})
    if policy.get("require_independent_review", True) and require_removal_ready:
        if review.get("decision") != "accepted":
            errors.append("removal requires review.decision=accepted")
        if review.get("independent") is not True:
            errors.append("removal requires independent reviewer")
        if not review.get("reviewer"):
            errors.append("removal requires reviewer identity")

    approvals = record.get("approvals", [])
    if not isinstance(approvals, list):
        errors.append("approvals must be an array")
        approvals = []
    if require_removal_ready:
        for approval in approvals:
            if approval.get("required") is True and approval.get("approved") is not True:
                errors.append(f"required approval missing: {approval.get('action', '<unknown>')}")
        if status not in {"approved-for-removal", "removed"}:
            errors.append(f"status is not removal-ready: {status}")

    if require_verified:
        if verification != "verified":
            errors.append(f"verification_status must be verified, got: {verification}")
        if status != "removed":
            errors.append(f"verified record must have status=removed, got: {status}")
        artifacts = record.get("artifacts", {})
        if policy.get("require_post_removal_scan", True) and not artifacts.get("post_removal_scan"):
            errors.append("verified record requires artifacts.post_removal_scan")
        build_evidence = artifacts.get("build_test_evidence", [])
        if not isinstance(build_evidence, list) or not build_evidence:
            errors.append("verified record requires build/test evidence")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate dead-code evidence against policy.")
    parser.add_argument("record", help="Evidence record JSON")
    parser.add_argument("--policy", required=True, help="Policy JSON")
    parser.add_argument("--require-removal-ready", action="store_true")
    parser.add_argument("--require-verified", action="store_true")
    args = parser.parse_args()

    try:
        record = load_json(args.record)
        policy = load_json(args.policy)
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    errors = validate(record, policy, args.require_removal_ready or args.require_verified, args.require_verified)
    if errors:
        for error in errors:
            print(f"BLOCK: {error}")
        print(f"validation=blocked errors={len(errors)}")
        return 1

    print("validation=pass")
    if args.require_verified:
        print("verified=true")
    elif args.require_removal_ready:
        print("removal_ready=true")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

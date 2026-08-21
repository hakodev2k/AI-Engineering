#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def load_json(path: str):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"ERROR: file not found: {path}", file=sys.stderr)
        sys.exit(2)
    except json.JSONDecodeError as exc:
        print(f"ERROR: invalid JSON in {path}: {exc}", file=sys.stderr)
        sys.exit(2)


def require(record, key, errors):
    if key not in record:
        errors.append(f"missing required field: {key}")


def main():
    parser = argparse.ArgumentParser(description="Validate a multi-agent handoff record against deterministic policy rules.")
    parser.add_argument("--policy", required=True)
    parser.add_argument("--record", required=True)
    args = parser.parse_args()

    policy = load_json(args.policy)
    record = load_json(args.record)
    errors = []

    required = [
        "id", "sequence", "created_at", "producer", "receiver", "stage", "scope",
        "completion_state", "verification_state", "artifacts", "assumptions",
        "decisions", "risks", "approvals", "next_actions"
    ]
    for key in required:
        require(record, key, errors)

    completion = record.get("completion_state")
    verification = record.get("verification_state")
    if completion not in policy.get("allowed_completion_states", []):
        errors.append(f"invalid completion_state: {completion}")
    if verification not in policy.get("allowed_verification_states", []):
        errors.append(f"invalid verification_state: {verification}")

    if verification == "verified" and policy.get("require_verification_evidence_for_verified_state", True):
        if not record.get("verification_evidence"):
            errors.append("verification_state=verified requires verification_evidence")

    require_fp = policy.get("require_fingerprint_for_file_artifacts", True)
    for i, artifact in enumerate(record.get("artifacts", [])):
        if not isinstance(artifact, dict):
            errors.append(f"artifacts[{i}] must be an object")
            continue
        if artifact.get("kind") == "file" and require_fp:
            sha = artifact.get("sha256", "")
            if len(sha) != 64 or any(c not in "0123456789abcdefABCDEF" for c in sha):
                errors.append(f"artifacts[{i}] file requires a valid SHA-256 fingerprint")

    blocking = set(policy.get("blocking_risk_severities", ["critical"]))
    for i, risk in enumerate(record.get("risks", [])):
        if not isinstance(risk, dict):
            errors.append(f"risks[{i}] must be an object")
            continue
        if not risk.get("owner"):
            errors.append(f"risks[{i}] requires owner")
        if risk.get("severity") in blocking and not risk.get("resolved", False):
            errors.append(f"risks[{i}] is unresolved blocking risk")

    approvals = {a.get("action"): a for a in record.get("approvals", []) if isinstance(a, dict)}
    for action in record.get("dangerous_actions", []):
        if action in policy.get("human_approval_required_for", []) and action not in approvals:
            errors.append(f"dangerous action requires explicit human approval: {action}")

    review = record.get("review")
    if review and isinstance(review, dict):
        decision = review.get("decision")
        if decision not in policy.get("allowed_review_decisions", []):
            errors.append(f"invalid review decision: {decision}")

    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        sys.exit(1)

    print("PASS: handoff record satisfies deterministic policy checks")
    sys.exit(0)


if __name__ == "__main__":
    main()

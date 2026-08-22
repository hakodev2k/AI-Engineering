#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

REQUIRED_TOP = ["source", "trust_class", "findings", "sanitized_evidence", "action_authority", "review"]
VALID_TRUST = {"authoritative", "conditional", "evidence-only"}
VALID_SEVERITY = {"low", "medium", "high", "critical"}
VALID_FINDING_STATUS = {"open", "resolved", "human-approved", "false-positive"}
VALID_REVIEW_STATUS = {"pending", "pass", "revise", "blocked"}
VALID_AUTHORITY = {"trusted-task", "approved-policy", "human-approval", "untrusted-source", "none"}


def fail(errors):
    print(json.dumps({"status": "invalid", "errors": errors}, indent=2))
    sys.exit(2)


def main():
    parser = argparse.ArgumentParser(description="Validate prompt-injection evidence manifest policy invariants.")
    parser.add_argument("--policy", required=True)
    parser.add_argument("--manifest", required=True)
    args = parser.parse_args()

    try:
        policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))
        manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(json.dumps({"status": "error", "error": str(exc)}))
        sys.exit(3)

    errors = []
    for key in REQUIRED_TOP:
        if key not in manifest:
            errors.append(f"missing top-level field: {key}")
    if errors:
        fail(errors)

    source = manifest.get("source", {})
    for key in ["id", "type", "acquired_at", "purpose"]:
        if not source.get(key):
            errors.append(f"source.{key} is required")

    if manifest.get("trust_class") not in VALID_TRUST:
        errors.append("invalid trust_class")

    unresolved_blocking = []
    block_severities = set(policy.get("block_unresolved_severities", ["critical", "high"]))
    for idx, finding in enumerate(manifest.get("findings", [])):
        for key in ["id", "category", "severity", "status", "evidence"]:
            if not finding.get(key):
                errors.append(f"findings[{idx}].{key} is required")
        if finding.get("severity") not in VALID_SEVERITY:
            errors.append(f"findings[{idx}].severity invalid")
        if finding.get("status") not in VALID_FINDING_STATUS:
            errors.append(f"findings[{idx}].status invalid")
        if finding.get("severity") in block_severities and finding.get("status") == "open":
            unresolved_blocking.append(finding.get("id", f"#{idx}"))

    for idx, mapping in enumerate(manifest.get("action_authority", [])):
        if not mapping.get("action"):
            errors.append(f"action_authority[{idx}].action is required")
        if mapping.get("authority_type") not in VALID_AUTHORITY:
            errors.append(f"action_authority[{idx}].authority_type invalid")
        if "authority_reference" not in mapping:
            errors.append(f"action_authority[{idx}].authority_reference is required")

    review = manifest.get("review", {})
    if review.get("status") not in VALID_REVIEW_STATUS:
        errors.append("review.status invalid")
    if not review.get("reviewer"):
        errors.append("review.reviewer is required")
    if review.get("status") == "pass" and unresolved_blocking:
        errors.append("review cannot pass with unresolved high/critical findings: " + ", ".join(unresolved_blocking))

    if errors:
        fail(errors)

    print(json.dumps({
        "status": "valid",
        "review_status": review.get("status"),
        "blocking_findings": unresolved_blocking,
        "actions": len(manifest.get("action_authority", []))
    }))


if __name__ == "__main__":
    main()

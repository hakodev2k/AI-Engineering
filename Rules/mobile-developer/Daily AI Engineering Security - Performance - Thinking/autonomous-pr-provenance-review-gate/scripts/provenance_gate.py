#!/usr/bin/env python3
"""Deterministic pull-request provenance/review gate.

Evidence JSON example:
{
  "author": "alice",
  "sensitive_change": true,
  "all_commits_signed": true,
  "codeowner_approved": true,
  "status_checks": ["pass", "pass"],
  "latest_push_epoch": 100,
  "approvals": [{"actor":"bob", "submitted_epoch":120}],
  "agent_attributed": true,
  "agent_session_reference": "https://example/session/1",
  "unknown_provenance_fields": []
}
Exit: 0 allow, 2 invalid, 3 additional review, 4 block.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

ALLOW, INVALID, REVIEW, BLOCK = 0, 2, 3, 4


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def require_bool(data: dict, key: str) -> bool:
    value = data.get(key)
    if not isinstance(value, bool):
        raise ValueError(f"{key} must be boolean")
    return value


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("evidence", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    try:
        data, policy = load(args.evidence), load(args.policy)
        author = data.get("author")
        if not isinstance(author, str) or not author.strip():
            raise ValueError("author must be a non-empty string")
        sensitive = require_bool(data, "sensitive_change")
        all_signed = require_bool(data, "all_commits_signed")
        codeowner = require_bool(data, "codeowner_approved")
        approvals = data.get("approvals")
        checks = data.get("status_checks")
        unknown = data.get("unknown_provenance_fields", [])
        if not isinstance(approvals, list) or not all(isinstance(x, dict) for x in approvals):
            raise ValueError("approvals must be a list of objects")
        if not isinstance(checks, list) or not all(x in {"pass", "fail", "pending"} for x in checks):
            raise ValueError("status_checks must contain pass/fail/pending")
        if not isinstance(unknown, list) or not all(isinstance(x, str) for x in unknown):
            raise ValueError("unknown_provenance_fields must contain strings")
        latest = data.get("latest_push_epoch")
        if not isinstance(latest, (int, float)) or isinstance(latest, bool) or latest < 0:
            raise ValueError("latest_push_epoch must be non-negative number")

        independent = []
        latest_independent = []
        for review in approvals:
            actor = review.get("actor")
            ts = review.get("submitted_epoch")
            if not isinstance(actor, str) or not actor.strip():
                raise ValueError("approval actor must be non-empty string")
            if not isinstance(ts, (int, float)) or isinstance(ts, bool) or ts < 0:
                raise ValueError("approval submitted_epoch must be non-negative number")
            if actor != author:
                independent.append(actor)
                if ts >= latest:
                    latest_independent.append(actor)

        reasons = []
        review_reasons = []
        if policy.get("require_all_status_checks_pass", True) and (not checks or any(x != "pass" for x in checks)):
            reasons.append("required status checks are not all passing")
        if sensitive and policy.get("require_signed_commits_for_sensitive_changes", True) and not all_signed:
            reasons.append("sensitive change has unsigned/unverified commit")
        if sensitive and policy.get("require_codeowner_review_for_sensitive_changes", True) and not codeowner:
            reasons.append("sensitive change lacks required Code Owner approval")
        required = int(policy.get("required_independent_approvals", 1))
        if len(set(independent)) < required:
            reasons.append("insufficient independent approvals")
        if policy.get("require_latest_push_approval", True) and len(set(latest_independent)) < required:
            reasons.append("insufficient independent approval after latest push")

        if data.get("agent_attributed") is True and policy.get("require_agent_session_reference_when_available", True):
            ref = data.get("agent_session_reference")
            if not isinstance(ref, str) or not ref.strip():
                review_reasons.append("agent attribution present without session/provenance reference")

        max_unknown = int(policy.get("max_missing_nonblocking_evidence", 2))
        if unknown:
            review_reasons.append(f"unknown provenance fields: {', '.join(sorted(set(unknown)))}")
        if len(unknown) > max_unknown:
            reasons.append("too many missing provenance fields")

        if reasons:
            decision, code = "block", BLOCK
        elif review_reasons:
            decision, code = policy.get("unknown_provenance_action", "additional_review_required"), REVIEW
            if decision not in {"additional_review_required", "allow"}:
                decision, code = "additional_review_required", REVIEW
            if decision == "allow":
                code = ALLOW
        else:
            decision, code = "allow", ALLOW

        result = {
            "decision": decision,
            "sensitive_change": sensitive,
            "independent_approvers": sorted(set(independent)),
            "latest_push_independent_approvers": sorted(set(latest_independent)),
            "blocking_reasons": reasons,
            "review_reasons": review_reasons,
        }
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2))
    if not args.strict:
        return 0
    return code


if __name__ == "__main__":
    raise SystemExit(main())

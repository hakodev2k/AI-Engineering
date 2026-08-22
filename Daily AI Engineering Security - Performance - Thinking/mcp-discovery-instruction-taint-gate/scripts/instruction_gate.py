#!/usr/bin/env python3
"""Fail-closed admission gate for MCP discovery instructions.
Exit: 0 allow, 2 invalid input/policy, 4 review required, 5 deny.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any

ALLOW, INVALID, REVIEW, DENY = 0, 2, 4, 5


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def validate_policy(policy: dict[str, Any]) -> None:
    if not isinstance(policy.get("policy_version"), str) or not policy["policy_version"]:
        raise ValueError("policy_version is required")
    limit = policy.get("max_instruction_chars")
    if not isinstance(limit, int) or limit < 1:
        raise ValueError("max_instruction_chars must be a positive integer")
    for key in ("review_capabilities", "deny_patterns", "forbidden_control_codepoints"):
        if not isinstance(policy.get(key), list):
            raise ValueError(f"{key} must be a list")
    for pattern in policy["deny_patterns"]:
        if not isinstance(pattern, str):
            raise ValueError("deny_patterns entries must be strings")
        re.compile(pattern, re.IGNORECASE | re.DOTALL)


def evaluate(record: dict[str, Any], policy: dict[str, Any]) -> tuple[dict[str, Any], int]:
    validate_policy(policy)
    server_id = record.get("server_id")
    instructions = record.get("instructions")
    if not isinstance(server_id, str) or not server_id.strip():
        raise ValueError("server_id is required")
    if not isinstance(instructions, str):
        raise ValueError("instructions must be a string")
    requested = record.get("requested_capabilities", [])
    granted = record.get("granted_capabilities", [])
    if not isinstance(requested, list) or not all(isinstance(x, str) for x in requested):
        raise ValueError("requested_capabilities must be a string list")
    if not isinstance(granted, list) or not all(isinstance(x, str) for x in granted):
        raise ValueError("granted_capabilities must be a string list")

    raw_hash = sha256_text(instructions)
    normalized = unicodedata.normalize("NFKC", instructions)
    reasons: list[str] = []
    matched: list[str] = []

    if len(normalized) > policy["max_instruction_chars"]:
        reasons.append("instruction_length_exceeded")
        matched.append("SIZE001")

    forbidden = set(int(x) for x in policy["forbidden_control_codepoints"])
    controls = sorted({ord(ch) for ch in instructions if ord(ch) in forbidden and ch not in "\n\r\t"})
    if controls:
        reasons.append(f"forbidden_control_codepoints:{controls}")
        matched.append("CTRL001")

    for index, pattern in enumerate(policy["deny_patterns"], 1):
        if re.search(pattern, normalized, re.IGNORECASE | re.DOTALL):
            reasons.append(f"deny_pattern_{index}")
            matched.append(f"PAT{index:03d}")

    missing = sorted(set(requested) - set(granted))
    if missing:
        reasons.append("requested_capabilities_not_granted:" + ",".join(missing))
        matched.append("CAP001")

    if reasons:
        return ({
            "decision": "deny",
            "server_id": server_id,
            "source_uri": record.get("source_uri"),
            "sha256": raw_hash,
            "policy_version": policy["policy_version"],
            "matched_rules": matched,
            "reasons": reasons,
        }, DENY)

    review_caps = sorted(set(requested).intersection(set(policy["review_capabilities"])))
    approval = record.get("approval")
    approved = False
    if isinstance(approval, dict):
        approved = (
            approval.get("granted") is True
            and approval.get("sha256") == raw_hash
            and approval.get("server_id") == server_id
        )
    if review_caps and not approved:
        return ({
            "decision": "review",
            "server_id": server_id,
            "source_uri": record.get("source_uri"),
            "sha256": raw_hash,
            "policy_version": policy["policy_version"],
            "matched_rules": ["CAP002"],
            "reasons": ["high_impact_capability_requires_approval:" + ",".join(review_caps)],
        }, REVIEW)

    bounded = normalized[: policy["max_instruction_chars"]]
    labeled = "[UNTRUSTED MCP SERVER GUIDANCE]\n" + bounded
    return ({
        "decision": "allow",
        "server_id": server_id,
        "source_uri": record.get("source_uri"),
        "sha256": raw_hash,
        "policy_version": policy["policy_version"],
        "matched_rules": [],
        "reasons": ["passed_deterministic_admission_policy"],
        "bounded_instructions": labeled,
    }, ALLOW)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("record", type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    args = parser.parse_args()
    try:
        result, code = evaluate(load_json(args.record), load_json(args.policy))
    except (ValueError, TypeError, re.error) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return code


if __name__ == "__main__":
    raise SystemExit(main())

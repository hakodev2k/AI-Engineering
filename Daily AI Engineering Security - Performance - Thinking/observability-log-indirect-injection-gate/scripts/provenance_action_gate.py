#!/usr/bin/env python3
"""Fail-closed gate for actions derived from untrusted observability evidence.

Exit codes:
  0 allow
  2 invalid input/configuration
  4 approval required
  5 deny
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
import time
from pathlib import Path
from typing import Any

ALLOW, INVALID, APPROVAL_REQUIRED, DENY = 0, 2, 4, 5


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def canonical_hash(action: dict[str, Any]) -> str:
    material = {
        "tool": action.get("tool"),
        "operation": action.get("operation"),
        "resource": action.get("resource"),
        "environment": action.get("environment"),
        "arguments": action.get("arguments", {}),
    }
    raw = json.dumps(material, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def validate_list_of_strings(name: str, value: Any) -> list[str]:
    if not isinstance(value, list) or not all(isinstance(v, str) and v for v in value):
        raise ValueError(f"{name} must be a list of non-empty strings")
    return value


def approval_valid(approval: Any, action_hash: str, ttl: int, now: int) -> bool:
    if not isinstance(approval, dict) or approval.get("granted") is not True:
        return False
    if approval.get("action_sha256") != action_hash:
        return False
    issued = approval.get("issued_at_epoch")
    if not isinstance(issued, int) or issued > now or now - issued > ttl:
        return False
    approver = approval.get("approver")
    return isinstance(approver, str) and bool(approver.strip())


def remediation_contract_valid(contract: Any, action: dict[str, Any], action_hash: str, now: int) -> bool:
    if not isinstance(contract, dict) or contract.get("enabled") is not True:
        return False
    expires = contract.get("expires_at_epoch")
    if not isinstance(expires, int) or expires < now:
        return False
    allowed_ops = contract.get("allowed_operations", [])
    allowed_resources = contract.get("allowed_resources", [])
    if not isinstance(allowed_ops, list) or not isinstance(allowed_resources, list):
        return False
    if action.get("operation") not in allowed_ops or action.get("resource") not in allowed_resources:
        return False
    bound = contract.get("action_sha256")
    return bound in (None, action_hash)


def evaluate(record: dict[str, Any], policy: dict[str, Any], now: int) -> tuple[dict[str, Any], int]:
    source_class = record.get("source_class")
    if not isinstance(source_class, str) or not source_class:
        raise ValueError("source_class is required")
    provenance = record.get("provenance")
    if not isinstance(provenance, dict):
        if policy.get("require_provenance", True):
            return {"decision": "deny", "reason": "missing_provenance"}, DENY
        provenance = {}

    action = record.get("action")
    if not isinstance(action, dict):
        raise ValueError("action must be an object")
    for field in ("tool", "operation", "resource", "environment"):
        if not isinstance(action.get(field), str) or not action[field]:
            raise ValueError(f"action.{field} is required")
    capabilities = validate_list_of_strings("action.capabilities", action.get("capabilities", []))

    untrusted = set(validate_list_of_strings("untrusted_source_classes", policy.get("untrusted_source_classes", [])))
    high_impact = set(validate_list_of_strings("high_impact_capabilities", policy.get("high_impact_capabilities", [])))
    derived = provenance.get("derived_from_source") is True
    unknown_source = source_class not in untrusted and source_class != "trusted_instruction"

    if unknown_source and policy.get("fail_closed_on_unknown_source", True):
        return {"decision": "deny", "reason": "unknown_source_class"}, DENY

    source_is_untrusted = source_class in untrusted
    is_high_impact = bool(high_impact.intersection(capabilities))
    action_hash = canonical_hash(action)

    if source_is_untrusted and derived and not is_high_impact:
        if policy.get("allow_read_only_from_untrusted", True):
            return {"decision": "allow", "reason": "read_only_investigation", "action_sha256": action_hash}, ALLOW

    if source_is_untrusted and derived and is_high_impact:
        ttl = int(policy.get("approval_ttl_seconds", 900))
        if ttl <= 0:
            raise ValueError("approval_ttl_seconds must be positive")
        if approval_valid(record.get("approval"), action_hash, ttl, now):
            return {"decision": "allow", "reason": "fresh_exact_approval", "action_sha256": action_hash}, ALLOW
        if remediation_contract_valid(record.get("remediation_contract"), action, action_hash, now):
            return {"decision": "allow", "reason": "scoped_remediation_contract", "action_sha256": action_hash}, ALLOW
        return {
            "decision": "approval_required",
            "reason": "untrusted_evidence_high_impact_action",
            "action_sha256": action_hash,
            "capabilities": sorted(high_impact.intersection(capabilities)),
        }, APPROVAL_REQUIRED

    return {"decision": "allow", "reason": "not_derived_from_untrusted_evidence", "action_sha256": action_hash}, ALLOW


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("record", type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    parser.add_argument("--now", type=int, default=None, help="epoch seconds; defaults to current time")
    args = parser.parse_args()
    try:
        record = load_json(args.record)
        policy = load_json(args.policy)
        result, code = evaluate(record, policy, args.now if args.now is not None else int(time.time()))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return code


if __name__ == "__main__":
    raise SystemExit(main())

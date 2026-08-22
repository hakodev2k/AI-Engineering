#!/usr/bin/env python3
"""Deterministic action-time session revision and receipt gate.

Input JSON example:
{
  "session_id": "s1",
  "expected_revision": 41,
  "current_revision": 42,
  "logical_operation_id": "op-123",
  "capability": "dispatch",
  "action_fingerprint": "sha256:...",
  "receipt": {"status": "committed", "logical_operation_id": "op-123", "action_fingerprint": "sha256:..."}
}

Exit codes: 0 allow, 10 already_committed, 20 reconcile, 30 block, 2 invalid.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

ALLOW = 0
ALREADY = 10
RECONCILE = 20
BLOCK = 30
INVALID = 2


def load_object(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def require_nonempty_string(data: dict, key: str) -> str:
    value = data.get(key)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{key} must be a non-empty string")
    return value.strip()


def require_revision(data: dict, key: str) -> int:
    value = data.get(key)
    if not isinstance(value, int) or isinstance(value, bool) or value < 0:
        raise ValueError(f"{key} must be a non-negative integer")
    return value


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        record = load_object(args.input)
        policy = load_object(args.policy)
        session_id = require_nonempty_string(record, "session_id")
        capability = require_nonempty_string(record, "capability")
        write_caps = set(policy.get("write_capabilities", []))
        if not all(isinstance(x, str) for x in write_caps):
            raise ValueError("policy write_capabilities must be strings")
        if capability not in write_caps:
            result = {"decision": "allow", "reason": "read_only_or_unclassified_non_write", "session_id": session_id}
            print(json.dumps(result, indent=2))
            return ALLOW

        expected = require_revision(record, "expected_revision")
        current = require_revision(record, "current_revision")
        op_id = require_nonempty_string(record, "logical_operation_id")
        fingerprint = require_nonempty_string(record, "action_fingerprint")
        receipt = record.get("receipt")
        if receipt is not None and not isinstance(receipt, dict):
            raise ValueError("receipt must be an object or null")

        if receipt:
            r_status = receipt.get("status")
            r_op = receipt.get("logical_operation_id")
            r_fp = receipt.get("action_fingerprint")
            if r_status == "committed" and r_op == op_id and r_fp == fingerprint:
                print(json.dumps({"decision": "already_committed", "session_id": session_id, "logical_operation_id": op_id, "receipt": receipt}, indent=2))
                return ALREADY
            if r_status == "committed" and r_op == op_id and r_fp != fingerprint:
                print(json.dumps({"decision": "block", "reason": "logical_operation_id_conflicts_with_committed_fingerprint", "session_id": session_id, "logical_operation_id": op_id}, indent=2))
                return BLOCK
            if r_status in {"started", "unknown"}:
                print(json.dumps({"decision": "reconcile", "reason": f"prior_operation_{r_status}", "session_id": session_id, "logical_operation_id": op_id}, indent=2))
                return RECONCILE

        if expected != current:
            print(json.dumps({"decision": "reconcile", "reason": "session_revision_conflict", "session_id": session_id, "expected_revision": expected, "current_revision": current, "logical_operation_id": op_id}, indent=2))
            return RECONCILE

        print(json.dumps({"decision": "allow", "reason": "revision_current_no_committed_receipt", "session_id": session_id, "revision": current, "logical_operation_id": op_id}, indent=2))
        return ALLOW
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())

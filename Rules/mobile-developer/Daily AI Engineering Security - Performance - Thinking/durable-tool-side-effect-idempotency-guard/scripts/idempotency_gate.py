#!/usr/bin/env python3
"""Deterministic gate for replay-safe side-effecting tool calls.

Input JSON example:
{
  "workflow_id": "run-42",
  "action": "send_invoice",
  "target": "invoice:123",
  "canonical_arguments": {"invoice_id": 123, "recipient": "customer@example.invalid"},
  "side_effect_class": "send",
  "ledger_record": null
}

ledger_record, when present:
{"state":"succeeded|failed|unknown|in_progress", "attempts":1,
 "operation_key":"...", "result_ref":"receipt-1", "definitive_failure":false,
 "reconciled_not_applied":false, "human_approved_replay":false}

Exit codes: 0 execute/reuse, 2 invalid, 3 reconcile, 4 block.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

OK, INVALID, RECONCILE, BLOCK = 0, 2, 3, 4


def load_object(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def operation_key(data: dict[str, Any]) -> str:
    material = {
        "workflow_id": data["workflow_id"],
        "action": data["action"],
        "target": data["target"],
        "canonical_arguments": data["canonical_arguments"],
    }
    return hashlib.sha256(canonical_json(material).encode("utf-8")).hexdigest()


def require_string(data: dict[str, Any], name: str) -> str:
    value = data.get(name)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{name} must be a non-empty string")
    return value.strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        data = load_object(args.input)
        policy = load_object(args.policy)
        for field in ("workflow_id", "action", "target", "side_effect_class"):
            require_string(data, field)
        if "canonical_arguments" not in data or not isinstance(data["canonical_arguments"], (dict, list)):
            raise ValueError("canonical_arguments must be an object or array")
        effect = data["side_effect_class"]
        side_effects = set(policy.get("side_effect_classes", []))
        high_impact = set(policy.get("high_impact_classes", []))
        max_attempts = int(policy.get("max_execution_attempts", 3))
        if max_attempts < 1:
            raise ValueError("max_execution_attempts must be >= 1")
        key = operation_key(data)
        if effect not in side_effects:
            print(json.dumps({"decision": "execute", "operation_key": key, "reason": "read_only_or_unclassified"}, indent=2))
            return OK

        record = data.get("ledger_record")
        if record is None:
            out = {
                "decision": "execute",
                "operation_key": key,
                "provider_idempotency_key": key,
                "claim": {"state": "in_progress", "attempts": 1, "operation_key": key},
                "reason": "new_durable_claim_required"
            }
            print(json.dumps(out, indent=2))
            return OK
        if not isinstance(record, dict):
            raise ValueError("ledger_record must be an object or null")
        if record.get("operation_key") != key:
            print(json.dumps({"decision": "block", "operation_key": key, "reason": "ledger_key_mismatch"}, indent=2))
            return BLOCK
        attempts = record.get("attempts", 0)
        if not isinstance(attempts, int) or attempts < 0:
            raise ValueError("ledger_record.attempts must be a non-negative integer")
        state = record.get("state")
        if state == "succeeded":
            print(json.dumps({"decision": "reuse", "operation_key": key, "result_ref": record.get("result_ref"), "reason": "already_succeeded"}, indent=2))
            return OK
        if attempts >= max_attempts:
            print(json.dumps({"decision": "block", "operation_key": key, "reason": "attempt_budget_exhausted", "attempts": attempts}, indent=2))
            return BLOCK
        if state == "unknown":
            if record.get("reconciled_not_applied") is True:
                out = {"decision": "execute", "operation_key": key, "provider_idempotency_key": key,
                       "claim": {"state": "in_progress", "attempts": attempts + 1, "operation_key": key},
                       "reason": "reconciliation_proved_not_applied"}
                print(json.dumps(out, indent=2))
                return OK
            if effect in high_impact and record.get("human_approved_replay") is not True:
                print(json.dumps({"decision": "block", "operation_key": key, "reason": "high_impact_unknown_requires_reconciliation_or_approval"}, indent=2))
                return BLOCK
            print(json.dumps({"decision": "reconcile", "operation_key": key, "reason": "ambiguous_external_outcome"}, indent=2))
            return RECONCILE
        if state == "failed":
            if record.get("definitive_failure") is not True:
                print(json.dumps({"decision": "reconcile", "operation_key": key, "reason": "failure_not_proven_definitive"}, indent=2))
                return RECONCILE
            out = {"decision": "execute", "operation_key": key, "provider_idempotency_key": key,
                   "claim": {"state": "in_progress", "attempts": attempts + 1, "operation_key": key},
                   "reason": "definitive_failure_retry"}
            print(json.dumps(out, indent=2))
            return OK
        if state == "in_progress":
            print(json.dumps({"decision": "reconcile", "operation_key": key, "reason": "prior_attempt_may_still_have_applied"}, indent=2))
            return RECONCILE
        raise ValueError("ledger_record.state must be succeeded, failed, unknown, or in_progress")
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())

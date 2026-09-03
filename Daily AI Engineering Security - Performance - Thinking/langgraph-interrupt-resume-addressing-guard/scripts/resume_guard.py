#!/usr/bin/env python3
"""Preflight explicit resume addressing against current pending interrupt IDs.

Input files are JSON. `pending` may be either a list of interrupt objects with an
`id` field or an object containing `interrupts`. Resume must use a discriminated
envelope: {"kind":"scalar","value":...} or {"kind":"by_id","values":{...}}.

Exit codes: 0 allowed, 1 invalid input/config, 2 blocked by policy.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def load_json(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def validate_policy(policy: dict) -> dict:
    if not isinstance(policy, dict):
        raise ValueError("policy must be an object")
    limit = policy.get("maximum_pending_interrupts", 128)
    if not isinstance(limit, int) or limit < 1:
        raise ValueError("maximum_pending_interrupts must be a positive integer")
    return {
        "require_discriminated_envelope": bool(policy.get("require_discriminated_envelope", True)),
        "allow_scalar_only_when_single_pending": bool(policy.get("allow_scalar_only_when_single_pending", True)),
        "require_all_pending_for_by_id": bool(policy.get("require_all_pending_for_by_id", True)),
        "reject_unknown_interrupt_ids": bool(policy.get("reject_unknown_interrupt_ids", True)),
        "reject_duplicate_pending_ids": bool(policy.get("reject_duplicate_pending_ids", True)),
        "maximum_pending_interrupts": limit,
    }


def pending_ids(data: Any, policy: dict) -> list[str]:
    items = data.get("interrupts") if isinstance(data, dict) and "interrupts" in data else data
    if not isinstance(items, list):
        raise ValueError("pending must be a list or object with interrupts list")
    if len(items) > policy["maximum_pending_interrupts"]:
        raise ValueError("pending interrupt count exceeds policy maximum")
    ids: list[str] = []
    for index, item in enumerate(items):
        if not isinstance(item, dict):
            raise ValueError(f"pending[{index}] must be an object")
        ident = item.get("id")
        if not isinstance(ident, str) or not ident.strip():
            raise ValueError(f"pending[{index}].id must be a non-empty string")
        ids.append(ident)
    if policy["reject_duplicate_pending_ids"] and len(set(ids)) != len(ids):
        raise ValueError("duplicate pending interrupt IDs")
    return ids


def block(reason: str, pending: list[str], addressed: list[str] | None = None) -> dict:
    return {
        "allowed": False,
        "reason": reason,
        "pending_ids": pending,
        "addressed_ids": addressed or [],
        "unresolved_ids": pending,
    }


def evaluate(policy: dict, pending: list[str], resume: Any) -> dict:
    if not pending:
        return block("no_pending_interrupts", pending)
    if not isinstance(resume, dict) or "kind" not in resume:
        return block("discriminated_envelope_required", pending)
    kind = resume.get("kind")

    if kind == "scalar":
        if set(resume.keys()) != {"kind", "value"}:
            return block("invalid_scalar_envelope", pending)
        if policy["allow_scalar_only_when_single_pending"] and len(pending) != 1:
            return block("scalar_ambiguous_for_multiple_pending", pending)
        return {
            "allowed": True,
            "reason": "allowed",
            "pending_ids": pending,
            "addressed_ids": [pending[0]],
            "unresolved_ids": pending[1:],
            "framework_resume": resume["value"],
        }

    if kind == "by_id":
        if set(resume.keys()) != {"kind", "values"} or not isinstance(resume.get("values"), dict) or not resume["values"]:
            return block("invalid_by_id_envelope", pending)
        values = resume["values"]
        keys = list(values.keys())
        if any(not isinstance(k, str) or not k for k in keys):
            return block("invalid_interrupt_id", pending)
        unknown = [k for k in keys if k not in pending]
        if unknown and policy["reject_unknown_interrupt_ids"]:
            result = block("unknown_interrupt_id", pending, [k for k in keys if k in pending])
            result["unknown_ids"] = unknown
            return result
        addressed = [k for k in pending if k in values]
        unresolved = [k for k in pending if k not in values]
        if policy["require_all_pending_for_by_id"] and unresolved:
            result = block("incomplete_interrupt_map", pending, addressed)
            result["unresolved_ids"] = unresolved
            return result
        return {
            "allowed": True,
            "reason": "allowed",
            "pending_ids": pending,
            "addressed_ids": addressed,
            "unresolved_ids": unresolved,
            "framework_resume": {k: values[k] for k in addressed},
        }

    return block("unknown_resume_kind", pending)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--policy", required=True)
    ap.add_argument("--pending", required=True)
    ap.add_argument("--resume", required=True)
    args = ap.parse_args()
    try:
        policy = validate_policy(load_json(args.policy))
        pending = pending_ids(load_json(args.pending), policy)
        resume = load_json(args.resume)
    except ValueError as exc:
        print(json.dumps({"allowed": False, "reason": "input_error", "detail": str(exc)}))
        return 1
    result = evaluate(policy, pending, resume)
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0 if result["allowed"] else 2


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Validate tool-call/result correlation ledgers for AI-agent runtimes.

Exit codes:
  0 = valid and safe to continue
  2 = correlation/policy violation
  3 = invalid input
  4 = I/O failure
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def load_json(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"cannot read JSON {path}: {exc}") from exc


def digest(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def invocation_key(item: dict[str, Any]) -> tuple[str, int, str, str]:
    return (
        str(item.get("session_id", "")),
        int(item.get("generation", -1)),
        str(item.get("agent_id", "")),
        str(item.get("tool_call_id", "")),
    )


def validate(ledger: dict[str, Any], policy: dict[str, Any]) -> tuple[list[str], dict[str, Any]]:
    errors: list[str] = []
    quarantined: list[str] = []
    invocations = ledger.get("invocations")
    results = ledger.get("results")
    active_generation = ledger.get("active_generation")
    if not isinstance(invocations, list) or not isinstance(results, list) or not isinstance(active_generation, int):
        return ["ledger requires invocations[], results[], active_generation:int"], {}

    by_key: dict[tuple[str, int, str, str], dict[str, Any]] = {}
    for inv in invocations:
        if not isinstance(inv, dict):
            errors.append("invocation must be object")
            continue
        key = invocation_key(inv)
        if any(x in ("", -1) for x in key):
            errors.append(f"invalid invocation identity: {key}")
            continue
        if key in by_key:
            errors.append(f"duplicate invocation identity: {key}")
            continue
        by_key[key] = inv

    accepted: dict[tuple[str, int, str, str], str] = {}
    for result in results:
        if not isinstance(result, dict):
            errors.append("result must be object")
            continue
        key = invocation_key(result)
        if key not in by_key:
            errors.append(f"orphaned result: {key}")
            continue
        if key[1] != active_generation:
            if policy.get("quarantine_stale_generations", True):
                quarantined.append(str(key))
                continue
            errors.append(f"stale-generation result: {key}")
            continue
        result_hash = digest(result.get("payload"))
        if key in accepted:
            if accepted[key] == result_hash and policy.get("ignore_identical_duplicate_results", True):
                continue
            if policy.get("reject_conflicting_duplicate_results", True):
                errors.append(f"conflicting duplicate result: {key}")
                continue
        accepted[key] = result_hash

    unresolved: list[str] = []
    for key, inv in by_key.items():
        if key[1] != active_generation:
            continue
        state = str(inv.get("state", "issued"))
        if state in policy.get("terminal_states", ["resolved", "failed", "cancelled"]):
            continue
        if key not in accepted:
            unresolved.append(str(key))

    if unresolved and not policy.get("allow_partial_continuation", False):
        errors.append(f"unresolved active tool calls block continuation: {len(unresolved)}")

    for key, inv in by_key.items():
        if not inv.get("side_effectful"):
            continue
        if inv.get("replay_requested"):
            if policy.get("require_idempotency_for_side_effect_replay", True) and not inv.get("idempotency_key"):
                if policy.get("require_human_approval_for_unknown_side_effect_replay", True) and not inv.get("human_approval"):
                    errors.append(f"side-effect replay lacks idempotency proof or approval: {key}")

    return errors, {"accepted_results": len(accepted), "quarantined": quarantined, "unresolved": unresolved}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ledger", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--report")
    args = parser.parse_args()
    try:
        ledger = load_json(args.ledger)
        policy = load_json(args.policy)
        if not isinstance(ledger, dict) or not isinstance(policy, dict):
            print("ledger and policy must be JSON objects", file=sys.stderr)
            return 3
        errors, report = validate(ledger, policy)
        report["errors"] = errors
        report["status"] = "blocked" if errors else "safe_to_continue"
        output = json.dumps(report, indent=2, ensure_ascii=False)
        if args.report:
            Path(args.report).write_text(output + "\n", encoding="utf-8")
        print(output)
        return 2 if errors else 0
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 4
    except (TypeError, ValueError) as exc:
        print(f"invalid input: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
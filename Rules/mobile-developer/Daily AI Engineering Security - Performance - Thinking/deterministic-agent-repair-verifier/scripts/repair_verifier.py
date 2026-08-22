#!/usr/bin/env python3
"""Verify agent completion and bounded repair eligibility.

Exit codes: 0 verified, 2 invalid input, 3 repair allowed, 4 stop/block.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path


def load_obj(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def string_list(obj: dict, key: str) -> list[str]:
    value = obj.get(key, [])
    if not isinstance(value, list) or not all(isinstance(x, str) and x for x in value):
        raise ValueError(f"{key} must be an array of non-empty strings")
    return value


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--contract", type=Path, required=True)
    p.add_argument("--run-result", type=Path, required=True)
    p.add_argument("--policy", type=Path, required=True)
    a = p.parse_args()
    try:
        contract, result, policy = load_obj(a.contract), load_obj(a.run_result), load_obj(a.policy)
        required_preds = set(string_list(contract, "required_predicate_ids"))
        required_calls = set(string_list(contract, "required_calls"))
        passed_preds = set(string_list(result, "passed_predicate_ids"))
        observed_calls = set(string_list(result, "observed_calls"))
        fingerprints = string_list(result, "attempt_fingerprints")
        attempt = result.get("attempt", 0)
        if not isinstance(attempt, int) or isinstance(attempt, bool) or attempt < 0:
            raise ValueError("attempt must be a non-negative integer")
        observations = result.get("observations", {})
        if not isinstance(observations, dict):
            raise ValueError("observations must be an object")

        missing_preds = sorted(required_preds - passed_preds)
        missing_calls = sorted(required_calls - observed_calls)
        duplicate_count = 0
        if fingerprints:
            latest = fingerprints[-1]
            duplicate_count = max(0, sum(1 for f in fingerprints if f == latest) - 1)

        max_attempts = int(policy.get("max_repair_attempts", 3))
        max_duplicates = int(policy.get("max_duplicate_attempts", 1))
        need_preds = bool(policy.get("require_all_acceptance_predicates", True))
        need_calls = bool(policy.get("require_all_required_calls", True))
        has_failures = (need_preds and bool(missing_preds)) or (need_calls and bool(missing_calls))
        duplicate_block = duplicate_count > max_duplicates
        exhausted = attempt >= max_attempts

        if not has_failures and not duplicate_block:
            decision, code = "verified", 0
        elif duplicate_block or exhausted:
            decision, code = "stop", 4
        else:
            decision, code = "repair", 3

        feedback = {
            "failure_type": "duplicate-attempt" if duplicate_block else ("acceptance-failure" if has_failures else "none"),
            "failed_predicate_ids": missing_preds,
            "missing_required_calls": missing_calls,
            "observed": observations,
            "expected": {"required_predicate_ids": sorted(required_preds), "required_calls": sorted(required_calls)},
            "admissible_actions": result.get("admissible_actions", []),
            "remaining_attempts": max(0, max_attempts - attempt)
        }
        print(json.dumps({
            "decision": decision,
            "predicate_coverage": 1.0 if not required_preds else round(len(required_preds & passed_preds) / len(required_preds), 6),
            "required_call_coverage": 1.0 if not required_calls else round(len(required_calls & observed_calls) / len(required_calls), 6),
            "duplicate_latest_attempts": duplicate_count,
            "attempt": attempt,
            "feedback": feedback
        }, indent=2))
        return code
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

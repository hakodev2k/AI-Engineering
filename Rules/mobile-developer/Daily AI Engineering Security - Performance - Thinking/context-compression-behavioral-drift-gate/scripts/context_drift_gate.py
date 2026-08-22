#!/usr/bin/env python3
"""Deterministic gate for context-compression candidates.

Exit codes: 0 allow, 2 invalid input, 3 retryable failure, 4 blocking failure.
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
        raise ValueError(f"{path} must contain a JSON object")
    return value


def nonneg_int(obj: dict, key: str) -> int:
    value = obj.get(key)
    if not isinstance(value, int) or isinstance(value, bool) or value < 0:
        raise ValueError(f"{key} must be a non-negative integer")
    return value


def str_set(obj: dict, key: str) -> set[str]:
    value = obj.get(key, [])
    if not isinstance(value, list) or not all(isinstance(x, str) and x for x in value):
        raise ValueError(f"{key} must be an array of non-empty strings")
    return set(value)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--baseline", type=Path, required=True)
    p.add_argument("--candidate-result", type=Path, required=True)
    p.add_argument("--policy", type=Path, required=True)
    args = p.parse_args()
    try:
        baseline = load_obj(args.baseline)
        candidate = load_obj(args.candidate_result)
        policy = load_obj(args.policy)
        before = nonneg_int(baseline, "before_tokens")
        after = nonneg_int(candidate, "after_tokens")
        if before == 0:
            raise ValueError("before_tokens must be greater than zero")
        required = str_set(baseline, "required_contract_ids")
        critical = str_set(baseline, "critical_contract_ids")
        identifiers = str_set(baseline, "critical_identifiers")
        retained = str_set(candidate, "retained_contract_ids")
        retained_ids = str_set(candidate, "retained_critical_identifiers")
        probes = candidate.get("probe_results", [])
        if not isinstance(probes, list) or not all(isinstance(x, bool) for x in probes):
            raise ValueError("probe_results must be an array of booleans")

        missing_required = sorted(required - retained)
        missing_critical = sorted(critical - retained)
        missing_identifiers = sorted(identifiers - retained_ids)
        reduction = (before - after) / before
        required_retention = 1.0 if not required else len(required & retained) / len(required)
        identifier_retention = 1.0 if not identifiers else len(identifiers & retained_ids) / len(identifiers)
        probe_rate = 1.0 if not probes else sum(probes) / len(probes)

        min_reduction = float(policy.get("minimum_token_reduction_ratio", 0.20))
        min_required = float(policy.get("minimum_required_invariant_retention", 1.0))
        min_ids = float(policy.get("minimum_critical_identifier_retention", 1.0))
        min_probe = float(policy.get("minimum_probe_pass_rate", 1.0))
        attempts = candidate.get("attempt", 1)
        if not isinstance(attempts, int) or attempts < 1:
            raise ValueError("attempt must be a positive integer")
        max_attempts = int(policy.get("max_compaction_attempts", 2))

        blocking = bool(missing_critical or missing_identifiers)
        failures = []
        if required_retention < min_required:
            failures.append("required invariant retention below policy")
        if identifier_retention < min_ids:
            failures.append("critical identifier retention below policy")
        if probe_rate < min_probe:
            failures.append("probe pass rate below policy")
        if reduction < min_reduction:
            failures.append("token reduction below minimum useful threshold")
        if missing_critical:
            failures.append("critical contract entries missing")
        if missing_identifiers:
            failures.append("critical identifiers missing")

        if not failures:
            decision, code = "allow", 0
        elif blocking or attempts >= max_attempts:
            decision, code = "reject", 4
        else:
            decision, code = "retry", 3

        print(json.dumps({
            "decision": decision,
            "before_tokens": before,
            "after_tokens": after,
            "token_reduction_ratio": round(reduction, 6),
            "required_retention": round(required_retention, 6),
            "critical_identifier_retention": round(identifier_retention, 6),
            "probe_pass_rate": round(probe_rate, 6),
            "missing_required_contract_ids": missing_required,
            "missing_critical_contract_ids": missing_critical,
            "missing_critical_identifiers": missing_identifiers,
            "failures": failures,
            "attempt": attempts
        }, indent=2))
        return code
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

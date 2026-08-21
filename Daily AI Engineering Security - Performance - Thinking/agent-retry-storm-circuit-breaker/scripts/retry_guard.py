#!/usr/bin/env python3
"""Deterministic retry/circuit decision helper for agent logical operations.

Exit codes: 0 decision emitted, 2 policy block/open circuit, 3 invalid input/config, 4 I/O error.
This script does not execute tools or sleep. The host owns execution and persists state.
"""
from __future__ import annotations
import argparse, hashlib, json, random, sys
from pathlib import Path
from typing import Any


def load(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"cannot read {path}: {exc}") from exc


def canonical(obj: Any) -> bytes:
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def fingerprint(operation: dict[str, Any]) -> str:
    payload = {
        "tool": operation.get("tool"),
        "operation_type": operation.get("operation_type"),
        "resource": operation.get("resource"),
        "arguments": operation.get("arguments", {}),
    }
    return hashlib.sha256(canonical(payload)).hexdigest()


def decide(operation: dict[str, Any], state: dict[str, Any], policy: dict[str, Any], seed: int | None = None) -> dict[str, Any]:
    fp = fingerprint(operation)
    failure = operation.get("failure_class", "unknown")
    attempts = int(state.get("attempts", 0))
    run_retries = int(state.get("run_retries", 0))
    elapsed = float(state.get("retry_elapsed_seconds", 0))
    tokens = int(state.get("estimated_retry_tokens", 0))
    duplicates = int(state.get("no_progress_duplicates", 0))
    circuit = state.get("circuit", "CLOSED")
    side_effect = operation.get("operation_type") in policy.get("side_effecting_operation_types", [])
    key = operation.get("idempotency_key")

    base = {"fingerprint": fp, "attempts": attempts, "run_retries": run_retries, "circuit": circuit}
    if failure in policy.get("non_retryable_classes", []):
        return {**base, "decision": "fail_fast", "reason": "non_retryable_failure"}
    if side_effect and policy.get("require_idempotency_key_for_side_effect_retry", True) and not key:
        return {**base, "decision": "human_approval_required", "reason": "side_effect_without_idempotency_key"}
    if circuit == "OPEN":
        return {**base, "decision": "open_circuit", "reason": "circuit_already_open"}

    limits = [
        (attempts >= int(policy["max_attempts_per_operation"]), "attempt_budget_exhausted"),
        (run_retries >= int(policy["max_retries_per_run"]), "run_retry_budget_exhausted"),
        (elapsed >= float(policy["max_retry_elapsed_seconds_per_operation"]), "elapsed_budget_exhausted"),
        (tokens >= int(policy["max_estimated_retry_tokens_per_operation"]), "token_budget_exhausted"),
        (duplicates >= int(policy["max_no_progress_duplicates"]), "no_progress_duplicate_budget_exhausted"),
    ]
    for hit, reason in limits:
        if hit:
            return {**base, "decision": "open_circuit", "reason": reason, "next_circuit": "OPEN"}

    if failure not in policy.get("retryable_classes", []):
        return {**base, "decision": "fail_fast", "reason": "unclassified_failure_not_retryable"}

    base_ms = int(policy.get("base_backoff_ms", 500))
    cap_ms = int(policy.get("max_backoff_ms", 15000))
    raw = min(cap_ms, base_ms * (2 ** attempts))
    rng = random.Random(seed)
    delay = rng.randint(0, raw) if policy.get("full_jitter", True) else raw
    return {**base, "decision": "retry", "reason": "transient_within_budget", "delay_ms": delay, "next_attempt": attempts + 1}


def main() -> int:
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    fp = sub.add_parser("fingerprint")
    fp.add_argument("--operation", required=True)
    d = sub.add_parser("decide")
    d.add_argument("--operation", required=True); d.add_argument("--state", required=True); d.add_argument("--policy", required=True); d.add_argument("--seed", type=int)
    args = p.parse_args()
    try:
        op = load(args.operation)
        if args.cmd == "fingerprint":
            print(fingerprint(op)); return 0
        result = decide(op, load(args.state), load(args.policy), args.seed)
        print(json.dumps(result, indent=2, sort_keys=True))
        return 2 if result["decision"] == "open_circuit" else 0
    except (RuntimeError, KeyError, TypeError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr); return 3

if __name__ == "__main__":
    raise SystemExit(main())
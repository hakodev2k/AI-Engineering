#!/usr/bin/env python3
"""Validate a DLQ replay plan before execution.

Standard library only.
Exit codes: 0 pass, 2 policy/validation block, 3 input/tool error.
The plan fingerprint intentionally excludes `approval` and `status` so a human can
approve the exact substantive plan without creating a circular hash dependency.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

WILDCARD_TOKENS = {"*", "all", "any", "everything", "remaining", "entire-queue"}


def read_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}")


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def fingerprint(plan: dict[str, Any]) -> str:
    material = {k: v for k, v in plan.items() if k not in {"approval", "status"}}
    encoded = json.dumps(material, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def nonempty_strings(value: Any) -> bool:
    return isinstance(value, list) and bool(value) and all(isinstance(x, str) and x.strip() for x in value)


def parse_timestamp(value: str) -> dt.datetime:
    normalized = value.replace("Z", "+00:00")
    parsed = dt.datetime.fromisoformat(normalized)
    if parsed.tzinfo is None:
        raise ValueError("approval.approved_at must include a timezone")
    return parsed.astimezone(dt.timezone.utc)


def validate(plan: dict[str, Any], policy: dict[str, Any], now: dt.datetime) -> tuple[list[dict[str, str]], str]:
    findings: list[dict[str, str]] = []

    def add(code: str, message: str) -> None:
        findings.append({"code": code, "message": message})

    required = [
        "version", "plan_id", "environment", "queue", "message_ids", "tenant_scope",
        "failure_cause", "fix_evidence", "idempotency_evidence", "schema_compatibility",
        "routing_compatibility", "batch_size", "execution_retry_limit", "expected_outcome",
        "status", "approval",
    ]
    for key in required:
        if key not in plan:
            add("missing-field", f"missing required field: {key}")

    if findings:
        return findings, fingerprint(plan)

    if plan.get("version") != 1:
        add("unsupported-version", "plan.version must be 1")

    environment = plan.get("environment")
    if environment not in policy.get("allowed_environments", []):
        add("environment-not-allowed", f"environment is not allowed by policy: {environment!r}")

    if not isinstance(plan.get("queue"), str) or not plan["queue"].strip():
        add("invalid-queue", "queue must be a non-empty string")

    ids = plan.get("message_ids")
    if not nonempty_strings(ids):
        add("invalid-message-ids", "message_ids must be a non-empty array of non-empty strings")
        ids = []
    else:
        if len(ids) != len(set(ids)):
            add("duplicate-message-id", "message_ids must be unique")
        if policy.get("forbid_wildcard_scope", True):
            for item in ids:
                token = item.strip().lower()
                if token in WILDCARD_TOKENS or "*" in token:
                    add("wildcard-scope", f"wildcard-like message id is forbidden: {item!r}")

    if policy.get("require_tenant_scope", True) and not nonempty_strings(plan.get("tenant_scope")):
        add("missing-tenant-scope", "tenant_scope must explicitly identify at least one tenant/account scope")

    if policy.get("require_failure_cause", True):
        cause = plan.get("failure_cause")
        if not isinstance(cause, str) or len(cause.strip()) < 10:
            add("missing-failure-cause", "failure_cause must contain concrete evidence-backed detail")

    if policy.get("require_fix_evidence", True) and not nonempty_strings(plan.get("fix_evidence")):
        add("missing-fix-evidence", "fix_evidence must contain at least one evidence reference")

    if policy.get("require_idempotency_evidence", True) and not nonempty_strings(plan.get("idempotency_evidence")):
        add("missing-idempotency-evidence", "idempotency_evidence is required before replay")

    if plan.get("schema_compatibility") not in {"verified", "not-applicable"}:
        add("schema-unverified", "schema_compatibility must be verified or not-applicable")
    if plan.get("routing_compatibility") not in {"verified", "not-applicable"}:
        add("routing-unverified", "routing_compatibility must be verified or not-applicable")

    batch_size = plan.get("batch_size")
    if not isinstance(batch_size, int) or isinstance(batch_size, bool) or batch_size < 1:
        add("invalid-batch-size", "batch_size must be a positive integer")
    else:
        max_batch = int(policy.get("max_batch_size", 100))
        if batch_size > max_batch:
            add("batch-too-large", f"batch_size {batch_size} exceeds policy maximum {max_batch}")
        if ids and batch_size > len(ids):
            add("batch-exceeds-scope", "batch_size cannot exceed the explicit message_ids count")

    retry_limit = plan.get("execution_retry_limit")
    if not isinstance(retry_limit, int) or isinstance(retry_limit, bool) or retry_limit < 0:
        add("invalid-retry-limit", "execution_retry_limit must be a non-negative integer")
    else:
        max_retries = int(policy.get("max_execution_retries", 2))
        if retry_limit > max_retries:
            add("retry-limit-too-high", f"execution_retry_limit {retry_limit} exceeds policy maximum {max_retries}")

    if plan.get("status") not in policy.get("allowed_statuses", ["planned", "approved"]):
        add("invalid-status", f"status is not permitted: {plan.get('status')!r}")

    expected = plan.get("expected_outcome")
    if not isinstance(expected, str) or len(expected.strip()) < 10:
        add("missing-expected-outcome", "expected_outcome must describe a verifiable business result")

    fp = fingerprint(plan)
    if environment == "production" and policy.get("production_requires_approval", True):
        approval = plan.get("approval")
        if not isinstance(approval, dict):
            add("production-approval-required", "production replay requires approval metadata")
        else:
            approver = approval.get("approved_by")
            approved_at = approval.get("approved_at")
            approved_fp = approval.get("plan_fingerprint")
            if not isinstance(approver, str) or not approver.strip():
                add("invalid-approval", "approval.approved_by is required")
            if approved_fp != fp:
                add("approval-fingerprint-mismatch", "approval.plan_fingerprint does not match the substantive replay plan")
            if plan.get("status") != "approved":
                add("production-status-not-approved", "production plan status must be approved")
            if not isinstance(approved_at, str):
                add("invalid-approval-time", "approval.approved_at is required")
            else:
                try:
                    approved_time = parse_timestamp(approved_at)
                    age_minutes = (now - approved_time).total_seconds() / 60
                    if age_minutes < -5:
                        add("approval-from-future", "approval timestamp is materially in the future")
                    max_age = int(policy.get("approval_max_age_minutes", 120))
                    if age_minutes > max_age:
                        add("approval-expired", f"approval is {age_minutes:.1f} minutes old; maximum is {max_age}")
                except ValueError as exc:
                    add("invalid-approval-time", str(exc))

    return findings, fp


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a dead-letter queue replay plan")
    parser.add_argument("--plan", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--now", help="Optional ISO-8601 clock override for deterministic tests")
    args = parser.parse_args()

    try:
        plan = read_json(Path(args.plan))
        policy = read_json(Path(args.policy))
        if not isinstance(plan, dict) or not isinstance(policy, dict):
            raise ValueError("plan and policy must be JSON objects")
        now = parse_timestamp(args.now) if args.now else dt.datetime.now(dt.timezone.utc)
        findings, fp = validate(plan, policy, now)
        result = {
            "status": "pass" if not findings else "blocked",
            "plan_id": plan.get("plan_id"),
            "plan_fingerprint": fp,
            "finding_count": len(findings),
            "findings": findings,
        }
        write_json(Path(args.out), result)
        print(json.dumps(result, sort_keys=True))
        return 0 if not findings else 2
    except (OSError, ValueError, TypeError) as exc:
        print(f"replay_guard: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())

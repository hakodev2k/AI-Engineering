#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def add(findings, code, severity, message, operation=None):
    item = {"code": code, "severity": severity, "message": message}
    if operation is not None:
        item["operation_index"] = operation
    findings.append(item)


def validate(plan, policy):
    findings = []
    approvals = []
    env = str(plan.get("environment", "")).lower()
    prod = env in [str(x).lower() for x in policy.get("production_environment_names", [])]
    operations = plan.get("operations") or []

    if not env:
        add(findings, "ENVIRONMENT_REQUIRED", "block", "Target environment is required.")
    if not plan.get("change_id"):
        add(findings, "CHANGE_ID_REQUIRED", "block", "change_id is required.")
    if not operations:
        add(findings, "OPERATIONS_REQUIRED", "block", "At least one migration operation is required.")

    lock_timeout = plan.get("lock_timeout_seconds")
    statement_timeout = plan.get("statement_timeout_seconds")
    if lock_timeout is None:
        add(findings, "LOCK_TIMEOUT_REQUIRED", "block", "lock_timeout_seconds must be declared.")
    elif lock_timeout > int(policy.get("require_lock_timeout_seconds_max", 30)):
        add(findings, "LOCK_TIMEOUT_TOO_HIGH", "block", "Lock timeout exceeds policy maximum.")
    if statement_timeout is None:
        add(findings, "STATEMENT_TIMEOUT_REQUIRED", "block", "statement_timeout_seconds must be declared.")
    elif statement_timeout > int(policy.get("require_statement_timeout_seconds_max", 300)):
        add(findings, "STATEMENT_TIMEOUT_TOO_HIGH", "block", "Statement timeout exceeds policy maximum.")

    destructive = set(policy.get("destructive_operations", []))
    approval_ops = set(policy.get("approval_required_operations", []))
    contains_destructive = False

    for idx, op in enumerate(operations, 1):
        op_type = str(op.get("type", "")).lower()
        if not op_type:
            add(findings, "OPERATION_TYPE_REQUIRED", "block", "Operation type is required.", idx)
            continue
        if op_type in destructive:
            contains_destructive = True
            if prod and policy.get("block_destructive_in_production", True):
                add(findings, "DESTRUCTIVE_PRODUCTION_OPERATION", "block", f"{op_type} is blocked in production.", idx)
            else:
                approvals.append({"code": "DESTRUCTIVE_OPERATION_APPROVAL", "operation_index": idx, "operation": op_type})
        elif op_type in approval_ops:
            approvals.append({"code": "OPERATION_APPROVAL_REQUIRED", "operation_index": idx, "operation": op_type})

        if op_type == "data_backfill":
            rows = int(op.get("estimated_rows", 0) or 0)
            threshold = int(policy.get("max_unbatched_backfill_rows", 10000))
            if rows > threshold and not op.get("batched", False):
                add(findings, "UNBATCHED_LARGE_BACKFILL", "block", f"Backfill of {rows} rows must be batched.", idx)
            if op.get("batched", False) and not op.get("batch_size"):
                add(findings, "BATCH_SIZE_REQUIRED", "block", "Batched backfill requires batch_size.", idx)

    if plan.get("breaking_change", False) and policy.get("require_expand_contract_for_breaking_changes", True):
        if not plan.get("expand_contract", False):
            add(findings, "EXPAND_CONTRACT_REQUIRED", "block", "Breaking changes require an expand/contract rollout.")

    rollback = plan.get("rollback")
    if prod and policy.get("require_rollback_for_production", True):
        if not isinstance(rollback, dict) or not rollback.get("strategy"):
            add(findings, "ROLLBACK_REQUIRED", "block", "Production migrations require a rollback/compensation strategy.")
        elif rollback.get("data_loss_possible") is True:
            approvals.append({"code": "DATA_LOSS_ROLLBACK_APPROVAL", "operation_index": None, "operation": "rollback"})

    if contains_destructive and policy.get("require_backup_reference_for_destructive", True):
        if not plan.get("backup_reference"):
            add(findings, "BACKUP_REFERENCE_REQUIRED", "block", "Destructive operations require a backup/snapshot reference.")

    checks = ((plan.get("verification") or {}).get("checks") or [])
    if policy.get("require_post_verification", True) and not checks:
        add(findings, "POST_VERIFICATION_REQUIRED", "block", "At least one post-migration verification check is required.")

    if findings:
        status = "blocked"
    elif approvals and not plan.get("approval_reference"):
        status = "approval_required"
    else:
        status = "passed"

    return {
        "status": status,
        "environment": env,
        "change_id": plan.get("change_id"),
        "findings": findings,
        "approvals": approvals,
        "approval_reference": plan.get("approval_reference"),
        "executed": False
    }


def main():
    parser = argparse.ArgumentParser(description="Static preflight gate for agent-prepared database migration plans. Never executes migrations.")
    parser.add_argument("--plan", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--output")
    args = parser.parse_args()
    try:
        result = validate(load_json(args.plan), load_json(args.policy))
    except Exception as exc:
        print(json.dumps({"status": "error", "error": str(exc), "executed": False}, indent=2))
        return 3
    text = json.dumps(result, indent=2)
    if args.output:
        Path(args.output).write_text(text + "\n", encoding="utf-8")
    print(text)
    return 2 if result["status"] == "blocked" else 4 if result["status"] == "approval_required" else 0


if __name__ == "__main__":
    sys.exit(main())

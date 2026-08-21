#!/usr/bin/env python3
"""Validate Incident Commander JSON state using only the Python standard library."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

ALLOWED_SEVERITIES = {"SEV1", "SEV2", "SEV3", "SEV4"}
ALLOWED_STATUSES = {
    "declared",
    "triaging",
    "investigating",
    "mitigating",
    "monitoring",
    "resolved",
    "closed",
}
ALLOWED_TASK_STATES = {"queued", "active", "blocked", "done", "cancelled"}


def parse_iso(value: str, field: str, errors: list[str]) -> None:
    if not isinstance(value, str) or not value.strip():
        errors.append(f"{field}: expected a non-empty ISO-8601 string")
        return
    normalized = value.replace("Z", "+00:00")
    try:
        datetime.fromisoformat(normalized)
    except ValueError:
        errors.append(f"{field}: invalid ISO-8601 timestamp: {value!r}")


def require_string(obj: dict[str, Any], field: str, errors: list[str]) -> None:
    value = obj.get(field)
    if not isinstance(value, str) or not value.strip():
        errors.append(f"{field}: required non-empty string")


def require_list(obj: dict[str, Any], field: str, errors: list[str]) -> list[Any]:
    value = obj.get(field)
    if not isinstance(value, list):
        errors.append(f"{field}: required array")
        return []
    return value


def validate_task(task: Any, index: int, errors: list[str]) -> None:
    prefix = f"tasks[{index}]"
    if not isinstance(task, dict):
        errors.append(f"{prefix}: expected object")
        return
    for field in ("id", "goal", "owner", "expected_output", "state"):
        value = task.get(field)
        if not isinstance(value, str) or not value.strip():
            errors.append(f"{prefix}.{field}: required non-empty string")
    state = task.get("state")
    if isinstance(state, str) and state not in ALLOWED_TASK_STATES:
        errors.append(f"{prefix}.state: {state!r} is not allowed")
    if state == "blocked":
        blocker = task.get("blocker")
        if not isinstance(blocker, str) or not blocker.strip():
            errors.append(f"{prefix}.blocker: blocked task must describe the blocker")


def validate_decision(decision: Any, index: int, errors: list[str]) -> None:
    prefix = f"decisions[{index}]"
    if not isinstance(decision, dict):
        errors.append(f"{prefix}: expected object")
        return
    for field in ("timestamp", "decision", "rationale", "owner"):
        value = decision.get(field)
        if not isinstance(value, str) or not value.strip():
            errors.append(f"{prefix}.{field}: required non-empty string")
    if isinstance(decision.get("timestamp"), str):
        parse_iso(decision["timestamp"], f"{prefix}.timestamp", errors)


def validate(data: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(data, dict):
        return ["root: expected JSON object"]

    for field in ("incident_id", "title", "severity", "status", "started_at", "commander", "impact"):
        require_string(data, field, errors)

    severity = data.get("severity")
    if isinstance(severity, str) and severity not in ALLOWED_SEVERITIES:
        errors.append(f"severity: {severity!r} is not one of {sorted(ALLOWED_SEVERITIES)}")

    status = data.get("status")
    if isinstance(status, str) and status not in ALLOWED_STATUSES:
        errors.append(f"status: {status!r} is not one of {sorted(ALLOWED_STATUSES)}")

    if isinstance(data.get("started_at"), str):
        parse_iso(data["started_at"], "started_at", errors)

    for field in ("facts", "hypotheses", "unknowns", "risks", "recovery_evidence"):
        require_list(data, field, errors)

    tasks = require_list(data, "tasks", errors)
    for index, task in enumerate(tasks):
        validate_task(task, index, errors)

    decisions = require_list(data, "decisions", errors)
    for index, decision in enumerate(decisions):
        validate_decision(decision, index, errors)

    active_statuses = {"declared", "triaging", "investigating", "mitigating", "monitoring"}
    if status in active_statuses:
        checkpoint = data.get("next_checkpoint")
        if not isinstance(checkpoint, str) or not checkpoint.strip():
            errors.append("next_checkpoint: required while incident is active")
        else:
            parse_iso(checkpoint, "next_checkpoint", errors)

    if status in {"resolved", "closed"}:
        evidence = data.get("recovery_evidence")
        if not isinstance(evidence, list) or not evidence:
            errors.append("recovery_evidence: at least one item is required for resolved/closed incidents")
        residual_owner = data.get("residual_risk_owner")
        if data.get("risks") and (not isinstance(residual_owner, str) or not residual_owner.strip()):
            errors.append("residual_risk_owner: required when resolved/closed incident has residual risks")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate Incident Commander JSON state")
    parser.add_argument("state_file", type=Path, help="Path to incident state JSON")
    args = parser.parse_args()

    try:
        raw = args.state_file.read_text(encoding="utf-8")
    except OSError as exc:
        print(f"ERROR: cannot read {args.state_file}: {exc}", file=sys.stderr)
        return 2

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        print(f"ERROR: invalid JSON: {exc}", file=sys.stderr)
        return 2

    errors = validate(data)
    if errors:
        print("INVALID")
        for error in errors:
            print(f"- {error}")
        return 1

    print("VALID")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

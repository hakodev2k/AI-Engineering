#!/usr/bin/env python3
"""Validate incident-report.json structure and verification gates.

This validator proves structural completeness only. It cannot prove semantic causality.
Exit codes:
  0 = valid for requested mode
  1 = report validation failed
  2 = operational/input error
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

REQUIRED_TOP_LEVEL = (
    "incident_id",
    "status",
    "impact",
    "timeline_file",
    "hypotheses",
    "root_cause",
    "mitigation",
    "recovery_checks",
    "approvals",
    "uncertainties",
)

ALLOWED_STATUS = {"investigating", "mitigated", "verified"}
ALLOWED_CAUSE_STATUS = {"unconfirmed", "probable", "confirmed"}
ALLOWED_CONFIDENCE = {"low", "medium", "high", "confirmed"}
ALLOWED_HYPOTHESIS_STATUS = {"active", "rejected", "supported", "unresolved"}


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise RuntimeError(f"file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"invalid JSON in {path}: {exc}") from exc


def nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def validate(report: dict[str, Any], structure_only: bool) -> list[str]:
    errors: list[str] = []

    for key in REQUIRED_TOP_LEVEL:
        if key not in report:
            errors.append(f"missing top-level field: {key}")

    if errors:
        return errors

    if not nonempty_string(report["incident_id"]):
        errors.append("incident_id must be a non-empty string")

    status = report["status"]
    if status not in ALLOWED_STATUS:
        errors.append(f"status must be one of {sorted(ALLOWED_STATUS)}")

    impact = report["impact"]
    if not isinstance(impact, dict):
        errors.append("impact must be an object")
    else:
        for key in ("summary", "first_known_impact", "last_known_healthy"):
            if not nonempty_string(impact.get(key)):
                errors.append(f"impact.{key} must be a non-empty string")

    if not nonempty_string(report["timeline_file"]):
        errors.append("timeline_file must be a non-empty string")

    hypotheses = report["hypotheses"]
    if not isinstance(hypotheses, list):
        errors.append("hypotheses must be an array")
        hypotheses = []
    elif len([h for h in hypotheses if isinstance(h, dict) and h.get("status") == "active"]) > 5:
        errors.append("no more than five active hypotheses are allowed")

    for index, item in enumerate(hypotheses):
        if not isinstance(item, dict):
            errors.append(f"hypotheses[{index}] must be an object")
            continue
        for key in ("id", "statement", "status", "confidence", "supporting_evidence", "contradicting_evidence"):
            if key not in item:
                errors.append(f"hypotheses[{index}] missing {key}")
        if item.get("status") not in ALLOWED_HYPOTHESIS_STATUS:
            errors.append(f"hypotheses[{index}].status invalid")
        if item.get("confidence") not in ALLOWED_CONFIDENCE:
            errors.append(f"hypotheses[{index}].confidence invalid")
        for key in ("supporting_evidence", "contradicting_evidence"):
            if key in item and not isinstance(item[key], list):
                errors.append(f"hypotheses[{index}].{key} must be an array")

    root = report["root_cause"]
    if not isinstance(root, dict):
        errors.append("root_cause must be an object")
    else:
        if root.get("status") not in ALLOWED_CAUSE_STATUS:
            errors.append(f"root_cause.status must be one of {sorted(ALLOWED_CAUSE_STATUS)}")
        if not isinstance(root.get("evidence", []), list):
            errors.append("root_cause.evidence must be an array")
        if root.get("status") == "confirmed" and not root.get("evidence"):
            errors.append("confirmed root cause requires evidence references")

    mitigation = report["mitigation"]
    if not isinstance(mitigation, dict):
        errors.append("mitigation must be an object")
    else:
        for key in ("action", "expected_effect", "rollback_path", "requires_approval", "approval_granted"):
            if key not in mitigation:
                errors.append(f"mitigation missing {key}")
        if mitigation.get("requires_approval") is True and mitigation.get("approval_granted") is not True:
            if status in {"mitigated", "verified"}:
                errors.append("protected mitigation cannot be completed without recorded approval")

    checks = report["recovery_checks"]
    if not isinstance(checks, list):
        errors.append("recovery_checks must be an array")
        checks = []
    for index, check in enumerate(checks):
        if not isinstance(check, dict):
            errors.append(f"recovery_checks[{index}] must be an object")
            continue
        for key in ("name", "result", "evidence"):
            if key not in check:
                errors.append(f"recovery_checks[{index}] missing {key}")

    approvals = report["approvals"]
    if not isinstance(approvals, list):
        errors.append("approvals must be an array")

    if not isinstance(report["uncertainties"], list):
        errors.append("uncertainties must be an array")

    if structure_only:
        return errors

    if status == "verified":
        if not checks:
            errors.append("verified status requires recovery checks")
        elif any(check.get("result") != "pass" for check in checks if isinstance(check, dict)):
            errors.append("all recovery checks must pass for verified status")
        if isinstance(root, dict) and root.get("status") == "unconfirmed":
            errors.append("verified status requires probable or confirmed root cause")
        if not report.get("review") or report.get("review", {}).get("decision") != "pass":
            errors.append("verified status requires independent review decision 'pass'")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate incident report")
    parser.add_argument(
        "--report",
        default=os.getenv("INCIDENT_REPORT", "incident-report.json"),
        help="incident report JSON path",
    )
    parser.add_argument("--structure-only", action="store_true")
    args = parser.parse_args()

    data = load_json(Path(args.report))
    if not isinstance(data, dict):
        print("error: report root must be an object", file=sys.stderr)
        return 1

    errors = validate(data, args.structure_only)
    if errors:
        for error in errors:
            print(f"FAIL: {error}", file=sys.stderr)
        return 1

    print("PASS: incident report validation succeeded")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(2)

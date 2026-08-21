#!/usr/bin/env python3
import argparse
import json
import os
import sys


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate regression evidence semantics.")
    parser.add_argument("--evidence", default=os.getenv("REGRESSION_EVIDENCE_FILE", "regression-evidence.json"))
    parser.add_argument("--allow-uncovered", action="store_true", help="Allow required obligations to remain uncovered during intermediate workflow stages.")
    args = parser.parse_args()

    try:
        with open(args.evidence, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        fail(f"evidence file not found: {args.evidence}")
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON: {exc}")

    if not isinstance(data, dict):
        fail("root must be an object")
    change = data.get("change")
    obligations = data.get("obligations")
    if not isinstance(change, dict) or not str(change.get("summary", "")).strip():
        fail("change.summary is required")
    if not isinstance(obligations, list) or not obligations:
        fail("at least one obligation is required")

    seen = set()
    allowed_risk = {"low", "medium", "high"}
    allowed_status = {"uncovered", "covered", "approved-exception", "blocked"}
    allowed_types = {"unit", "integration", "contract", "end-to-end", "static", "manual"}
    allowed_results = {"pass", "fail", "not-run", "inconclusive"}
    errors = []

    min_high = int(os.getenv("REGRESSION_MIN_HIGH_RISK_TESTS", "2"))
    high_covered = 0
    allow_manual = os.getenv("REGRESSION_ALLOW_MANUAL_EVIDENCE", "0") == "1"

    for i, item in enumerate(obligations):
        prefix = f"obligations[{i}]"
        if not isinstance(item, dict):
            errors.append(f"{prefix} must be an object")
            continue
        oid = str(item.get("id", "")).strip()
        if not oid:
            errors.append(f"{prefix}.id is required")
        elif oid in seen:
            errors.append(f"duplicate obligation id: {oid}")
        else:
            seen.add(oid)

        for field in ("behavior", "expected"):
            if not str(item.get(field, "")).strip():
                errors.append(f"{prefix}.{field} is required")
        if item.get("risk") not in allowed_risk:
            errors.append(f"{prefix}.risk must be low|medium|high")
        if not isinstance(item.get("required"), bool):
            errors.append(f"{prefix}.required must be boolean")
        if item.get("status") not in allowed_status:
            errors.append(f"{prefix}.status is invalid")
        if item.get("evidenceType") not in allowed_types:
            errors.append(f"{prefix}.evidenceType is invalid")
        if "result" in item and item.get("result") not in allowed_results:
            errors.append(f"{prefix}.result is invalid")

        status = item.get("status")
        required = item.get("required") is True
        risk = item.get("risk")
        evidence_type = item.get("evidenceType")

        if status == "covered":
            if evidence_type == "manual" and not allow_manual:
                errors.append(f"{oid}: manual evidence is disabled")
            if evidence_type not in {"static", "manual"} and not str(item.get("testFile", "")).strip():
                errors.append(f"{oid}: covered test evidence requires testFile")
            if not str(item.get("evidenceNote", "")).strip():
                errors.append(f"{oid}: covered evidence requires evidenceNote")
            if evidence_type not in {"static", "manual"}:
                if not str(item.get("command", "")).strip():
                    errors.append(f"{oid}: covered test evidence requires command")
                if item.get("result") != "pass":
                    errors.append(f"{oid}: covered test evidence must have result=pass")
            if risk == "high":
                high_covered += 1

        if status == "approved-exception" and not str(item.get("approval", "")).strip():
            errors.append(f"{oid}: approved-exception requires approval")
        if required and status == "uncovered" and not args.allow_uncovered:
            errors.append(f"{oid}: required obligation is uncovered")
        if required and status == "blocked" and not args.allow_uncovered:
            errors.append(f"{oid}: required obligation remains blocked")

    high_required = sum(1 for x in obligations if isinstance(x, dict) and x.get("required") is True and x.get("risk") == "high")
    if high_required >= min_high and high_covered == 0 and not args.allow_uncovered:
        errors.append("high-risk obligations exist but none have covered evidence")

    for check in data.get("broaderChecks", []):
        if not isinstance(check, dict) or not str(check.get("command", "")).strip():
            errors.append("broaderChecks entries require command")
        elif check.get("result") not in allowed_results:
            errors.append("broaderChecks result is invalid")

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)

    print(f"OK: {len(obligations)} obligations validated")


if __name__ == "__main__":
    main()

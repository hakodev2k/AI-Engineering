#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def read_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise RuntimeError(f"cannot read JSON {path}: {exc}") from exc


def fail(errors, message):
    errors.append(message)


def main():
    parser = argparse.ArgumentParser(description="Validate migration evidence manifest against safety policy.")
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()

    try:
        manifest = read_json(Path(args.manifest))
        policy = read_json(Path(args.policy))
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 3

    try:
        errors = []
        required = policy.get("required_manifest_fields", [])
        for field in required:
            if field not in manifest:
                fail(errors, f"missing required field: {field}")

        risk = manifest.get("riskLevel")
        if risk not in policy.get("risk_levels", []):
            fail(errors, f"unsupported riskLevel: {risk}")

        db = manifest.get("database", {})
        if db.get("engine") not in policy.get("supported_databases", []):
            fail(errors, f"unsupported database engine: {db.get('engine')}")
        if not db.get("version"):
            fail(errors, "database.version is required")

        affected = manifest.get("affectedObjects", [])
        if not isinstance(affected, list) or not affected:
            fail(errors, "affectedObjects must be non-empty")

        operations = manifest.get("operations", [])
        if not isinstance(operations, list) or not operations:
            fail(errors, "operations must be non-empty")
        destructive_ops = [op for op in operations if isinstance(op, dict) and op.get("destructive")]

        inspection = manifest.get("inspection", {})
        if not inspection.get("reportPath"):
            fail(errors, "inspection.reportPath is required")
        destructive_findings = int(inspection.get("destructiveFindings", 0) or 0)
        security_findings = int(inspection.get("securityFindings", 0) or 0)

        vp = manifest.get("verificationPlan", {})
        if not vp.get("preApply"):
            fail(errors, "verificationPlan.preApply must be non-empty")
        if not vp.get("postApply"):
            fail(errors, "verificationPlan.postApply must be non-empty")

        recovery = manifest.get("recoveryPlan", {})
        if risk in policy.get("require_recovery_plan_for_risk_levels", []):
            if recovery.get("mode") in (None, "not-required"):
                fail(errors, f"recovery plan required for risk level {risk}")
            if not recovery.get("steps"):
                fail(errors, "recoveryPlan.steps must be non-empty")
            if not recovery.get("testedOrReviewed"):
                fail(errors, "recoveryPlan must be tested or reviewed")

        if risk in policy.get("require_dry_run_for_risk_levels", []):
            dry_run = manifest.get("dryRun", {})
            if not dry_run.get("performed"):
                fail(errors, f"dry run required for risk level {risk}")
            if dry_run.get("passed") is not True:
                fail(errors, "required dry run did not pass")
            if not dry_run.get("evidence"):
                fail(errors, "dry run evidence is required")

        review = manifest.get("review", {})
        lifecycle = manifest.get("lifecycleStatus")
        if lifecycle in ("reviewed", "approved", "applied", "verified") and review.get("status") != "pass":
            fail(errors, f"review.status must be pass for lifecycleStatus {lifecycle}")

        approval_required = (
            manifest.get("environment") == "production"
            or risk in policy.get("approval_required_risks", [])
            or bool(destructive_ops)
            or destructive_findings > 0
            or security_findings > 0
        )
        approval = manifest.get("approval", {})
        if approval_required:
            if approval.get("required") is not True:
                fail(errors, "approval.required must be true for this migration")
            if lifecycle in ("approved", "applied", "verified"):
                if approval.get("approved") is not True:
                    fail(errors, f"approval must be recorded before lifecycleStatus {lifecycle}")
                if not approval.get("approver"):
                    fail(errors, "approval.approver is required")
                if not approval.get("migrationRef"):
                    fail(errors, "approval.migrationRef is required")
                if manifest.get("migrationRef") and approval.get("migrationRef") != manifest.get("migrationRef"):
                    fail(errors, "approval migrationRef does not match manifest migrationRef")

        if manifest.get("environment") == "production" and (destructive_ops or destructive_findings > 0):
            if policy.get("allow_destructive_production_apply") is not True:
                fail(errors, "destructive production apply is blocked by policy")

        unresolved = manifest.get("unresolvedRisks", [])
        if lifecycle == "verified" and unresolved:
            approval_ok = approval.get("approved") is True and bool(approval.get("acceptedRisks"))
            if not approval_ok:
                fail(errors, "verified migration has unresolved risks without explicit acceptedRisks")

        if errors:
            for item in errors:
                print(f"ERROR: {item}")
            return 2

        print("PASS: migration manifest satisfies deterministic policy checks")
        return 0
    except Exception as exc:
        print(f"ERROR: validation operational failure: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    sys.exit(main())

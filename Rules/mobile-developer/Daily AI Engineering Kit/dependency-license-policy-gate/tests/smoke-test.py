#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POLICY = ROOT / "config" / "license-policy.json"
VALIDATE = ROOT / "scripts" / "validate-license-inventory.py"
EVALUATE = ROOT / "scripts" / "evaluate-license-policy.py"
GATE = ROOT / "scripts" / "evaluate-license-gate.py"


def run(args, expected):
    completed = subprocess.run([sys.executable, *map(str, args)], text=True, capture_output=True)
    if completed.returncode != expected:
        raise AssertionError(
            f"expected exit {expected}, got {completed.returncode}\nstdout={completed.stdout}\nstderr={completed.stderr}"
        )
    return completed


def inventory(license_expression, package="nuget:Example.Package", version="1.0.0", source=None):
    return {
        "inventory_version": "1.0.0",
        "generated_at": "2026-08-17T10:30:00Z",
        "distribution_context": "commercial-backend-service",
        "dependencies": [{
            "package_key": package,
            "ecosystem": "nuget",
            "name": package.split(":", 1)[1],
            "version": version,
            "change_type": "added",
            "source_fingerprint": source or f"nuget.org:{package.split(':', 1)[1]}@{version}",
            "license_expression": license_expression,
            "raw_license": license_expression,
            "evidence_confidence": "verified",
            "evidence_references": ["registry-metadata:test-fixture"],
            "direct": True
        }]
    }


def write(path, value):
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def main():
    with tempfile.TemporaryDirectory() as td:
        temp = Path(td)

        # 1. Allowed dependency -> verified without review/exception.
        allowed = temp / "allowed.json"
        allowed_eval = temp / "allowed-eval.json"
        write(allowed, inventory("MIT"))
        run([VALIDATE, "--inventory", allowed, "--policy", POLICY], 0)
        run([EVALUATE, "--inventory", allowed, "--policy", POLICY, "--output", allowed_eval], 0)
        result = run([GATE, "--inventory", allowed, "--evaluation", allowed_eval, "--policy", POLICY], 0)
        assert json.loads(result.stdout)["status"] == "verified"

        # 2. Restricted dependency -> approval required after independent review.
        restricted = temp / "restricted.json"
        restricted_eval = temp / "restricted-eval.json"
        review = temp / "review.json"
        exception = temp / "exception.json"
        source = "nuget.org:Example.Restricted@2.1.0"
        write(restricted, inventory("MPL-2.0", "nuget:Example.Restricted", "2.1.0", source))
        run([VALIDATE, "--inventory", restricted, "--policy", POLICY], 0)
        run([EVALUATE, "--inventory", restricted, "--policy", POLICY, "--output", restricted_eval], 3)
        evaluation = json.loads(restricted_eval.read_text(encoding="utf-8"))
        write(review, {
            "reviewer_id": "reviewer-agent",
            "analyst_id": "analyst-agent",
            "inventory_fingerprint": evaluation["inventory_fingerprint"],
            "policy_version": "1.0.0",
            "status": "approval-required",
            "reviewed_at": "2026-08-17T10:40:00Z",
            "findings": ["Restricted license requires exception approval."]
        })
        result = run([
            GATE, "--inventory", restricted, "--evaluation", restricted_eval,
            "--policy", POLICY, "--review", review, "--now", "2026-08-17T11:00:00Z"
        ], 3)
        assert json.loads(result.stdout)["status"] == "human-approval-required"

        # 3. Exact-scope, unexpired exception -> verified.
        write(exception, {
            "exception_id": "lic-ex-test",
            "package_key": "nuget:Example.Restricted",
            "version": "2.1.0",
            "source_fingerprint": source,
            "license_expression": "MPL-2.0",
            "policy_version": "1.0.0",
            "approved_by": "human-reviewer",
            "approved_at": "2026-08-17T10:45:00Z",
            "expires_at": "2026-08-18T10:45:00Z",
            "reason": "Fixture approval for exact dependency identity."
        })
        result = run([
            GATE, "--inventory", restricted, "--evaluation", restricted_eval,
            "--policy", POLICY, "--review", review, "--exception", exception,
            "--now", "2026-08-17T11:00:00Z"
        ], 0)
        assert json.loads(result.stdout)["status"] == "verified"

        # 4. Prohibited dependency -> blocked; policy does not permit exception.
        prohibited = temp / "prohibited.json"
        prohibited_eval = temp / "prohibited-eval.json"
        write(prohibited, inventory("AGPL-3.0-only", "nuget:Example.Prohibited"))
        run([VALIDATE, "--inventory", prohibited, "--policy", POLICY], 0)
        run([EVALUATE, "--inventory", prohibited, "--policy", POLICY, "--output", prohibited_eval], 4)
        result = run([GATE, "--inventory", prohibited, "--evaluation", prohibited_eval, "--policy", POLICY], 4)
        assert json.loads(result.stdout)["status"] == "blocked"

    print("SMOKE TEST PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

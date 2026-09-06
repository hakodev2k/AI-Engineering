#!/usr/bin/env python3
import hashlib
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GUARD = ROOT / "scripts" / "replay_guard.py"
RECEIPTS = ROOT / "scripts" / "validate_receipts.py"
POLICY = ROOT / "config" / "replay-policy.json"


def substantive_fingerprint(plan):
    material = {k: v for k, v in plan.items() if k not in {"approval", "status"}}
    payload = json.dumps(material, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    return hashlib.sha256(payload).hexdigest()


def base_plan(environment="staging"):
    return {
        "version": 1,
        "plan_id": "test-plan",
        "environment": environment,
        "queue": "orders-dlq",
        "message_ids": ["m1", "m2"],
        "tenant_scope": ["tenant-a"],
        "failure_cause": "Verified transient dependency outage caused handler failure.",
        "fix_evidence": ["incident:dependency-recovered"],
        "idempotency_evidence": ["unique message_id constraint and duplicate-delivery test"],
        "schema_compatibility": "verified",
        "routing_compatibility": "verified",
        "batch_size": 2,
        "execution_retry_limit": 1,
        "expected_outcome": "Both messages process once without duplicate business rows.",
        "status": "planned",
        "approval": None,
    }


class ReplayGuardTests(unittest.TestCase):
    def run_script(self, script, *args):
        return subprocess.run(
            ["python", str(script), *map(str, args)],
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

    def write(self, path, value):
        Path(path).write_text(json.dumps(value), encoding="utf-8")

    def test_staging_plan_passes(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            plan = td / "plan.json"
            out = td / "out.json"
            self.write(plan, base_plan())
            p = self.run_script(GUARD, "--plan", plan, "--policy", POLICY, "--out", out)
            self.assertEqual(p.returncode, 0, p.stderr)
            self.assertEqual(json.loads(out.read_text())["status"], "pass")

    def test_wildcard_scope_blocks(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            value = base_plan()
            value["message_ids"] = ["*"]
            value["batch_size"] = 1
            plan = td / "plan.json"
            out = td / "out.json"
            self.write(plan, value)
            p = self.run_script(GUARD, "--plan", plan, "--policy", POLICY, "--out", out)
            self.assertEqual(p.returncode, 2)
            codes = {x["code"] for x in json.loads(out.read_text())["findings"]}
            self.assertIn("wildcard-scope", codes)

    def test_production_without_approval_blocks(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            plan = td / "plan.json"
            out = td / "out.json"
            self.write(plan, base_plan("production"))
            p = self.run_script(
                GUARD, "--plan", plan, "--policy", POLICY, "--out", out,
                "--now", "2026-09-06T13:00:00+00:00"
            )
            self.assertEqual(p.returncode, 2)
            codes = {x["code"] for x in json.loads(out.read_text())["findings"]}
            self.assertIn("production-approval-required", codes)

    def test_matching_production_approval_passes(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            value = base_plan("production")
            value["status"] = "approved"
            value["approval"] = {
                "approved_by": "incident-commander",
                "approved_at": "2026-09-06T12:30:00+00:00",
                "plan_fingerprint": substantive_fingerprint(value),
            }
            plan = td / "plan.json"
            out = td / "out.json"
            self.write(plan, value)
            p = self.run_script(
                GUARD, "--plan", plan, "--policy", POLICY, "--out", out,
                "--now", "2026-09-06T13:00:00+00:00"
            )
            self.assertEqual(p.returncode, 0, p.stderr)

    def test_receipts_reject_unplanned_message(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            plan = td / "plan.json"
            receipts = td / "receipts.json"
            out = td / "out.json"
            self.write(plan, base_plan())
            self.write(receipts, [
                {"message_id": "m1", "status": "processed", "attempt": 1, "timestamp": "2026-09-06T13:00:00Z"},
                {"message_id": "m2", "status": "processed", "attempt": 1, "timestamp": "2026-09-06T13:00:01Z"},
                {"message_id": "m3", "status": "processed", "attempt": 1, "timestamp": "2026-09-06T13:00:02Z"},
            ])
            p = self.run_script(RECEIPTS, "--plan", plan, "--receipts", receipts, "--out", out)
            self.assertEqual(p.returncode, 2)
            self.assertTrue(any("unplanned message_id" in e for e in json.loads(out.read_text())["errors"]))

    def test_receipts_allow_bounded_retry_then_success(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            plan = td / "plan.json"
            receipts = td / "receipts.json"
            out = td / "out.json"
            self.write(plan, base_plan())
            self.write(receipts, [
                {"message_id": "m1", "status": "failed", "attempt": 1, "timestamp": "2026-09-06T13:00:00Z"},
                {"message_id": "m1", "status": "processed", "attempt": 2, "timestamp": "2026-09-06T13:00:03Z"},
                {"message_id": "m2", "status": "already-processed", "attempt": 1, "timestamp": "2026-09-06T13:00:04Z"},
            ])
            p = self.run_script(RECEIPTS, "--plan", plan, "--receipts", receipts, "--out", out)
            self.assertEqual(p.returncode, 0, p.stderr)
            self.assertEqual(json.loads(out.read_text())["status"], "verified")


if __name__ == "__main__":
    unittest.main()

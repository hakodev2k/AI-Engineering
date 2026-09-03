import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config" / "dlq-replay-gate.json"


class ReplayGateTests(unittest.TestCase):
    def run_script(self, name, *args):
        return subprocess.run(
            [sys.executable, str(ROOT / "scripts" / name), *map(str, args)],
            capture_output=True,
            text=True,
            check=False,
        )

    def test_valid_plan_passes(self):
        plan = {
            "environment": "staging",
            "queue": "orders-dlq",
            "message_ids": ["m1"],
            "reason": "dependency recovered",
            "failure_classification": "transient-upstream",
            "idempotency_evidence": "handler uses unique operation key",
            "approval_required": False,
            "approval_reference": None,
        }
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "plan.json"
            path.write_text(json.dumps(plan), encoding="utf-8")
            result = self.run_script("validate-replay-plan.py", "--plan", path, "--config", CONFIG)
            self.assertEqual(result.returncode, 0, result.stderr)

    def test_production_without_approval_fails(self):
        plan = {
            "environment": "production",
            "queue": "orders-dlq",
            "message_ids": ["m1"],
            "reason": "dependency recovered",
            "failure_classification": "transient-upstream",
            "idempotency_evidence": "dedup table",
            "approval_required": False,
            "approval_reference": None,
        }
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "plan.json"
            path.write_text(json.dumps(plan), encoding="utf-8")
            result = self.run_script("validate-replay-plan.py", "--plan", path, "--config", CONFIG)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("approval_reference", result.stderr)

    def test_unknown_receipt_cannot_verify(self):
        evidence = {
            "environment": "staging",
            "queue": "q",
            "plan_sha256": "a" * 64,
            "attempted_message_ids": ["m1"],
            "receipts": [{"message_id": "m1", "status": "unknown"}],
            "post_replay_checks": ["checked"],
            "verification_status": "verified",
            "remaining_risks": [],
        }
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "evidence.json"
            path.write_text(json.dumps(evidence), encoding="utf-8")
            result = self.run_script("verify-replay-evidence.py", "--evidence", path)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("unknown receipt", result.stderr)


if __name__ == "__main__":
    unittest.main()

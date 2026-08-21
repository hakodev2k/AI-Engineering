#!/usr/bin/env python3
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "compaction_integrity_gate.py"
POLICY = ROOT / "config" / "integrity-policy.json"

BASE = {
    "task_id": "task-1",
    "active_goal": "Fix checkout race and verify tests",
    "language": "en",
    "constraints": ["no-production-write", "keep-api-compatible"],
    "completed_items": ["reproduce"],
    "pending_items": ["patch", "tests"],
    "approval_state": "not-required",
    "verification_requirements": ["unit-tests", "regression-test"]
}


def run_case(after):
    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        before_path, after_path = td / "before.json", td / "after.json"
        before_path.write_text(json.dumps(BASE), encoding="utf-8")
        after_path.write_text(json.dumps(after), encoding="utf-8")
        return subprocess.run(
            ["python", str(SCRIPT), "--before", str(before_path), "--after", str(after_path), "--policy", str(POLICY)],
            capture_output=True, text=True, check=False
        )


class IntegrityGateTests(unittest.TestCase):
    def test_unchanged_state_passes(self):
        result = run_case(dict(BASE))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(json.loads(result.stdout)["decision"], "allow")

    def test_fabricated_completion_blocks(self):
        after = dict(BASE)
        after["completed_items"] = ["reproduce", "patch"]
        after["pending_items"] = ["tests"]
        result = run_case(after)
        self.assertEqual(result.returncode, 3)
        types = {x["type"] for x in json.loads(result.stdout)["findings"]}
        self.assertIn("unsupported_new_completed", types)

    def test_completed_regression_blocks(self):
        after = dict(BASE)
        after["completed_items"] = []
        after["pending_items"] = ["reproduce", "patch", "tests"]
        result = run_case(after)
        self.assertEqual(result.returncode, 3)
        types = {x["type"] for x in json.loads(result.stdout)["findings"]}
        self.assertIn("completed_regressed_to_pending", types)

    def test_approval_change_requires_event(self):
        after = dict(BASE)
        after["approval_state"] = "approved"
        result = run_case(after)
        self.assertEqual(result.returncode, 3)
        types = {x["type"] for x in json.loads(result.stdout)["findings"]}
        self.assertIn("approval_changed_without_event", types)

    def test_goal_change_blocks(self):
        after = dict(BASE)
        after["active_goal"] = "Deploy to production"
        result = run_case(after)
        self.assertEqual(result.returncode, 3)


if __name__ == "__main__":
    unittest.main()

#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "join_guard.py"
POLICY = ROOT / "config" / "policy.json"


def run_guard(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(SCRIPT), *args],
        text=True,
        capture_output=True,
        check=False,
    )


class JoinGuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.base = Path(self.tmp.name)
        (self.base / "verifications").mkdir()

    def tearDown(self):
        self.tmp.cleanup()

    def write_ledger(self, tasks):
        path = self.base / "ledger.json"
        path.write_text(json.dumps({"version": 1, "tasks": tasks}), encoding="utf-8")
        return path

    def write_verification(self, task_id, verdict="pass", verifier="verifier", checks=None):
        path = self.base / "verifications" / f"{task_id}.json"
        path.write_text(json.dumps({
            "task_id": task_id,
            "verdict": verdict,
            "verifier_id": verifier,
            "checks": checks or ["artifact-exists", "requirements-covered"]
        }), encoding="utf-8")
        return f"verifications/{task_id}.json"

    def parent(self):
        return {
            "task_id": "parent", "parent_id": None, "required": False,
            "expected_outputs": [], "state": "running", "attempts": []
        }

    def child(self, state="running", required=True, verification=None, owner="impl"):
        task = {
            "task_id": "child", "parent_id": "parent", "required": required,
            "expected_outputs": ["review.md"], "state": state, "attempts": [],
            "owner": owner
        }
        if state in {"succeeded", "failed", "cancelled", "timed_out", "resource_exhausted", "orphaned"}:
            task["terminal_reason"] = state
        if state == "succeeded":
            task["handoff"] = "handoffs/child.json"
            task["verification"] = verification or self.write_verification("child")
        return task

    def test_running_required_child_blocks_parent(self):
        ledger = self.write_ledger([self.parent(), self.child("running")])
        result = run_guard("check", "--ledger", str(ledger), "--parent-id", "parent")
        self.assertEqual(result.returncode, 4)
        self.assertIn("BLOCKED", result.stdout)

    def test_failed_required_child_blocks_parent(self):
        ledger = self.write_ledger([self.parent(), self.child("failed")])
        result = run_guard("check", "--ledger", str(ledger), "--parent-id", "parent")
        self.assertEqual(result.returncode, 4)
        self.assertIn("terminal state failed", result.stdout)

    def test_resource_exhausted_required_child_blocks_parent(self):
        ledger = self.write_ledger([self.parent(), self.child("resource_exhausted")])
        result = run_guard("check", "--ledger", str(ledger), "--parent-id", "parent")
        self.assertEqual(result.returncode, 4)

    def test_succeeded_but_unverified_child_blocks_parent(self):
        task = self.child("succeeded")
        task["verification"] = "verifications/missing.json"
        ledger = self.write_ledger([self.parent(), task])
        result = run_guard("check", "--ledger", str(ledger), "--parent-id", "parent")
        self.assertEqual(result.returncode, 4)
        self.assertIn("cannot read verification", result.stdout)

    def test_self_verification_is_rejected(self):
        verification = self.write_verification("child", verifier="impl")
        ledger = self.write_ledger([self.parent(), self.child("succeeded", verification=verification, owner="impl")])
        result = run_guard("check", "--ledger", str(ledger), "--parent-id", "parent")
        self.assertEqual(result.returncode, 4)
        self.assertIn("verifier must differ", result.stdout)

    def test_verified_required_child_passes(self):
        verification = self.write_verification("child", verifier="independent")
        ledger = self.write_ledger([self.parent(), self.child("succeeded", verification=verification, owner="impl")])
        result = run_guard("check", "--ledger", str(ledger), "--parent-id", "parent")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("PASS", result.stdout)

    def test_optional_failed_child_does_not_block(self):
        ledger = self.write_ledger([self.parent(), self.child("failed", required=False)])
        result = run_guard("check", "--ledger", str(ledger), "--parent-id", "parent")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_nested_required_grandchild_is_in_descendant_closure(self):
        v1 = self.write_verification("child", verifier="v1")
        child = self.child("succeeded", verification=v1)
        grandchild = {
            "task_id": "grandchild", "parent_id": "child", "required": True,
            "expected_outputs": ["test-report"], "state": "running", "attempts": []
        }
        ledger = self.write_ledger([self.parent(), child, grandchild])
        result = run_guard("check", "--ledger", str(ledger), "--parent-id", "parent")
        self.assertEqual(result.returncode, 4)
        self.assertIn("grandchild", result.stdout)

    def test_missing_parent_is_structural_error(self):
        child = self.child("running")
        child["parent_id"] = "missing"
        ledger = self.write_ledger([child])
        result = run_guard("validate-ledger", "--ledger", str(ledger))
        self.assertEqual(result.returncode, 2)
        self.assertIn("parent_id", result.stdout)

    def test_parent_cycle_is_rejected(self):
        a = {"task_id": "a", "parent_id": "b", "required": False, "expected_outputs": [], "state": "running", "attempts": []}
        b = {"task_id": "b", "parent_id": "a", "required": False, "expected_outputs": [], "state": "running", "attempts": []}
        ledger = self.write_ledger([a, b])
        result = run_guard("validate-ledger", "--ledger", str(ledger))
        self.assertEqual(result.returncode, 2)
        self.assertIn("cycle", result.stdout)


if __name__ == "__main__":
    unittest.main()

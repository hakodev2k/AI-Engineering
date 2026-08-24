#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "validate_terminal_state.py"


def run_case(state, files=None):
    with tempfile.TemporaryDirectory() as td:
        base = Path(td)
        for rel, content in (files or {}).items():
            p = base / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(content, encoding="utf-8")
        state_path = base / "state.json"
        state_path.write_text(json.dumps(state), encoding="utf-8")
        proc = subprocess.run(
            [sys.executable, str(SCRIPT), "--state", str(state_path)],
            text=True,
            capture_output=True,
            check=False,
        )
        payload = json.loads(proc.stdout)
        return proc.returncode, payload


class ValidatorTests(unittest.TestCase):
    def test_accepts_complete_child(self):
        state = {
            "status": "completed",
            "terminal_reason": "end_turn",
            "result": "verified findings complete",
            "required_result_min_chars": 10,
            "required_result_contains": ["verified"],
            "tool_calls": [{"id": "t1", "requires_result": True}],
            "tool_results": [{"tool_call_id": "t1"}],
            "required_artifacts": [{"path": "report.txt", "min_bytes": 8, "contains": ["PASS"]}],
        }
        code, payload = run_case(state, {"report.txt": "PASS verified report"})
        self.assertEqual(code, 0)
        self.assertEqual(payload["decision"], "accepted")

    def test_rejects_tool_deferred_even_if_status_success(self):
        state = {
            "status": "completed",
            "terminal_reason": "tool_deferred",
            "result": "starting command",
            "tool_calls": [{"id": "bash1", "requires_result": True}],
            "tool_results": [],
        }
        code, payload = run_case(state)
        self.assertNotEqual(code, 0)
        self.assertEqual(payload["decision"], "failed")
        self.assertTrue(any("unmatched tool call" in r for r in payload["reasons"]))

    def test_rejects_missing_required_artifact(self):
        state = {
            "status": "completed",
            "terminal_reason": "end_turn",
            "result": "complete report",
            "required_artifacts": [{"path": "missing.md", "min_bytes": 1}],
        }
        code, payload = run_case(state)
        self.assertEqual(code, 1)
        self.assertEqual(payload["decision"], "incomplete")

    def test_rejects_midtask_fragment(self):
        state = {
            "status": "completed",
            "terminal_reason": "end_turn",
            "result": "Let me check",
            "required_result_min_chars": 30,
        }
        code, payload = run_case(state)
        self.assertEqual(code, 1)
        self.assertEqual(payload["decision"], "incomplete")

    def test_rejects_unknown_terminal_reason(self):
        state = {"status": "completed", "terminal_reason": "mystery_stop", "result": "done"}
        code, payload = run_case(state)
        self.assertEqual(code, 1)
        self.assertEqual(payload["decision"], "incomplete")


if __name__ == "__main__":
    unittest.main()

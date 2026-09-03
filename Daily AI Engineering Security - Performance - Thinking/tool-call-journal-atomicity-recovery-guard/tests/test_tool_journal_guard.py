import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "tool_journal_guard.py"


class ToolJournalGuardTests(unittest.TestCase):
    def run_case(self, rows, mode="check"):
        with tempfile.TemporaryDirectory() as td:
            journal = Path(td) / "journal.jsonl"
            journal.write_text("\n".join(json.dumps(x) for x in rows) + "\n", encoding="utf-8")
            return subprocess.run(
                [sys.executable, str(SCRIPT), "--journal", str(journal), "--mode", mode],
                capture_output=True,
                text=True,
                check=False,
            )

    def test_complete_pair_passes(self):
        rows = [
            {"type": "custom_tool_call", "call_id": "c1", "name": "exec"},
            {"type": "custom_tool_call_output", "call_id": "c1", "status": "completed"},
        ]
        result = self.run_case(rows)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)["status"], "pass")

    def test_orphan_call_blocks(self):
        rows = [{"type": "custom_tool_call", "call_id": "c2", "name": "send_email"}]
        result = self.run_case(rows)
        self.assertEqual(result.returncode, 1)
        report = json.loads(result.stdout)
        self.assertEqual(report["status"], "fail")
        self.assertEqual(report["orphan_calls"][0]["call_id"], "c2")

    def test_recovery_plan_never_claims_success(self):
        rows = [{"type": "function_call", "call_id": "c3", "name": "deploy"}]
        result = self.run_case(rows, mode="recovery-plan")
        self.assertEqual(result.returncode, 1)
        payload = json.loads(result.stdout)
        action = payload["recovery_plan"]["actions"][0]
        self.assertEqual(action["classification"], "indeterminate")
        self.assertNotIn("success", action["action"])

    def test_duplicate_output_blocks(self):
        rows = [
            {"type": "tool_call", "call_id": "c4", "name": "read"},
            {"type": "tool_call_output", "call_id": "c4", "status": "completed"},
            {"type": "tool_call_output", "call_id": "c4", "status": "completed"},
        ]
        result = self.run_case(rows)
        self.assertEqual(result.returncode, 1)
        self.assertEqual(json.loads(result.stdout)["duplicate_outputs"], ["c4"])


if __name__ == "__main__":
    unittest.main()

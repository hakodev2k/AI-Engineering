import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "structured_output_guard.py"
POLICY = Path(__file__).parents[1] / "config" / "retry-policy.json"


class GuardTests(unittest.TestCase):
    def run_case(self, events):
        with tempfile.TemporaryDirectory() as d:
            path = Path(d) / "events.json"
            path.write_text(json.dumps(events), encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(SCRIPT), "--events", str(path), "--policy", str(POLICY)],
                capture_output=True,
                text=True,
            )
            output = json.loads(result.stdout) if result.stdout else None
            return result, output

    def test_single_invalid_allows_repair(self):
        result, output = self.run_case([{"payload": "{bad", "valid": False, "error": "parse"}])
        self.assertEqual(result.returncode, 0)
        self.assertEqual(output["status"], "repair_allowed")

    def test_second_identical_invalid_stops(self):
        events = [
            {"payload": "{bad", "valid": False, "error": "parse"},
            {"payload": "{bad", "valid": False, "error": "parse", "repair": True},
        ]
        result, output = self.run_case(events)
        self.assertEqual(result.returncode, 2)
        self.assertIn("identical_invalid_limit", output["reasons"])

    def test_repair_budget_stops(self):
        events = [
            {"payload": {"x": 1}, "valid": False, "error": "missing a"},
            {"payload": {"x": 2}, "valid": False, "error": "missing b", "repair": True},
            {"payload": {"x": 3}, "valid": False, "error": "missing c", "repair": True},
        ]
        result, output = self.run_case(events)
        self.assertEqual(result.returncode, 2)
        self.assertIn("repair_attempt_limit", output["reasons"])

    def test_valid_latest_passes(self):
        events = [
            {"payload": "bad", "valid": False, "error": "parse"},
            {"payload": {"status": "ok"}, "valid": True, "repair": True},
        ]
        result, output = self.run_case(events)
        self.assertEqual(result.returncode, 0)
        self.assertEqual(output["status"], "pass")

    def test_deadline_stops(self):
        events = [{"payload": {"x": 1}, "valid": False, "error": "schema", "elapsed_seconds": 120}]
        result, output = self.run_case(events)
        self.assertEqual(result.returncode, 2)
        self.assertIn("terminal_deadline", output["reasons"])


if __name__ == "__main__":
    unittest.main()

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "tool_burst_guard.py"
POLICY = {"max_calls": 4, "max_prompt_tokens": 1000, "max_elapsed_ms": 10000, "max_same_target_calls": 3}

class BurstTests(unittest.TestCase):
    def run_case(self, events):
        with tempfile.TemporaryDirectory() as td:
            d = Path(td); p = d / "policy.json"; e = d / "events.jsonl"
            p.write_text(json.dumps(POLICY), encoding="utf-8")
            e.write_text("\n".join(json.dumps(x) for x in events), encoding="utf-8")
            return subprocess.run([sys.executable, str(SCRIPT), str(e), "--policy", str(p), "--strict"], capture_output=True, text=True)

    def test_heterogeneous_call_burst_checkpoints(self):
        events = [
            {"step":1,"tool":"read","target":"repo","prompt_tokens":100,"elapsed_ms":100},
            {"step":2,"tool":"exec","target":"shell","prompt_tokens":100,"elapsed_ms":100},
            {"step":3,"tool":"history","target":"session","prompt_tokens":100,"elapsed_ms":100},
            {"step":4,"tool":"spawn","target":"agent","prompt_tokens":100,"elapsed_ms":100}
        ]
        r = self.run_case(events)
        self.assertEqual(r.returncode, 3, r.stdout + r.stderr)
        self.assertIn("call_budget", r.stdout)

    def test_token_budget_can_trigger_before_call_budget(self):
        r = self.run_case([{"step":1,"tool":"read","target":"a","prompt_tokens":600,"elapsed_ms":1},{"step":2,"tool":"exec","target":"b","prompt_tokens":500,"elapsed_ms":1}])
        self.assertEqual(r.returncode, 3)
        self.assertIn("prompt_token_budget", r.stdout)

    def test_checkpoint_resets_burst(self):
        events = [
            {"step":1,"tool":"read","target":"a","prompt_tokens":400,"elapsed_ms":10},
            {"step":2,"tool":"checkpoint","checkpoint":True},
            {"step":3,"tool":"read","target":"b","prompt_tokens":100,"elapsed_ms":10}
        ]
        r = self.run_case(events)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)

    def test_target_locality_checkpoints(self):
        events = [{"step":i,"tool":"read","target":"src/auth","prompt_tokens":10,"elapsed_ms":1} for i in range(1,4)]
        r = self.run_case(events)
        self.assertEqual(r.returncode, 3)
        self.assertIn("target_locality_budget", r.stdout)

if __name__ == "__main__": unittest.main()

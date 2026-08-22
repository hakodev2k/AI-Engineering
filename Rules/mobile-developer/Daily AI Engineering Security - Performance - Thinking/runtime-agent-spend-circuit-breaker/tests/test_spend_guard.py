#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "spend_guard.py"
CONFIG = ROOT / "config" / "budget.json"


class SpendGuardTests(unittest.TestCase):
    def run_guard(self, state: Path, *args: str):
        return subprocess.run([sys.executable, str(SCRIPT), *args, "--config", str(CONFIG), "--state", str(state)], capture_output=True, text=True)

    def test_reserve_and_reconcile(self):
        with tempfile.TemporaryDirectory() as td:
            state = Path(td) / "state.json"
            r = self.run_guard(state, "reserve", "--task", "t1", "--agent", "a1", "--source", "parent", "--model", "example-model", "--input-tokens", "10000", "--max-output-tokens", "1000")
            self.assertIn(r.returncode, (0, 3), r.stderr)
            data = json.loads(r.stdout)
            self.assertIn("reservation_id", data)
            rid = data["reservation_id"]
            r2 = self.run_guard(state, "reconcile", "--reservation-id", rid, "--actual-input-tokens", "9000", "--actual-cached-input-tokens", "1000", "--actual-output-tokens", "500")
            self.assertEqual(r2.returncode, 0, r2.stderr)
            persisted = json.loads(state.read_text())
            self.assertEqual(persisted["reservations"], {})
            self.assertGreater(persisted["actual_usd"], 0)

    def test_unknown_model_blocks_as_invalid_configuration(self):
        with tempfile.TemporaryDirectory() as td:
            state = Path(td) / "state.json"
            r = self.run_guard(state, "reserve", "--task", "t1", "--agent", "a1", "--source", "parent", "--model", "missing", "--input-tokens", "10", "--max-output-tokens", "10")
            self.assertEqual(r.returncode, 2)
            self.assertIn("unknown model pricing", r.stderr)

    def test_hard_limit_blocks_without_reservation(self):
        with tempfile.TemporaryDirectory() as td:
            state = Path(td) / "state.json"
            cfg = Path(td) / "config.json"
            c = json.loads(CONFIG.read_text())
            c["task_hard_limit_usd"] = 0.000001
            c["task_wrap_up_threshold_usd"] = 0.0000005
            cfg.write_text(json.dumps(c))
            r = subprocess.run([sys.executable, str(SCRIPT), "reserve", "--config", str(cfg), "--state", str(state), "--task", "t1", "--agent", "a1", "--source", "retry", "--model", "example-model", "--input-tokens", "1000", "--max-output-tokens", "1000"], capture_output=True, text=True)
            self.assertEqual(r.returncode, 4)
            d = json.loads(r.stdout)
            self.assertEqual(d["decision"], "block")
            persisted = json.loads(state.read_text())
            self.assertEqual(persisted.get("reservations", {}), {})


if __name__ == "__main__":
    unittest.main()

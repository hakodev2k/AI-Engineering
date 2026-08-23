#!/usr/bin/env python3
import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "profile_latency.py"
spec = importlib.util.spec_from_file_location("profile_latency", SCRIPT)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

class ProfileLatencyTests(unittest.TestCase):
    def test_separates_approval_and_tool(self):
        rows = [
            {"run_id":"r1","phase":"approval_wait","start_ms":0,"end_ms":60000,"name":"approve"},
            {"run_id":"r1","phase":"tool","start_ms":60000,"end_ms":61000,"name":"query"},
        ]
        out = mod.profile(rows)["runs"]["r1"]
        self.assertEqual(out["phases"]["approval_wait"]["duration_ms"], 60000)
        self.assertEqual(out["phases"]["tool"]["duration_ms"], 1000)
        self.assertEqual(out["unattributed_gap_ms"], 0)

    def test_gap_is_visible(self):
        rows = [
            {"run_id":"r1","phase":"model","start_ms":0,"end_ms":100},
            {"run_id":"r1","phase":"tool","start_ms":150,"end_ms":200},
        ]
        out = mod.profile(rows)["runs"]["r1"]
        self.assertEqual(out["unattributed_gap_ms"], 50)
        self.assertEqual(out["wall_ms"], 200)

    def test_overlap_fails(self):
        rows = [
            {"run_id":"r1","phase":"model","start_ms":0,"end_ms":100},
            {"run_id":"r1","phase":"tool","start_ms":90,"end_ms":200},
        ]
        with self.assertRaises(ValueError):
            mod.profile(rows)

    def test_multiple_runs_separate(self):
        rows = [
            {"run_id":"a","phase":"tool","start_ms":0,"end_ms":10},
            {"run_id":"b","phase":"tool","start_ms":0,"end_ms":20},
        ]
        out = mod.profile(rows)["runs"]
        self.assertEqual(out["a"]["wall_ms"], 10)
        self.assertEqual(out["b"]["wall_ms"], 20)

if __name__ == "__main__":
    unittest.main()

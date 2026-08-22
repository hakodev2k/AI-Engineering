#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "cancellation_guard.py"
POLICY = ROOT / "config" / "cancellation-policy.json"


class GuardTests(unittest.TestCase):
    def run_case(self, payload):
        with tempfile.TemporaryDirectory() as td:
            inp = Path(td) / "input.json"
            inp.write_text(json.dumps(payload))
            return subprocess.run([sys.executable, str(SCRIPT), str(inp), "--policy", str(POLICY)], capture_output=True, text=True)

    def test_idle_timeout_requests_cancel(self):
        r = self.run_case({"request_id":"r1","state":"pending","side_effecting":False,"started_at":100,"last_progress_at":100,"now":170,"terminal_seen":False})
        self.assertEqual(r.returncode, 3, r.stderr)
        self.assertEqual(json.loads(r.stdout)["decision"], "request_cancel")

    def test_terminal_is_healthy(self):
        r = self.run_case({"request_id":"r2","state":"completed","side_effecting":True,"started_at":100,"last_progress_at":120,"now":121,"terminal_seen":True})
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(json.loads(r.stdout)["decision"], "terminal")

    def test_side_effecting_cancel_without_terminal_quarantines(self):
        r = self.run_case({"request_id":"r3","state":"cancel_requested","side_effecting":True,"started_at":100,"last_progress_at":120,"now":140,"cancel_requested_at":125,"cancel_reason":"user_cancel","terminal_seen":False})
        self.assertEqual(r.returncode, 4, r.stderr)
        self.assertEqual(json.loads(r.stdout)["decision"], "quarantine")

    def test_read_only_unknown_reconciles(self):
        r = self.run_case({"request_id":"r4","state":"unknown","side_effecting":False,"started_at":100,"last_progress_at":110,"now":120,"terminal_seen":False})
        self.assertEqual(r.returncode, 3, r.stderr)
        self.assertEqual(json.loads(r.stdout)["decision"], "reconcile")


if __name__ == "__main__":
    unittest.main()

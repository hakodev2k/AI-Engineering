#!/usr/bin/env python3
import json, subprocess, sys, unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "hook_watchdog.py"

class WatchdogTests(unittest.TestCase):
    def run_guard(self, timeout, code):
        cp = subprocess.run([sys.executable, str(SCRIPT), "--timeout", str(timeout), "--hook-id", "t", sys.executable, "-c", code], capture_output=True, text=True, timeout=5)
        payload = json.loads(cp.stdout.strip().splitlines()[-1])
        return cp, payload

    def test_success(self):
        cp, p = self.run_guard(1, "print('ok')")
        self.assertEqual(cp.returncode, 0)
        self.assertEqual(p["status"], "success")
        self.assertIn("ok", p["stdout"])

    def test_failure(self):
        cp, p = self.run_guard(1, "raise SystemExit(7)")
        self.assertEqual(cp.returncode, 1)
        self.assertEqual(p["status"], "failure")
        self.assertEqual(p["exit_code"], 7)

    def test_timeout(self):
        cp, p = self.run_guard(0.2, "import time; time.sleep(5)")
        self.assertEqual(cp.returncode, 124)
        self.assertEqual(p["status"], "timeout")
        self.assertLess(p["elapsed_s"], 2.0)

if __name__ == "__main__":
    unittest.main()
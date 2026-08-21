import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "stall_watchdog.py"


class WatchdogTests(unittest.TestCase):
    def run_watchdog(self, record, global_t, silence_t, code):
        return subprocess.run([
            sys.executable, str(SCRIPT),
            "--global-timeout", str(global_t),
            "--silence-timeout", str(silence_t),
            "--grace", "0.2", "--record", str(record), "--",
            sys.executable, "-c", code
        ], capture_output=True, timeout=max(5, global_t + 3))

    def test_normal_completion(self):
        with tempfile.TemporaryDirectory() as td:
            record = Path(td) / "run.json"
            p = self.run_watchdog(record, 3, 1, "print('ok', flush=True)")
            self.assertEqual(p.returncode, 0)
            data = json.loads(record.read_text())
            self.assertEqual(data["status"], "completed")

    def test_silence_timeout(self):
        with tempfile.TemporaryDirectory() as td:
            record = Path(td) / "run.json"
            p = self.run_watchdog(record, 3, 0.4, "import time; print('start', flush=True); time.sleep(2)")
            self.assertEqual(p.returncode, 125)
            data = json.loads(record.read_text())
            self.assertEqual(data["status"], "silence-timeout")
            self.assertLess(data["elapsed_seconds"], 2.0)

    def test_invalid_configuration(self):
        with tempfile.TemporaryDirectory() as td:
            record = Path(td) / "run.json"
            p = subprocess.run([sys.executable, str(SCRIPT), "--global-timeout", "1", "--silence-timeout", "2",
                                "--record", str(record), "--", sys.executable, "-c", "print('x')"], capture_output=True)
            self.assertEqual(p.returncode, 126)


if __name__ == "__main__": unittest.main()

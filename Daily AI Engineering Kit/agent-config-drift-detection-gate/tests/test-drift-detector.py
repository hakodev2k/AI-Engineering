#!/usr/bin/env python3
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DETECTOR = ROOT / "scripts" / "detect-config-drift.py"
VERIFIER = ROOT / "scripts" / "verify-drift-report.py"
POLICY = ROOT / "config" / "drift-policy.json"


class DriftDetectorTests(unittest.TestCase):
    def run_detector(self, expected, actual):
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)
            e, a, out = tmp / "e.json", tmp / "a.json", tmp / "report.json"
            e.write_text(json.dumps(expected), encoding="utf-8")
            a.write_text(json.dumps(actual), encoding="utf-8")
            proc = subprocess.run([sys.executable, str(DETECTOR), "--expected", str(e), "--actual", str(a),
                                   "--policy", str(POLICY), "--output", str(out)], capture_output=True, text=True)
            report = json.loads(out.read_text(encoding="utf-8")) if out.exists() else None
            verify = subprocess.run([sys.executable, str(VERIFIER), str(out)], capture_output=True, text=True) if out.exists() else None
            return proc, report, verify

    def test_clean(self):
        proc, report, verify = self.run_detector({"a": 1}, {"a": 1})
        self.assertEqual(proc.returncode, 0)
        self.assertEqual(report["status"], "clean")
        self.assertEqual(verify.returncode, 0)

    def test_drift_and_secret_redaction(self):
        proc, report, verify = self.run_detector({"apiToken": "one", "level": "Info"}, {"apiToken": "two", "level": "Debug"})
        self.assertEqual(proc.returncode, 2)
        by_path = {x["path"]: x for x in report["differences"]}
        self.assertEqual(by_path["apiToken"]["expected"], "<redacted>")
        self.assertEqual(by_path["apiToken"]["actual"], "<redacted>")
        self.assertEqual(by_path["level"]["actual"], "Debug")
        self.assertEqual(verify.returncode, 0)

    def test_missing_and_unexpected(self):
        proc, report, _ = self.run_detector({"a": 1}, {"b": 2})
        self.assertEqual(proc.returncode, 2)
        self.assertEqual({x["kind"] for x in report["differences"]}, {"missing", "unexpected"})


if __name__ == "__main__":
    unittest.main()

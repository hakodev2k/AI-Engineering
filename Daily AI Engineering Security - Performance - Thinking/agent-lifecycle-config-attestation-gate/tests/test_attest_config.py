#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "attest_config.py"

class AttestConfigTests(unittest.TestCase):
    def run_case(self, declared, observed, paths):
        with tempfile.TemporaryDirectory() as td:
            d = Path(td) / "d.json"; o = Path(td) / "o.json"
            d.write_text(json.dumps(declared), encoding="utf-8")
            o.write_text(json.dumps(observed), encoding="utf-8")
            cmd = [sys.executable, str(SCRIPT), str(d), str(o)]
            for path in paths:
                cmd += ["--protected", path]
            cp = subprocess.run(cmd, text=True, capture_output=True)
            payload = json.loads(cp.stdout) if cp.stdout else json.loads(cp.stderr)
            return cp.returncode, payload

    def test_exact_match_passes(self):
        cfg = {"sandbox": {"enabled": True}, "permissions": {"deny": ["deploy"]}}
        code, out = self.run_case(cfg, cfg, ["sandbox.enabled", "permissions.deny"])
        self.assertEqual(code, 0); self.assertEqual(out["status"], "pass")

    def test_missing_protected_path_blocks(self):
        code, out = self.run_case({"sandbox": {"enabled": True}}, {}, ["sandbox.enabled"])
        self.assertEqual(code, 2); self.assertEqual(out["mismatches"][0]["reason"], "missing")

    def test_changed_value_blocks(self):
        code, out = self.run_case({"sandbox": {"enabled": True}}, {"sandbox": {"enabled": False}}, ["sandbox.enabled"])
        self.assertEqual(code, 2); self.assertEqual(out["mismatches"][0]["reason"], "different")

    def test_unprotected_change_does_not_block(self):
        d = {"sandbox": {"enabled": True}, "ui": {"theme": "dark"}}
        o = {"sandbox": {"enabled": True}, "ui": {"theme": "light"}}
        code, out = self.run_case(d, o, ["sandbox.enabled"])
        self.assertEqual(code, 0)

if __name__ == "__main__":
    unittest.main()

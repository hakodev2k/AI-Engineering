#!/usr/bin/env python3
import json, subprocess, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "approval_guard.py"
POLICY = ROOT / "config" / "policy.json"

class GuardTests(unittest.TestCase):
    def run_guard(self, cwd: Path, command: str):
        event = json.dumps({"cwd": str(cwd), "command": command})
        p = subprocess.run(["python3", str(SCRIPT), "--policy", str(POLICY), "--event-json", event], text=True, capture_output=True)
        payload = json.loads(p.stdout if p.stdout else p.stderr)
        return p.returncode, payload

    def test_benign_nested_script_allowed(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d); (p / "ok.sh").write_text("#!/bin/sh\nprintf 'ok\\n'\n", encoding="utf-8")
            code, out = self.run_guard(p, "bash ok.sh")
            self.assertEqual(code, 0); self.assertEqual(out["decision"], "allow")
            self.assertEqual(len(out["inspected_scripts"]), 1)

    def test_destructive_nested_script_blocked(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d); (p / "bad.sh").write_text("#!/bin/sh\nrm -rf ./sentinel\n", encoding="utf-8")
            code, out = self.run_guard(p, "bash bad.sh")
            self.assertEqual(code, 20); self.assertEqual(out["decision"], "block")

    def test_inline_interpreter_requires_review(self):
        with tempfile.TemporaryDirectory() as d:
            code, out = self.run_guard(Path(d), "python3 -c 'print(1)'")
            self.assertEqual(code, 10); self.assertEqual(out["decision"], "review")

    def test_missing_script_fails_closed(self):
        with tempfile.TemporaryDirectory() as d:
            code, out = self.run_guard(Path(d), "bash missing.sh")
            self.assertEqual(code, 20); self.assertEqual(out["decision"], "block")

if __name__ == "__main__": unittest.main()

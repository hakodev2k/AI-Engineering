#!/usr/bin/env python3
import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/"scripts"/"checkpoint_guard.py"

class GuardTests(unittest.TestCase):
    def run(self,*args):
        cp=subprocess.run([sys.executable,str(SCRIPT),*args],capture_output=True,text=True,timeout=5)
        return cp,json.loads(cp.stdout)

    def test_missing_blocks_checkpoint(self):
        with tempfile.TemporaryDirectory() as d:
            cp,p=self.run("checkpoint","--root",d,"--scan-id","s","--revision","r","--phase","discovery","--required","candidate.json")
            self.assertEqual(cp.returncode,2); self.assertEqual(p["status"],"blocked")

    def test_valid_checkpoint_hashes(self):
        with tempfile.TemporaryDirectory() as d:
            Path(d,"candidate.json").write_text("{}")
            cp,p=self.run("checkpoint","--root",d,"--scan-id","s","--revision","r","--phase","discovery","--required","candidate.json")
            self.assertEqual(cp.returncode,0); self.assertEqual(len(p["artifacts"]["candidate.json"]["sha256"]),64)

    def test_full_retry_requires_approval(self):
        cp,p=self.run("retry","--scope","full","--terminal-failure","--quota-remaining","80")
        self.assertEqual(cp.returncode,3); self.assertEqual(p["status"],"blocked")

    def test_low_quota_blocks_even_approved(self):
        cp,p=self.run("retry","--scope","full","--terminal-failure","--approved","--quota-remaining","5","--min-quota","10")
        self.assertEqual(cp.returncode,3); self.assertIn("remaining quota below policy threshold",p["reasons"])

    def test_repeated_failure_blocks(self):
        cp,p=self.run("retry","--scope","worker","--quota-remaining","80","--same-failure-count","2")
        self.assertEqual(cp.returncode,3)

if __name__=="__main__": unittest.main()
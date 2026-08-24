from __future__ import annotations
import importlib.util
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("scanner", ROOT / "scripts/scan_submodules.py")
assert SPEC and SPEC.loader
SCANNER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(SCANNER)
POLICY = SCANNER.load_policy(ROOT / "config/policy.json")

class Tests(unittest.TestCase):
    def make_repo(self):
        td = tempfile.TemporaryDirectory()
        repo = Path(td.name)
        subprocess.run(["git", "init"], cwd=repo, check=True, capture_output=True)
        subprocess.run(["git", "config", "user.email", "test@example.invalid"], cwd=repo, check=True)
        subprocess.run(["git", "config", "user.name", "Test"], cwd=repo, check=True)
        (repo / "README.md").write_text("x\n", encoding="utf-8")
        subprocess.run(["git", "add", "README.md"], cwd=repo, check=True)
        subprocess.run(["git", "commit", "-m", "init"], cwd=repo, check=True, capture_output=True)
        return td, repo

    def test_no_submodules_passes(self):
        td, repo = self.make_repo()
        try:
            report = SCANNER.scan(repo, "HEAD", POLICY)
            self.assertEqual("pass", report["status"])
            self.assertEqual(0, report["summary"]["submodules_seen"])
        finally:
            td.cleanup()

    def test_invalid_policy_action_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "p.json"
            bad = dict(POLICY)
            bad["gitlink_change"] = "maybe"
            p.write_text(json.dumps(bad), encoding="utf-8")
            with self.assertRaises(ValueError):
                SCANNER.load_policy(p)

if __name__ == "__main__":
    unittest.main()

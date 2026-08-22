import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GUARD = ROOT / "scripts" / "path_integrity_guard.py"
SCANNER = ROOT / "scripts" / "scan_path_aliases.py"


class PathIntegrityGuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.base = Path(self.tmp.name)
        self.workspace = self.base / "workspace"
        self.outside = self.base / "outside"
        self.protected = self.base / "protected"
        self.workspace.mkdir()
        self.outside.mkdir()
        self.protected.mkdir()
        self.policy = self.base / "policy.json"
        self.policy.write_text(json.dumps({
            "version": 1,
            "workspace_roots": [str(self.workspace)],
            "protected_roots": [str(self.protected)],
            "allow_symlinks_within_same_writable_root": True,
            "allow_explicit_symlink_roots": [],
            "reject_broken_symlinks_for_write": True,
            "reject_symlink_to_protected_root": True,
            "reject_parent_identity_drift": True,
            "reject_target_identity_drift": True,
            "max_symlink_depth": 16
        }), encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def run_guard(self, *args):
        return subprocess.run([sys.executable, str(GUARD), *map(str, args)], text=True, capture_output=True)

    def test_allows_normal_in_root_new_file(self):
        target = self.workspace / "a.txt"
        rec = self.base / "rec.json"
        p = self.run_guard("preflight", "--path", target, "--operation", "write", "--policy", self.policy, "--record", rec)
        self.assertEqual(0, p.returncode, p.stderr)
        self.assertEqual("allow", json.loads(p.stdout)["decision"])

    def test_allows_safe_in_root_symlink(self):
        real = self.workspace / "real"
        real.mkdir()
        alias = self.workspace / "alias"
        alias.symlink_to(real, target_is_directory=True)
        target = alias / "x.txt"
        p = self.run_guard("preflight", "--path", target, "--operation", "write", "--policy", self.policy)
        self.assertEqual(0, p.returncode, p.stdout + p.stderr)

    def test_blocks_relative_symlink_escape(self):
        alias = self.workspace / "escape"
        alias.symlink_to(Path("..") / "outside", target_is_directory=True)
        target = alias / "owned.txt"
        p = self.run_guard("preflight", "--path", target, "--operation", "write", "--policy", self.policy)
        self.assertEqual(3, p.returncode)
        self.assertIn("outside all writable", p.stdout)

    def test_blocks_absolute_symlink_escape(self):
        alias = self.workspace / "escape2"
        alias.symlink_to(self.outside, target_is_directory=True)
        p = self.run_guard("preflight", "--path", alias / "x", "--operation", "write", "--policy", self.policy)
        self.assertEqual(3, p.returncode)

    def test_blocks_protected_root_via_symlink(self):
        alias = self.workspace / "runtime"
        alias.symlink_to(self.protected, target_is_directory=True)
        p = self.run_guard("preflight", "--path", alias / "wrapper", "--operation", "write", "--policy", self.policy)
        self.assertEqual(3, p.returncode)
        self.assertIn("protected root", p.stdout)

    def test_blocks_broken_symlink_write(self):
        broken = self.workspace / "broken"
        broken.symlink_to(self.workspace / "missing")
        p = self.run_guard("preflight", "--path", broken, "--operation", "write", "--policy", self.policy)
        self.assertEqual(3, p.returncode)
        self.assertIn("broken symlink", p.stdout)

    def test_commit_check_detects_parent_swap(self):
        parent = self.workspace / "safe"
        parent.mkdir()
        target = parent / "x.txt"
        rec = self.base / "record.json"
        p = self.run_guard("preflight", "--path", target, "--operation", "write", "--policy", self.policy, "--record", rec)
        self.assertEqual(0, p.returncode, p.stderr)
        parent.rmdir()
        parent.symlink_to(self.outside, target_is_directory=True)
        c = self.run_guard("commit-check", "--record", rec, "--policy", self.policy)
        self.assertEqual(3, c.returncode)
        self.assertTrue("identity changed" in c.stdout or "canonical" in c.stdout or "outside all writable" in c.stdout)
        self.assertFalse((self.outside / "x.txt").exists())

    def test_scanner_flags_escape(self):
        (self.workspace / "bad").symlink_to(self.outside, target_is_directory=True)
        p = subprocess.run([sys.executable, str(SCANNER), "--root", str(self.workspace), "--policy", str(self.policy)], text=True, capture_output=True)
        self.assertEqual(3, p.returncode)
        data = json.loads(p.stdout)
        self.assertGreaterEqual(data["blocking_findings"], 1)
        self.assertIn("symlink-escape", {f["kind"] for f in data["findings"]})

    def test_scanner_allows_in_root_link(self):
        target = self.workspace / "target"
        target.mkdir()
        (self.workspace / "good").symlink_to(target, target_is_directory=True)
        p = subprocess.run([sys.executable, str(SCANNER), "--root", str(self.workspace), "--policy", str(self.policy)], text=True, capture_output=True)
        self.assertEqual(0, p.returncode, p.stdout + p.stderr)
        data = json.loads(p.stdout)
        self.assertEqual(0, data["blocking_findings"])


if __name__ == "__main__":
    unittest.main()

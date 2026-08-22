#!/usr/bin/env python3
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "file_snapshot_guard.py"


class GuardTests(unittest.TestCase):
    def run_guard(self, *args: str):
        return subprocess.run([sys.executable, str(SCRIPT), *args], text=True, capture_output=True)

    def test_unchanged_file_passes(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "a.txt").write_text("alpha\n", encoding="utf-8")
            snap = root / "snap.json"
            self.assertEqual(self.run_guard("snapshot", "--root", str(root), "--output", str(snap), "a.txt").returncode, 0)
            result = self.run_guard("verify", "--root", str(root), "--snapshot", str(snap))
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(result.stdout)["status"], "fresh")

    def test_modified_file_is_blocked(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            target = root / "a.txt"
            target.write_text("alpha\n", encoding="utf-8")
            snap = root / "snap.json"
            self.run_guard("snapshot", "--root", str(root), "--output", str(snap), "a.txt")
            target.write_text("human edit\n", encoding="utf-8")
            result = self.run_guard("verify", "--root", str(root), "--snapshot", str(snap))
            self.assertEqual(result.returncode, 2)
            report = json.loads(result.stdout)
            self.assertEqual(report["stale"][0]["reason"], "content_hash_changed")

    def test_deleted_file_is_blocked(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            target = root / "a.txt"
            target.write_text("alpha", encoding="utf-8")
            snap = root / "snap.json"
            self.run_guard("snapshot", "--root", str(root), "--output", str(snap), "a.txt")
            target.unlink()
            result = self.run_guard("verify", "--root", str(root), "--snapshot", str(snap))
            self.assertEqual(result.returncode, 2)

    def test_missing_then_created_is_blocked(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            snap = root / "snap.json"
            self.run_guard("snapshot", "--root", str(root), "--output", str(snap), "new.txt")
            (root / "new.txt").write_text("someone else created it", encoding="utf-8")
            result = self.run_guard("verify", "--root", str(root), "--snapshot", str(snap))
            self.assertEqual(result.returncode, 2)

    def test_same_bytes_with_new_mtime_pass(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            target = root / "a.txt"
            target.write_text("same", encoding="utf-8")
            snap = root / "snap.json"
            self.run_guard("snapshot", "--root", str(root), "--output", str(snap), "a.txt")
            data = target.read_bytes()
            target.write_bytes(data)
            result = self.run_guard("verify", "--root", str(root), "--snapshot", str(snap))
            self.assertEqual(result.returncode, 0, result.stderr)

    def test_path_escape_rejected(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            snap = root / "snap.json"
            result = self.run_guard("snapshot", "--root", str(root), "--output", str(snap), "../outside.txt")
            self.assertNotEqual(result.returncode, 0)


if __name__ == "__main__":
    unittest.main()

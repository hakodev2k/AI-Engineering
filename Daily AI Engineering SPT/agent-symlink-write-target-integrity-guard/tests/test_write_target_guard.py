#!/usr/bin/env python3
from __future__ import annotations
import importlib.util
import json
import pathlib
import tempfile
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "write_target_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(guard)


class GuardTests(unittest.TestCase):
    def policy(self, root: pathlib.Path) -> dict:
        return {
            "writable_roots": [str(root)],
            "allow_symlink_leaf_write": False,
            "require_existing_parent": True,
            "fail_closed_on_resolution_error": True,
            "high_risk_shell_patterns": [r"(^|[^<])>{1,2}[^>]", r"\btee\b"],
            "protected_path_fragments": [".git", ".ssh"]
        }

    def test_regular_file_inside_root_passes(self):
        with tempfile.TemporaryDirectory() as td:
            root = pathlib.Path(td)
            target = root / "safe.txt"
            target.write_text("x", encoding="utf-8")
            code, result = guard.inspect(str(target), self.policy(root), None)
            self.assertEqual(0, code)
            self.assertEqual("pass", result["status"])

    def test_symlink_leaf_is_blocked(self):
        with tempfile.TemporaryDirectory() as td, tempfile.TemporaryDirectory() as outside:
            root = pathlib.Path(td)
            victim = pathlib.Path(outside) / "victim.txt"
            victim.write_text("safe", encoding="utf-8")
            link = root / "output.txt"
            try:
                link.symlink_to(victim)
            except (OSError, NotImplementedError):
                self.skipTest("symlink creation unavailable")
            code, result = guard.inspect(str(link), self.policy(root), None)
            self.assertEqual(2, code)
            self.assertTrue(result["leaf_is_symlink"])
            self.assertTrue(result["violations"])
            self.assertEqual("safe", victim.read_text(encoding="utf-8"))

    def test_symlink_parent_escape_is_blocked(self):
        with tempfile.TemporaryDirectory() as td, tempfile.TemporaryDirectory() as outside:
            root = pathlib.Path(td)
            ext = pathlib.Path(outside)
            parent_link = root / "linked"
            try:
                parent_link.symlink_to(ext, target_is_directory=True)
            except (OSError, NotImplementedError):
                self.skipTest("directory symlink creation unavailable")
            target = parent_link / "new.txt"
            code, result = guard.inspect(str(target), self.policy(root), None)
            self.assertEqual(2, code)
            self.assertIn("canonical parent outside writable roots", result["violations"])
            self.assertFalse((ext / "new.txt").exists())

    def test_nonexistent_parent_fails_closed(self):
        with tempfile.TemporaryDirectory() as td:
            root = pathlib.Path(td)
            target = root / "missing" / "file.txt"
            code, result = guard.inspect(str(target), self.policy(root), None)
            self.assertEqual(2, code)
            self.assertIn("parent", result["reason"])

    def test_shell_redirection_is_flagged(self):
        with tempfile.TemporaryDirectory() as td:
            root = pathlib.Path(td)
            target = root / "safe.txt"
            target.write_text("x", encoding="utf-8")
            code, result = guard.inspect(str(target), self.policy(root), "printf x > safe.txt")
            self.assertEqual(0, code)
            self.assertTrue(result["command_requires_write_preflight"])

    def test_protected_path_is_blocked(self):
        with tempfile.TemporaryDirectory() as td:
            root = pathlib.Path(td)
            protected = root / ".git"
            protected.mkdir()
            target = protected / "config"
            target.write_text("x", encoding="utf-8")
            code, result = guard.inspect(str(target), self.policy(root), None)
            self.assertEqual(2, code)
            self.assertIn("target intersects protected path fragment", result["violations"])


if __name__ == "__main__":
    unittest.main(verbosity=2)

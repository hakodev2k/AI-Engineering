from __future__ import annotations

import importlib.util
import os
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("gate", ROOT / "scripts/path_boundary_gate.py")
assert SPEC and SPEC.loader
GATE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(GATE)


class BoundaryGateTests(unittest.TestCase):
    def test_direct_existing_path_is_safe(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d).resolve()
            (root / "a.txt").write_text("x")
            result = GATE.inspect("a.txt", root)
            self.assertTrue(result["safe"])
            self.assertEqual("direct", result["kind"])

    def test_new_file_under_existing_directory_is_safe(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d).resolve()
            (root / "src").mkdir()
            result = GATE.inspect("src/new.txt", root)
            self.assertTrue(result["safe"])

    def test_lexical_escape_is_blocked(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d).resolve()
            result = GATE.inspect("../outside.txt", root)
            self.assertFalse(result["safe"])
            self.assertEqual("lexical_escape", result["kind"])

    @unittest.skipIf(os.name == "nt" and not hasattr(os, "symlink"), "symlink unavailable")
    def test_external_symlink_is_blocked(self):
        with tempfile.TemporaryDirectory() as d, tempfile.TemporaryDirectory() as ext:
            root = Path(d).resolve()
            target = Path(ext).resolve()
            link = root / "external"
            try:
                link.symlink_to(target, target_is_directory=True)
            except (OSError, NotImplementedError):
                self.skipTest("symlink creation not permitted")
            result = GATE.inspect("external/file.txt", root)
            self.assertFalse(result["safe"])
            self.assertEqual("resolved_escape", result["kind"])

    def test_is_within_rejects_sibling_prefix(self):
        with tempfile.TemporaryDirectory() as d:
            parent = Path(d).resolve()
            root = parent / "repo"
            sibling = parent / "repo-other"
            root.mkdir(); sibling.mkdir()
            self.assertFalse(GATE.is_within(sibling, root))


if __name__ == "__main__":
    unittest.main()

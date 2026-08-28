import tempfile
import unittest
from pathlib import Path
from scripts.protected_path_guard import evaluate


class ProtectedPathGuardTests(unittest.TestCase):
    def test_blocks_absent_protected_descendant_without_future_deny(self):
        with tempfile.TemporaryDirectory() as td:
            policy = {
                "writable_roots": ["."],
                "protected_relative_paths": [".git"],
                "backend_capabilities": {"future_path_deny": False, "requires_materialization": False},
                "block_if_unprotected_absent_descendant": True,
                "block_if_policy_materializes_protected_path": True,
            }
            result = evaluate(Path(td), policy)
            self.assertFalse(result["ok"])
            self.assertIn("absent_protected_descendant_not_future_denied", result["reasons"])
            self.assertFalse((Path(td) / ".git").exists())

    def test_allows_absent_path_when_backend_proves_future_deny(self):
        with tempfile.TemporaryDirectory() as td:
            policy = {
                "writable_roots": ["."],
                "protected_relative_paths": [".git/hooks"],
                "backend_capabilities": {"future_path_deny": True, "requires_materialization": False},
            }
            result = evaluate(Path(td), policy)
            self.assertTrue(result["ok"])
            self.assertFalse((Path(td) / ".git").exists())

    def test_blocks_materialization_based_backend_for_absent_path(self):
        with tempfile.TemporaryDirectory() as td:
            policy = {
                "writable_roots": ["."],
                "protected_relative_paths": [".codex"],
                "backend_capabilities": {"future_path_deny": True, "requires_materialization": True},
                "block_if_policy_materializes_protected_path": True,
            }
            result = evaluate(Path(td), policy)
            self.assertFalse(result["ok"])
            self.assertIn("policy_would_materialize_protected_path", result["reasons"])

    def test_existing_protected_path_does_not_trigger_absent_path_failure(self):
        with tempfile.TemporaryDirectory() as td:
            (Path(td) / ".git").mkdir()
            policy = {
                "writable_roots": ["."],
                "protected_relative_paths": [".git"],
                "backend_capabilities": {"future_path_deny": False, "requires_materialization": False},
            }
            result = evaluate(Path(td), policy)
            self.assertTrue(result["ok"])

    def test_rejects_parent_escape(self):
        with tempfile.TemporaryDirectory() as td:
            policy = {
                "writable_roots": ["."],
                "protected_relative_paths": ["../outside"],
                "backend_capabilities": {"future_path_deny": True, "requires_materialization": False},
            }
            with self.assertRaises(ValueError):
                evaluate(Path(td), policy)


if __name__ == "__main__":
    unittest.main()

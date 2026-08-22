import importlib.util
import pathlib
import tempfile
import unittest

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "git_mutation_guard.py"
spec = importlib.util.spec_from_file_location("git_mutation_guard", MODULE)
guard = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(guard)


class GuardTests(unittest.TestCase):
    def test_feature_push_allowed(self):
        decision, detail = guard.evaluate({"operation": "push", "default_branch": "main", "remote_branch": "feature/a"})
        self.assertEqual("ALLOW", decision)
        self.assertEqual("feature/a", detail["resolved_target"])

    def test_default_push_requires_exact_approval(self):
        decision, _ = guard.evaluate({"operation": "push", "default_branch": "main", "remote_branch": "refs/heads/main"})
        self.assertEqual("BLOCK", decision)
        decision, _ = guard.evaluate({"operation": "push", "default_branch": "main", "remote_branch": "main", "approved_default_branch": True})
        self.assertEqual("ALLOW", decision)

    def test_force_push_default_always_blocked(self):
        decision, _ = guard.evaluate({"operation": "force-push", "default_branch": "main", "remote_branch": "main", "approved_default_branch": True})
        self.assertEqual("BLOCK", decision)

    def test_cleanup_containment(self):
        with tempfile.TemporaryDirectory() as root:
            inside = pathlib.Path(root) / "child"
            inside.mkdir()
            decision, _ = guard.evaluate({"operation": "cleanup", "candidate_path": str(inside), "allowed_roots": [root]})
            self.assertEqual("ALLOW", decision)
            decision, _ = guard.evaluate({"operation": "cleanup", "candidate_path": str(pathlib.Path(root).parent), "allowed_roots": [root]})
            self.assertEqual("BLOCK", decision)

    def test_root_removal_requires_policy(self):
        with tempfile.TemporaryDirectory() as root:
            decision, _ = guard.evaluate({"operation": "cleanup", "candidate_path": root, "allowed_roots": [root]})
            self.assertEqual("BLOCK", decision)
            decision, _ = guard.evaluate({"operation": "cleanup", "candidate_path": root, "allowed_roots": [root], "allow_remove_root": True})
            self.assertEqual("ALLOW", decision)


if __name__ == "__main__":
    unittest.main()

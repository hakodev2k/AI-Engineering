import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "worktree_context_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(guard)


class PureValidationTests(unittest.TestCase):
    def setUp(self):
        self.policy = {
            "allowed_operations": ["read", "write", "commit", "push", "patch-apply", "branch-mutate"],
            "require_worktree_path_match": True,
            "require_common_git_dir_match": True,
            "require_exact_branch_when_declared": True,
            "require_upstream_match_when_declared": False,
            "require_head_oid_match_for_patch_apply": True,
            "require_clean_index_for_patch_apply": True,
            "fail_closed_on_detached_head": False,
        }

    def test_capture_and_check_real_repo(self):
        import subprocess
        with tempfile.TemporaryDirectory() as td:
            subprocess.run(["git", "init", td], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            subprocess.run(["git", "-C", td, "config", "user.email", "test@example.invalid"], check=True)
            subprocess.run(["git", "-C", td, "config", "user.name", "Test"], check=True)
            Path(td, "a.txt").write_text("x", encoding="utf-8")
            subprocess.run(["git", "-C", td, "add", "a.txt"], check=True)
            subprocess.run(["git", "-C", td, "commit", "-m", "init"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            contract = guard.capture(td, "write", None, None)
            errors, _ = guard.validate(td, contract, self.policy, None)
            self.assertEqual([], errors)

    def test_wrong_worktree_path_blocks(self):
        state = {
            "repo_top": "/repo/w1", "worktree_path": "/repo/w1", "common_git_dir": "/repo/.git",
            "head_oid": "a" * 40, "branch": "feature/x", "detached": False,
            "upstream": None, "index_dirty": False,
        }
        contract = {"operation": "write", "expected": dict(state)}
        contract["expected"]["worktree_path"] = "/repo/w2"
        original = guard.current_state
        guard.current_state = lambda cwd: state
        try:
            errors, _ = guard.validate(".", contract, self.policy, None)
            self.assertIn("worktree_path_mismatch", errors)
        finally:
            guard.current_state = original

    def test_wrong_branch_blocks(self):
        state = {
            "repo_top": "/repo", "worktree_path": "/repo", "common_git_dir": "/repo/.git",
            "head_oid": "a" * 40, "branch": "main", "detached": False,
            "upstream": None, "index_dirty": False,
        }
        contract = {"operation": "write", "expected": {**state, "branch": "feature/x"}}
        original = guard.current_state
        guard.current_state = lambda cwd: state
        try:
            errors, _ = guard.validate(".", contract, self.policy, None)
            self.assertIn("branch_mismatch", errors)
        finally:
            guard.current_state = original

    def test_wrong_repository_blocks(self):
        state = {
            "repo_top": "/repo-a", "worktree_path": "/repo-a", "common_git_dir": "/repo-a/.git",
            "head_oid": "a" * 40, "branch": "feature/x", "detached": False,
            "upstream": None, "index_dirty": False,
        }
        contract = {"operation": "write", "expected": {**state, "common_git_dir": "/repo-b/.git"}}
        original = guard.current_state
        guard.current_state = lambda cwd: state
        try:
            errors, _ = guard.validate(".", contract, self.policy, None)
            self.assertIn("common_git_dir_mismatch", errors)
        finally:
            guard.current_state = original

    def test_patch_base_drift_blocks(self):
        state = {
            "repo_top": "/repo", "worktree_path": "/repo", "common_git_dir": "/repo/.git",
            "head_oid": "b" * 40, "branch": "feature/x", "detached": False,
            "upstream": None, "index_dirty": False,
        }
        contract = {"operation": "patch-apply", "expected": {**state, "head_oid": "a" * 40}}
        original = guard.current_state
        guard.current_state = lambda cwd: state
        try:
            errors, _ = guard.validate(".", contract, self.policy, None)
            self.assertIn("patch_base_head_mismatch", errors)
        finally:
            guard.current_state = original

    def test_dirty_patch_destination_blocks(self):
        state = {
            "repo_top": "/repo", "worktree_path": "/repo", "common_git_dir": "/repo/.git",
            "head_oid": "a" * 40, "branch": "feature/x", "detached": False,
            "upstream": None, "index_dirty": True,
        }
        contract = {"operation": "patch-apply", "expected": dict(state)}
        original = guard.current_state
        guard.current_state = lambda cwd: state
        try:
            errors, _ = guard.validate(".", contract, self.policy, None)
            self.assertIn("patch_apply_requires_clean_worktree", errors)
        finally:
            guard.current_state = original


if __name__ == "__main__":
    unittest.main()

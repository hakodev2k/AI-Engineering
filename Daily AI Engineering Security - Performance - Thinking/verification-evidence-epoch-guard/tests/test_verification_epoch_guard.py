import unittest
from scripts.verification_epoch_guard import evaluate

POLICY = {"verification_ttl_seconds": 1000, "require_clean_or_captured_diff": True, "require_monotonic_verification_epoch": True}
BASE = {"verification_epoch": 3, "previous_verification_epoch": 2, "verification_exit_code": 0, "verified_snapshot": "abc", "current_snapshot": "abc", "verified_at": 1000, "worktree_dirty": False}

class GuardTests(unittest.TestCase):
    def test_fresh(self):
        self.assertTrue(evaluate(dict(BASE), POLICY, 1500)["ok"])
    def test_snapshot_change(self):
        state = dict(BASE); state["current_snapshot"] = "def"
        self.assertIn("snapshot_changed_after_verification", evaluate(state, POLICY, 1500)["reasons"])
    def test_epoch_regression(self):
        state = dict(BASE); state["verification_epoch"] = 2
        self.assertIn("verification_epoch_not_monotonic", evaluate(state, POLICY, 1500)["reasons"])
    def test_expired(self):
        self.assertIn("verification_ttl_expired", evaluate(dict(BASE), POLICY, 2501)["reasons"])
    def test_dirty_requires_capture(self):
        state = dict(BASE); state["worktree_dirty"] = True
        self.assertIn("dirty_diff_not_captured", evaluate(state, POLICY, 1500)["reasons"])

if __name__ == "__main__":
    unittest.main()

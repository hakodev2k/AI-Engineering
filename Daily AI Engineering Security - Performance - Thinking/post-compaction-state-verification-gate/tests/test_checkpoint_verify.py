import unittest
from scripts.checkpoint_verify import verify


class CheckpointVerifyTests(unittest.TestCase):
    def test_verified_critical_can_continue(self):
        cp = {"claims": [{"id": "c1", "text": "tests pass", "critical": True, "status": "verified", "evidence": ["pytest:0"]}], "loop_state": {"attempt": 1, "max_attempts": 2}}
        result = verify(cp)
        self.assertTrue(result["ok"])
        self.assertEqual(result["critical_verification_coverage"], 1.0)

    def test_unverified_critical_blocks(self):
        cp = {"claims": [{"id": "c1", "text": "file changed", "critical": True, "status": "unverified", "evidence": []}], "loop_state": {"attempt": 0, "max_attempts": 2}}
        self.assertFalse(verify(cp)["ok"])

    def test_contradiction_blocks(self):
        cp = {"claims": [{"id": "c1", "text": "branch clean", "critical": False, "status": "contradicted", "evidence": ["git status"]}], "loop_state": {"attempt": 0, "max_attempts": 2}}
        self.assertFalse(verify(cp)["ok"])

    def test_retry_budget_blocks(self):
        cp = {"claims": [], "loop_state": {"attempt": 2, "max_attempts": 2}}
        result = verify(cp)
        self.assertFalse(result["ok"])
        self.assertIn("retry_budget_exhausted", result["reasons"])

    def test_no_hidden_reasoning_required(self):
        cp = {"claims": [], "loop_state": {"attempt": 0, "max_attempts": 2}, "decision": "continue"}
        self.assertTrue(verify(cp)["ok"])


if __name__ == "__main__":
    unittest.main()

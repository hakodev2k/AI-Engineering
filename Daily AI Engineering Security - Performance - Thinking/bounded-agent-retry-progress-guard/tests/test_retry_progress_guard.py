import unittest
from scripts.retry_progress_guard import evaluate

POLICY = {"max_consecutive_retries": 3, "max_same_action": 4, "max_no_progress_steps": 5}

class RetryProgressGuardTests(unittest.TestCase):
    def test_retry_budget_halts(self):
        rows = [{"event": "retry", "action_signature": "llm:a"} for _ in range(3)]
        self.assertFalse(evaluate(rows, POLICY)["ok"])

    def test_progress_resets_no_progress_counter(self):
        rows = [
            {"event": "tool", "action_signature": "read:a", "progress": False},
            {"event": "tool", "action_signature": "read:b", "progress": True},
            {"event": "tool", "action_signature": "read:c", "progress": False},
        ]
        self.assertTrue(evaluate(rows, POLICY)["ok"])

    def test_same_action_halts(self):
        rows = [{"event": "tool", "action_signature": "test:x", "progress": False} for _ in range(4)]
        self.assertFalse(evaluate(rows, POLICY)["ok"])

    def test_short_run_continues(self):
        self.assertTrue(evaluate([{"event": "model", "action_signature": "plan", "progress": True}], POLICY)["ok"])

if __name__ == "__main__":
    unittest.main()

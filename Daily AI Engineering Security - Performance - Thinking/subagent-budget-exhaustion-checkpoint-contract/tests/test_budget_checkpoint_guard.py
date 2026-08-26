import unittest
from scripts.budget_checkpoint_guard import evaluate

POLICY = {"soft_budget_ratio": 0.8, "hard_budget_ratio": 0.95, "reserve_tokens_for_checkpoint": 1000}
CHECKPOINT = {"goal": "deliver feature", "facts": ["repo mapped"], "completed_steps": ["tests inspected"], "next_step": "edit parser", "verification_status": "partial"}

class GuardTests(unittest.TestCase):
    def test_continue(self):
        result = evaluate({"task_id": "t", "budget_tokens": 10000, "used_tokens": 2000, "estimated_next_call_tokens": 1000, "checkpoint": {}}, POLICY)
        self.assertEqual(result["decision"], "continue")
    def test_soft_checkpoint(self):
        result = evaluate({"task_id": "t", "budget_tokens": 10000, "used_tokens": 8200, "estimated_next_call_tokens": 200, "checkpoint": CHECKPOINT}, POLICY)
        self.assertTrue(result["ok"]); self.assertEqual(result["decision"], "checkpoint_then_continue")
    def test_reserve_blocks_next_call(self):
        result = evaluate({"task_id": "t", "budget_tokens": 10000, "used_tokens": 8500, "estimated_next_call_tokens": 800, "checkpoint": CHECKPOINT}, POLICY)
        self.assertFalse(result["ok"]); self.assertEqual(result["decision"], "checkpoint_and_yield")
    def test_hard_pressure(self):
        result = evaluate({"task_id": "t", "budget_tokens": 10000, "used_tokens": 9500, "estimated_next_call_tokens": 0, "checkpoint": CHECKPOINT}, POLICY)
        self.assertFalse(result["ok"])
    def test_invalid_budget(self):
        result = evaluate({"task_id": "t", "budget_tokens": 0, "used_tokens": 0, "estimated_next_call_tokens": 0, "checkpoint": {}}, POLICY)
        self.assertFalse(result["ok"])

if __name__ == "__main__":
    unittest.main()

import unittest
from scripts.fanout_budget_guard import evaluate

POLICY = {
    "session_budget_tokens": 1000000,
    "reserve_tokens": 100000,
    "max_children": 6,
    "max_retries_per_child": 1,
    "min_useful_to_bootstrap_ratio": 1.5,
    "fallback_bootstrap_tokens": 25000,
    "projection_safety_factor": 1.0,
}
HISTORY = [{"bootstrap_tokens": 20000}, {"bootstrap_tokens": 30000}, {"bootstrap_tokens": 25000}]

class FanoutBudgetTests(unittest.TestCase):
    def test_high_value_fanout_allowed(self):
        request = {"session_tokens_spent": 100000, "children": [
            {"name": "a", "estimated_useful_tokens": 60000, "inherited_context_tokens": 5000},
            {"name": "b", "estimated_useful_tokens": 70000, "inherited_context_tokens": 5000},
        ]}
        r = evaluate(HISTORY, request, POLICY)
        self.assertTrue(r["ok"])
        self.assertEqual(r["decision"], "fanout")

    def test_all_low_value_prefers_serial(self):
        request = {"children": [{"name": "tiny", "estimated_useful_tokens": 5000, "inherited_context_tokens": 40000}]}
        self.assertEqual(evaluate(HISTORY, request, POLICY)["decision"], "serial")

    def test_mixed_value_prefers_group(self):
        request = {"children": [
            {"name": "large", "estimated_useful_tokens": 80000, "inherited_context_tokens": 0},
            {"name": "tiny", "estimated_useful_tokens": 5000, "inherited_context_tokens": 40000},
        ]}
        self.assertEqual(evaluate(HISTORY, request, POLICY)["decision"], "group")

    def test_budget_breach_blocks(self):
        request = {"session_tokens_spent": 850000, "children": [{"name": "a", "estimated_useful_tokens": 80000, "inherited_context_tokens": 10000}]}
        r = evaluate(HISTORY, request, POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("session_budget_would_be_exceeded", r["reasons"])

    def test_too_many_children_blocks(self):
        request = {"children": [{"name": str(i), "estimated_useful_tokens": 50000, "inherited_context_tokens": 0} for i in range(7)]}
        self.assertIn("max_children_exceeded", evaluate(HISTORY, request, POLICY)["reasons"])

if __name__ == "__main__":
    unittest.main()

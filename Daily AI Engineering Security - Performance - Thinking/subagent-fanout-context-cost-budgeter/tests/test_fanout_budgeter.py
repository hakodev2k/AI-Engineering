import unittest
from scripts.fanout_budgeter import evaluate


class FanoutBudgeterTests(unittest.TestCase):
    def test_allows_efficient_fanout(self):
        m = {"num_children": 2, "parent_context_tokens": 1000, "child_fixed_tokens": 100, "inherited_tokens_per_child": 0, "unique_tokens_per_child": 1000, "serial_unique_tokens": 4000, "max_fanout_to_serial_ratio": 1.25}
        self.assertEqual(evaluate(m)["decision"], "allow_fanout")

    def test_regroups_bootstrap_heavy_fanout(self):
        m = {"num_children": 5, "parent_context_tokens": 1000, "child_fixed_tokens": 2000, "inherited_tokens_per_child": 3000, "unique_tokens_per_child": 200, "serial_unique_tokens": 2500, "max_fanout_to_serial_ratio": 1.25}
        r = evaluate(m)
        self.assertFalse(r["ok"]); self.assertIn("fanout_exceeds_serial_ratio", r["reasons"])

    def test_polling_cost_is_counted(self):
        m = {"num_children": 1, "child_fixed_tokens": 0, "unique_tokens_per_child": 100, "serial_unique_tokens": 100, "status_poll_turns": 10, "tokens_per_status_poll": 1000, "max_fanout_to_serial_ratio": 2.0}
        self.assertEqual(evaluate(m)["decision"], "regroup_or_serialize")

    def test_total_budget_blocks(self):
        m = {"num_children": 2, "child_fixed_tokens": 1000, "unique_tokens_per_child": 1000, "serial_unique_tokens": 5000, "max_fanout_to_serial_ratio": 10, "max_total_tokens": 3000}
        self.assertIn("fanout_exceeds_total_budget", evaluate(m)["reasons"])

    def test_invalid_negative_input_blocks(self):
        m = {"num_children": 2, "child_fixed_tokens": -1, "unique_tokens_per_child": 1, "serial_unique_tokens": 1}
        self.assertFalse(evaluate(m)["ok"])


if __name__ == "__main__":
    unittest.main()

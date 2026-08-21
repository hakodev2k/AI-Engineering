import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "fanout_budget.py"
spec = importlib.util.spec_from_file_location("fanout_budget", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

CFG = {
    "max_concurrent_agents": 4,
    "max_aggregate_predicted_tokens": 300000,
    "max_predicted_tokens_per_agent": 120000,
    "assumed_parent_context_inheritance_ratio": 0.5,
    "retry_cost_multiplier": 1.0,
    "max_retries_per_agent": 1,
    "warn_amplification_ratio": 2.0,
    "block_amplification_ratio": 3.0
}

class FanoutBudgetTests(unittest.TestCase):
    def test_small_fanout_allowed(self):
        r = mod.evaluate(CFG, 20000, 2, 10000, 0, 50000)
        self.assertEqual(r["decision"], "allow")
        self.assertEqual(r["predicted_aggregate_tokens"], 40000)

    def test_concurrency_blocked(self):
        r = mod.evaluate(CFG, 10000, 5, 5000, 0, 100000)
        self.assertEqual(r["decision"], "block")
        self.assertIn("concurrency_limit", r["violations"])

    def test_retry_cost_is_budgeted(self):
        r = mod.evaluate(CFG, 60000, 3, 20000, 1, 100000)
        self.assertEqual(r["predicted_tokens_per_child"], 100000)
        self.assertEqual(r["predicted_aggregate_tokens"], 300000)
        self.assertIn(r["decision"], {"warn", "block"})

    def test_invalid_retry_limit(self):
        with self.assertRaises(ValueError):
            mod.evaluate(CFG, 10000, 2, 5000, 2, 50000)

if __name__ == "__main__":
    unittest.main()

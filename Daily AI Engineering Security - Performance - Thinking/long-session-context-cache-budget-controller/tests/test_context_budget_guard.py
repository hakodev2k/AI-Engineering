import unittest
from scripts.context_budget_guard import evaluate

POLICY = {
    "max_context_tokens": 100000,
    "soft_utilization": 0.78,
    "hard_utilization": 0.90,
    "safety_margin_tokens": 5000,
    "minimum_runway_tokens": 15000,
    "idle_cache_risk_seconds": 3600,
    "minimum_cache_read_ratio": 0.50,
}

def state(**kw):
    d = dict(current_context_tokens=40000, pending_user_tokens=1000, pending_tool_tokens=1000, pending_retrieval_tokens=1000, idle_seconds=10, cache_read_tokens=8000, cache_creation_tokens=2000)
    d.update(kw)
    return d

class BudgetTests(unittest.TestCase):
    def test_healthy_continue(self):
        self.assertEqual(evaluate(state(), POLICY)["decision"], "continue")

    def test_pending_tool_output_triggers_compaction(self):
        self.assertEqual(evaluate(state(current_context_tokens=70000, pending_tool_tokens=10000), POLICY)["decision"], "checkpoint_or_compact")

    def test_overflow_recommends_new_session(self):
        self.assertEqual(evaluate(state(current_context_tokens=94000, pending_tool_tokens=10000), POLICY)["decision"], "new_session_with_checkpoint")

    def test_idle_large_session_triggers(self):
        r = evaluate(state(current_context_tokens=60000, idle_seconds=4000), POLICY)
        self.assertEqual(r["decision"], "checkpoint_or_compact")
        self.assertIn("idle_cache_expiry_risk", r["reasons"])

    def test_low_cache_read_ratio_triggers(self):
        self.assertEqual(evaluate(state(current_context_tokens=60000, cache_read_tokens=1000, cache_creation_tokens=9000), POLICY)["decision"], "checkpoint_or_compact")

    def test_missing_metric_fails_conservatively(self):
        s = state(); s.pop("pending_tool_tokens")
        r = evaluate(s, POLICY)
        self.assertFalse(r["ok"])
        self.assertEqual(r["decision"], "checkpoint_or_compact")

if __name__ == "__main__": unittest.main()

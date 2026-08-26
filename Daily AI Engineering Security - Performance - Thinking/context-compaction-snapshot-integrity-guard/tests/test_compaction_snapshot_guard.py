import unittest
from scripts.compaction_snapshot_guard import evaluate

POLICY = {
    "max_snapshot_age_turns": 1,
    "compact_at_utilization": 0.8,
    "minimum_reserve_tokens": 1000,
    "max_capacity_mismatch_ratio": 0.02,
    "allowed_snapshot_sources": ["current_prompt", "last_call_prompt"],
}


def base():
    return {
        "current_prompt_tokens": 7000,
        "cumulative_usage_tokens": 50000,
        "configured_context_capacity": 10000,
        "effective_context_capacity": 10000,
        "reserve_tokens": 1000,
        "snapshot_turn": 10,
        "current_turn": 10,
        "snapshot_source": "current_prompt",
    }


class GuardTests(unittest.TestCase):
    def test_defer_below_threshold(self):
        r = evaluate(base(), POLICY)
        self.assertTrue(r["ok"])
        self.assertEqual(r["decision"], "defer")

    def test_compact_on_live_prompt_utilization(self):
        s = base()
        s["current_prompt_tokens"] = 8000
        r = evaluate(s, POLICY)
        self.assertEqual(r["decision"], "allow_compaction")

    def test_cumulative_source_is_rejected(self):
        s = base()
        s["snapshot_source"] = "cumulative_usage"
        r = evaluate(s, POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("untrusted_snapshot_source", r["reasons"])

    def test_stale_snapshot_is_rejected(self):
        s = base()
        s["current_turn"] = 13
        r = evaluate(s, POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("stale_snapshot", r["reasons"])

    def test_hidden_effective_capacity_mismatch_is_rejected(self):
        s = base()
        s["effective_context_capacity"] = 6000
        r = evaluate(s, POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("configured_effective_capacity_mismatch", r["reasons"])

    def test_impossible_cumulative_counter_is_rejected(self):
        s = base()
        s["cumulative_usage_tokens"] = 1000
        r = evaluate(s, POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("cumulative_usage_less_than_current_prompt", r["reasons"])


if __name__ == "__main__":
    unittest.main()

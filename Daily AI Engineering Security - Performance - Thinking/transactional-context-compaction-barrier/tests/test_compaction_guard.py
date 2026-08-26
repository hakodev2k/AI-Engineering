import unittest
from scripts.compaction_guard import evaluate, verify_result

POLICY = {
    "max_context_utilization": 0.80,
    "require_context_snapshot_scope": True,
    "require_durable_history_checkpoint": True,
    "block_on_unresolved_side_effects": True,
    "max_compaction_retries_per_digest": 2,
    "minimum_reduction_ratio": 0.15,
    "side_effecting_tools": ["file_write", "job_create"]
}

def event(**overrides):
    base = {
        "context_tokens": 850,
        "context_window": 1000,
        "token_scope": "current_context",
        "history": [{"role": "user", "content": "x"}],
        "history_checkpoint_durable": True,
        "tool_calls": [],
        "retry_count_for_digest": 0
    }
    base.update(overrides)
    return base

class Tests(unittest.TestCase):
    def test_allows_quiescent_durable_snapshot(self):
        self.assertTrue(evaluate(event(), POLICY)["ok"])

    def test_blocks_cumulative_usage(self):
        result = evaluate(event(token_scope="cumulative_run"), POLICY)
        self.assertFalse(result["ok"])
        self.assertIn("token_scope_not_current_context", result["reasons"])

    def test_blocks_undurable_history(self):
        self.assertFalse(evaluate(event(history_checkpoint_durable=False), POLICY)["ok"])

    def test_blocks_inflight_side_effect(self):
        calls = [{"id": "c1", "tool": "file_write", "state": "issued"}]
        result = evaluate(event(tool_calls=calls), POLICY)
        self.assertFalse(result["ok"])
        self.assertTrue(any(r.startswith("unresolved_side_effects") for r in result["reasons"]))

    def test_committed_side_effect_is_safe(self):
        calls = [{"id": "c1", "tool": "file_write", "state": "committed"}]
        self.assertTrue(evaluate(event(tool_calls=calls), POLICY)["ok"])

    def test_bounded_retries(self):
        self.assertFalse(evaluate(event(retry_count_for_digest=2), POLICY)["ok"])

    def test_postcheck_requires_real_reduction(self):
        self.assertFalse(verify_result(1000, 900, POLICY)["ok"])
        self.assertTrue(verify_result(1000, 800, POLICY)["ok"])

if __name__ == "__main__":
    unittest.main()

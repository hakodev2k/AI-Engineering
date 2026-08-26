import unittest
from scripts.cache_churn_guard import analyze

POLICY = {
    "min_large_context_tokens": 50000,
    "healthy_cache_ratio": 0.80,
    "collapse_cache_ratio": 0.40,
    "max_unexplained_collapses": 0,
    "max_expensive_noop_turns": 1,
    "require_prefix_id_for_large_context": True,
}

class CacheGuardTests(unittest.TestCase):
    def test_stable_cache_passes(self):
        rows = [
            {"input_tokens": 100000, "cached_tokens": 90000, "latency_ms": 1000, "semantic_progress": True, "prefix_id": "a"},
            {"input_tokens": 105000, "cached_tokens": 92000, "latency_ms": 1100, "semantic_progress": True, "prefix_id": "a"},
        ]
        self.assertEqual(analyze(rows, POLICY)["decision"], "pass")

    def test_same_prefix_collapse_blocks(self):
        rows = [
            {"input_tokens": 100000, "cached_tokens": 90000, "latency_ms": 1000, "semantic_progress": True, "prefix_id": "a"},
            {"input_tokens": 100000, "cached_tokens": 10000, "latency_ms": 4000, "semantic_progress": True, "prefix_id": "a"},
        ]
        result = analyze(rows, POLICY)
        self.assertEqual(result["decision"], "block")
        self.assertEqual(result["unexplained_events"][0]["reason"], "cache_ratio_collapse_same_prefix")

    def test_expected_invalidation_does_not_count_as_churn(self):
        rows = [
            {"input_tokens": 100000, "cached_tokens": 90000, "latency_ms": 1000, "semantic_progress": True, "prefix_id": "a"},
            {"input_tokens": 70000, "cached_tokens": 10000, "latency_ms": 1800, "semantic_progress": True, "prefix_id": "a", "expected_cache_invalidation": True},
        ]
        self.assertEqual(analyze(rows, POLICY)["decision"], "pass")

    def test_expensive_noop_streak_blocks(self):
        rows = [
            {"input_tokens": 80000, "cached_tokens": 70000, "latency_ms": 900, "semantic_progress": False, "prefix_id": "a"},
            {"input_tokens": 80000, "cached_tokens": 70000, "latency_ms": 900, "semantic_progress": False, "prefix_id": "a"},
        ]
        self.assertEqual(analyze(rows, POLICY)["decision"], "block")

    def test_missing_prefix_is_detected(self):
        rows = [{"input_tokens": 80000, "cached_tokens": 70000, "latency_ms": 900, "semantic_progress": True}]
        self.assertEqual(analyze(rows, POLICY)["decision"], "block")

if __name__ == "__main__":
    unittest.main()

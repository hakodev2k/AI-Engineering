import unittest
from scripts.cache_guard import evaluate

POLICY = {
    "models": {
        "gpt-5.6-sol": {
            "allowed_cache_fields": ["prompt_cache_key", "prompt_cache_options", "prompt_cache_breakpoint"],
            "deprecated_cache_fields": ["prompt_cache_retention"],
            "allowed_ttls": ["30m"],
            "allow_explicit_breakpoints": True,
        }
    },
    "economics": {
        "max_cache_write_to_read_ratio": 0.5,
        "max_cache_write_share_of_input": 0.4,
        "min_observed_input_tokens": 10000,
    },
    "behavior": {"economic_threshold_exceeded": "warn"},
}

class CacheGuardTests(unittest.TestCase):
    def test_valid_request_passes(self):
        r = evaluate(
            {"model": "gpt-5.6-sol", "cache": {"prompt_cache_options": {"ttl": "30m"}}},
            {"input_tokens": 20000, "cache_read_tokens": 16000, "cache_write_tokens": 1000},
            POLICY,
        )
        self.assertEqual(r["status"], "pass")

    def test_deprecated_field_blocks(self):
        r = evaluate(
            {"model": "gpt-5.6-sol", "cache": {"prompt_cache_retention": "24h"}},
            {"input_tokens": 1000, "cache_read_tokens": 0, "cache_write_tokens": 0},
            POLICY,
        )
        self.assertEqual(r["status"], "block")
        self.assertIn("deprecated_field:prompt_cache_retention", r["reasons"])

    def test_unsupported_ttl_blocks(self):
        r = evaluate(
            {"model": "gpt-5.6-sol", "cache": {"prompt_cache_options": {"ttl": "24h"}}},
            {"input_tokens": 1000, "cache_read_tokens": 0, "cache_write_tokens": 0},
            POLICY,
        )
        self.assertEqual(r["status"], "block")

    def test_expensive_write_pattern_warns(self):
        r = evaluate(
            {"model": "gpt-5.6-sol", "cache": {}},
            {"input_tokens": 20000, "cache_read_tokens": 1000, "cache_write_tokens": 12000},
            POLICY,
        )
        self.assertEqual(r["status"], "warn")
        self.assertIn("cache_write_share_exceeded", r["warnings"])

    def test_unknown_model_blocks(self):
        r = evaluate(
            {"model": "unknown", "cache": {}},
            {"input_tokens": 0, "cache_read_tokens": 0, "cache_write_tokens": 0},
            POLICY,
        )
        self.assertEqual(r["status"], "block")

if __name__ == "__main__":
    unittest.main()

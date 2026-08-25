import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "introspection_analyzer.py"
spec = importlib.util.spec_from_file_location("introspection_analyzer", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(mod)


class IntrospectionAnalyzerTests(unittest.TestCase):
    def test_repeated_uncached_fingerprint_detected(self):
        rows = [
            {"turn": 1, "provider": "bedrock", "model": "m", "fingerprint": "abc", "input_tokens": 1000, "latency_ms": 50, "cache_hit": False, "cost_usd": 0.01},
            {"turn": 2, "provider": "bedrock", "model": "m", "fingerprint": "abc", "input_tokens": 1000, "latency_ms": 50, "cache_hit": False, "cost_usd": 0.01},
        ]
        s = mod.summarize(rows)
        self.assertEqual(s["requests"], 2)
        self.assertEqual(s["repeated_calls"], 1)
        self.assertEqual(s["repeated_uncached_fingerprints"]["bedrock|m|abc"], 2)
        self.assertEqual(s["cache_hit_rate"], 0)

    def test_cache_improvement_comparison(self):
        before = mod.summarize([
            {"turn": 1, "provider": "p", "model": "m", "fingerprint": "x", "input_tokens": 100, "latency_ms": 10, "cache_hit": False, "cost_usd": 1},
            {"turn": 2, "provider": "p", "model": "m", "fingerprint": "x", "input_tokens": 100, "latency_ms": 10, "cache_hit": False, "cost_usd": 1},
        ])
        after = mod.summarize([
            {"turn": 1, "provider": "p", "model": "m", "fingerprint": "x", "input_tokens": 100, "latency_ms": 10, "cache_hit": False, "cost_usd": 1},
            {"turn": 2, "provider": "p", "model": "m", "fingerprint": "x", "input_tokens": 0, "latency_ms": 1, "cache_hit": True, "cost_usd": 0},
        ])
        c = mod.compare(before, after)
        self.assertEqual(c["input_tokens_change_percent"], -50.0)
        self.assertGreater(c["cache_hit_rate_delta"], 0)

    def test_model_is_part_of_fingerprint_identity(self):
        rows = [
            {"turn": 1, "provider": "p", "model": "m1", "fingerprint": "same", "input_tokens": 1, "latency_ms": 1, "cache_hit": False},
            {"turn": 1, "provider": "p", "model": "m2", "fingerprint": "same", "input_tokens": 1, "latency_ms": 1, "cache_hit": False},
        ]
        s = mod.summarize(rows)
        self.assertEqual(s["unique_fingerprints"], 2)
        self.assertEqual(s["repeated_calls"], 0)

    def test_per_turn_metrics(self):
        rows = [
            {"turn": 1, "provider": "p", "model": "m", "fingerprint": "a", "input_tokens": 20, "latency_ms": 5, "cache_hit": False},
            {"turn": 1, "provider": "p", "model": "m", "fingerprint": "b", "input_tokens": 30, "latency_ms": 5, "cache_hit": False},
            {"turn": 2, "provider": "p", "model": "m", "fingerprint": "a", "input_tokens": 0, "latency_ms": 1, "cache_hit": True},
        ]
        s = mod.summarize(rows)
        self.assertEqual(s["requests_per_turn"], 1.5)
        self.assertEqual(s["input_tokens_per_turn"], 25.0)


if __name__ == "__main__":
    unittest.main()

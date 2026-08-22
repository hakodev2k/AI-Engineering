import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "analyze_prefix_cache.py"
spec = importlib.util.spec_from_file_location("analyze_prefix_cache", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)


class PrefixCacheAnalyzerTests(unittest.TestCase):
    def test_weighted_metrics_and_churn(self):
        rows = [
            {"ts_ms": 0, "input_tokens": 2000, "cached_tokens": 1800, "prefix_fingerprint": "a", "ttft_ms": 100},
            {"ts_ms": 1000, "input_tokens": 2000, "cached_tokens": 1000, "prefix_fingerprint": "b", "ttft_ms": 200},
        ]
        report = mod.analyze(rows, {"gap_buckets_ms": [60000], "min_input_tokens": 0})
        self.assertEqual(report["input_tokens"], 4000)
        self.assertEqual(report["cached_tokens"], 2800)
        self.assertAlmostEqual(report["weighted_cache_hit_rate"], 0.7)
        self.assertAlmostEqual(report["prefix_fingerprint_churn_rate"], 1.0)
        self.assertEqual(report["ttft_ms"]["p95"], 200.0)

    def test_reject_cached_greater_than_input(self):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "rows.jsonl"
            p.write_text(json.dumps({"ts_ms": 1, "input_tokens": 10, "cached_tokens": 11}) + "\n", encoding="utf-8")
            with self.assertRaises(ValueError):
                mod.load_rows(p)

    def test_gap_bucket(self):
        rows = [
            {"ts_ms": 0, "input_tokens": 1000, "cached_tokens": 900},
            {"ts_ms": 120000, "input_tokens": 1000, "cached_tokens": 200},
        ]
        report = mod.analyze(rows, {"gap_buckets_ms": [60000, 300000], "min_input_tokens": 0})
        self.assertIn("60000-300000ms", report["gap_buckets"])
        self.assertEqual(report["gap_buckets"]["60000-300000ms"]["uncached_tokens"], 800)


if __name__ == "__main__":
    unittest.main()

import unittest
from scripts.prefix_drift_profiler import analyze

class DriftTests(unittest.TestCase):
    def test_finds_early_nonce_drift(self):
        data = {"requests": [
            {"request_id": "a", "input_tokens": 1000, "blocks": [{"label": "telemetry", "content": "nonce=1"}, {"label": "system", "content": "stable"}]},
            {"request_id": "b", "input_tokens": 1000, "cache_read_tokens": 0, "blocks": [{"label": "telemetry", "content": "nonce=2"}, {"label": "system", "content": "stable"}]}
        ]}
        result = analyze(data)
        self.assertEqual(result["comparisons"][0]["earliest_drift_index"], 0)
        self.assertEqual(result["early_prefix_drift_count"], 1)

    def test_stable_prefix_and_dynamic_suffix(self):
        data = {"requests": [
            {"request_id": "a", "input_tokens": 1000, "blocks": [{"label": "system", "content": "stable"}, {"label": "user", "content": "q1"}]},
            {"request_id": "b", "input_tokens": 1000, "cache_read_tokens": 800, "blocks": [{"label": "system", "content": "stable"}, {"label": "user", "content": "q2"}]}
        ]}
        result = analyze(data)
        self.assertEqual(result["comparisons"][0]["earliest_drift_index"], 1)
        self.assertGreater(result["comparisons"][0]["stable_prefix_bytes"], 0)
        self.assertAlmostEqual(result["mean_cache_read_ratio"], 0.8)

    def test_missing_usage_is_not_fake_miss(self):
        data = {"requests": [
            {"request_id": "a", "input_tokens": 10, "blocks": [{"label": "system", "content": "x"}]},
            {"request_id": "b", "input_tokens": 10, "blocks": [{"label": "system", "content": "x"}]}
        ]}
        result = analyze(data)
        self.assertEqual(result["status"], "structure_measured_usage_missing")
        self.assertIsNone(result["mean_cache_read_ratio"])

if __name__ == "__main__":
    unittest.main()

import unittest
from scripts.compaction_regression_guard import evaluate

class GuardTests(unittest.TestCase):
    def base(self):
        return {
            "pre_tokens": 200000,
            "post_tokens": 30000,
            "uncached_input_tokens": 20000,
            "cached_input_tokens": 180000,
            "repeated_payload_bytes": 10000,
            "turns_to_next_compaction": 20,
            "critical_markers_expected": ["goal", "constraints"],
            "critical_markers_retained": ["goal", "constraints"],
        }

    def test_pass(self):
        self.assertEqual(evaluate(self.base(), .35, .40, 65536, 8)["status"], "pass")

    def test_uncached_regression(self):
        m = self.base(); m["uncached_input_tokens"] = 150000; m["cached_input_tokens"] = 50000
        self.assertIn("uncached_input_ratio_regression", evaluate(m, .35, .40, 65536, 8)["reasons"])

    def test_thrashing(self):
        m = self.base(); m["turns_to_next_compaction"] = 3
        self.assertIn("compaction_thrashing", evaluate(m, .35, .40, 65536, 8)["reasons"])

    def test_context_loss(self):
        m = self.base(); m["critical_markers_retained"] = ["goal"]
        self.assertIn("critical_context_loss", evaluate(m, .35, .40, 65536, 8)["reasons"])

if __name__ == "__main__":
    unittest.main()

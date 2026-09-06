import importlib.util
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "normalize_usage.py"
spec = importlib.util.spec_from_file_location("normalize_usage", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)


class NormalizeUsageTests(unittest.TestCase):
    def test_advisor_turn_uses_final_executor_iteration_for_occupancy(self):
        usage = {
            "input_tokens": 4,
            "cache_creation_input_tokens": 6,
            "cache_read_input_tokens": 1031017,
            "iterations": [
                {"type": "message", "input_tokens": 3, "cache_read_input_tokens": 515119, "cache_creation_input_tokens": 0},
                {"type": "advisor_message", "input_tokens": 516328, "cache_read_input_tokens": 0, "cache_creation_input_tokens": 0},
                {"type": "message", "input_tokens": 1, "cache_read_input_tokens": 515899, "cache_creation_input_tokens": 5}
            ]
        }
        result = mod.normalize_usage(usage, 1_000_000, 95.0)
        self.assertEqual(result["occupancy_tokens"], 515905)
        self.assertEqual(result["occupancy_source"], "final_message_iteration")
        self.assertEqual(result["advisor_input_tokens"], 516328)
        self.assertFalse(result["should_compact"])
        self.assertTrue(result["inflation_alert"])

    def test_legitimate_high_occupancy_compacts(self):
        usage = {
            "input_tokens": 2,
            "cache_read_input_tokens": 960000,
            "cache_creation_input_tokens": 0,
            "iterations": [
                {"type": "message", "input_tokens": 2, "cache_read_input_tokens": 960000, "cache_creation_input_tokens": 0}
            ]
        }
        result = mod.normalize_usage(usage, 1_000_000, 95.0)
        self.assertTrue(result["should_compact"])
        self.assertEqual(result["occupancy_tokens"], 960002)

    def test_no_iterations_uses_explicit_fallback(self):
        usage = {"input_tokens": 1000, "cache_read_input_tokens": 2000, "cache_creation_input_tokens": 300}
        result = mod.normalize_usage(usage, 200000, 95.0)
        self.assertEqual(result["occupancy_tokens"], 3300)
        self.assertEqual(result["occupancy_source"], "top_level_fallback")
        self.assertFalse(result["should_compact"])

    def test_unknown_iteration_type_is_rejected(self):
        usage = {"iterations": [{"type": "mystery", "input_tokens": 10}]}
        with self.assertRaises(ValueError):
            mod.normalize_usage(usage, 200000, 95.0)

    def test_negative_token_field_is_rejected(self):
        usage = {"input_tokens": -1}
        with self.assertRaises(ValueError):
            mod.normalize_usage(usage, 200000, 95.0)


if __name__ == "__main__":
    unittest.main()

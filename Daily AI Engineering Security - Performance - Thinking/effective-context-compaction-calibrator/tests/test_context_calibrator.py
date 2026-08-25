import importlib.util
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "context_calibrator.py"
spec = importlib.util.spec_from_file_location("cal", SCRIPT)
cal = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cal)

POLICY = {"target_utilization_ratio": 0.88, "minimum_response_runway_tokens": 12000, "minimum_compaction_headroom_tokens": 16000}

class CalibratorTests(unittest.TestCase):
    def test_effective_window_not_raw_window(self):
        d = {"raw_window_tokens": 272000, "effective_context_percentage": 0.95, "response_reserve_tokens": 12000, "configured_compaction_trigger_tokens": 244800, "current_prompt_tokens": 200000}
        r = cal.evaluate(d, POLICY)
        self.assertEqual(r["effectiveWindowTokens"], 258400)
        self.assertLess(r["recommendedCompactionTriggerTokens"], 244800)
        self.assertIn("configured_trigger_too_late", r["reasons"])

    def test_provider_cap_wins(self):
        d = {"raw_window_tokens": 300000, "effective_context_percentage": 1.0, "provider_hard_limit_tokens": 200000, "response_reserve_tokens": 16000, "current_prompt_tokens": 1000}
        r = cal.evaluate(d, POLICY)
        self.assertEqual(r["effectiveWindowTokens"], 200000)
        self.assertIn("provider_limit_is_effective_cap", r["reasons"])

    def test_over_trigger_status(self):
        d = {"raw_window_tokens": 100000, "effective_context_percentage": 1.0, "response_reserve_tokens": 12000, "current_prompt_tokens": 89000}
        self.assertEqual(cal.evaluate(d, POLICY)["status"], "over_trigger")

    def test_invalid_runway_rejected(self):
        d = {"raw_window_tokens": 10000, "effective_context_percentage": 1.0, "response_reserve_tokens": 12000}
        with self.assertRaises(ValueError):
            cal.evaluate(d, POLICY)

if __name__ == "__main__":
    unittest.main()

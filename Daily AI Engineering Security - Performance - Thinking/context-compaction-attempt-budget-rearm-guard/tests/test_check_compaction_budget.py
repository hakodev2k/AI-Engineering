import unittest

from scripts.check_compaction_budget import analyze


class CompactionBudgetTests(unittest.TestCase):
    def test_verified_progress_rearms_failure_counter(self):
        events = [
            {"type": "compaction_result", "outcome": "failure", "before_tokens": 120, "after_tokens": 120, "threshold_tokens": 100},
            {"type": "compaction_result", "outcome": "success", "before_tokens": 120, "after_tokens": 70, "threshold_tokens": 100},
            {"type": "model_request", "success": True, "prompt_tokens": 75, "threshold_tokens": 100},
            {"type": "compaction_result", "outcome": "failure", "before_tokens": 130, "after_tokens": 130, "threshold_tokens": 100},
        ]
        result = analyze(events, 3)
        self.assertTrue(result["passed"])
        self.assertEqual(result["successful_rearms"], 1)
        self.assertEqual(result["ending_failure_count"], 1)

    def test_no_progress_attempts_remain_bounded(self):
        events = [
            {"type": "compaction_result", "outcome": "failure", "before_tokens": 120, "after_tokens": 120, "threshold_tokens": 100}
            for _ in range(4)
        ]
        result = analyze(events, 3)
        self.assertFalse(result["passed"])
        self.assertEqual(result["violations"][0]["reason"], "failure_budget_exceeded")

    def test_success_without_threshold_clearance_does_not_rearm(self):
        events = [
            {"type": "compaction_result", "outcome": "success", "before_tokens": 150, "after_tokens": 110, "threshold_tokens": 100},
            {"type": "model_request", "success": True, "prompt_tokens": 110, "threshold_tokens": 100},
        ]
        result = analyze(events, 3)
        self.assertTrue(result["passed"])
        self.assertEqual(result["successful_rearms"], 0)
        self.assertEqual(result["ending_failure_count"], 1)

    def test_explicit_rearm_without_progress_is_rejected(self):
        result = analyze([{"type": "budget_rearm"}], 3)
        self.assertFalse(result["passed"])
        self.assertEqual(result["violations"][0]["reason"], "unsafe_rearm_without_pending_progress")

    def test_malformed_token_telemetry_is_rejected(self):
        result = analyze([
            {"type": "compaction_result", "outcome": "success", "before_tokens": "120", "after_tokens": 70, "threshold_tokens": 100}
        ], 3)
        self.assertFalse(result["passed"])
        self.assertEqual(result["violations"][0]["reason"], "invalid_token_telemetry")


if __name__ == "__main__":
    unittest.main()

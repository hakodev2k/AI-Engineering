import unittest
from scripts.retry_budget_guard import classify

POLICY = {
    "max_transient_empty_retries": 2,
    "max_partial_continuations": 1,
    "reasoning_only_length_action": "stop_and_adjust_budget",
    "zero_usage_empty_action": "retry_transient",
    "max_total_model_attempts": 4,
}


def event(**updates):
    base = {
        "finish_reason": "stop",
        "visible_content_chars": 10,
        "tool_call_count": 0,
        "reasoning_tokens": 0,
        "output_tokens": 10,
        "latency_ms": 100,
        "attempt": 0,
        "same_class_retry_count": 0,
    }
    base.update(updates)
    return base


class RetryGuardTests(unittest.TestCase):
    def test_reasoning_only_length_stops_without_retry(self):
        result = classify(event(finish_reason="length", visible_content_chars=0, reasoning_tokens=1000, output_tokens=1000), POLICY)
        self.assertEqual(result["decision"], "stop_and_adjust_budget")
        self.assertFalse(result["retry_recommended"])

    def test_zero_usage_empty_gets_bounded_retry(self):
        result = classify(event(visible_content_chars=0, output_tokens=0, reasoning_tokens=0, same_class_retry_count=0), POLICY)
        self.assertEqual(result["decision"], "retry_transient")
        self.assertTrue(result["retry_recommended"])

    def test_zero_usage_empty_exhausts(self):
        result = classify(event(visible_content_chars=0, output_tokens=0, reasoning_tokens=0, same_class_retry_count=2), POLICY)
        self.assertEqual(result["decision"], "fail")

    def test_partial_length_continues_once(self):
        result = classify(event(finish_reason="length", visible_content_chars=20, output_tokens=1000, same_class_retry_count=0), POLICY)
        self.assertEqual(result["decision"], "continue_partial")

    def test_usable_output_accepted(self):
        self.assertTrue(classify(event(), POLICY)["ok"])

    def test_global_attempt_cap_blocks(self):
        result = classify(event(attempt=4), POLICY)
        self.assertEqual(result["reason"], "total_attempt_budget_exhausted")


if __name__ == "__main__":
    unittest.main()

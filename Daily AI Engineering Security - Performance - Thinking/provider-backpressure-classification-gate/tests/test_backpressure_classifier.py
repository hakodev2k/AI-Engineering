import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "backpressure_classifier.py"
spec = importlib.util.spec_from_file_location("classifier", SCRIPT)
classifier = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(classifier)


class BackpressureClassifierTests(unittest.TestCase):
    def test_local_admission_waits_and_does_not_fallback(self):
        event = {"status": 503, "code": "chat_admission_busy", "retry_after": 1, "attempt": 2, "elapsed_seconds": 3, "max_attempts": 5, "max_elapsed_seconds": 30, "fallback_available": True}
        result = classifier.classify(event)
        self.assertEqual(result["action"], "wait")
        self.assertEqual(result["reason"], "LOCAL_ADMISSION_BACKPRESSURE")
        self.assertEqual(result["delay_seconds"], 1.0)

    def test_provider_capacity_uses_fallback_after_bounded_retry(self):
        event = {"status": 503, "code": "server_overloaded", "attempt": 2, "elapsed_seconds": 5, "max_attempts": 5, "max_elapsed_seconds": 30, "fallback_available": True}
        result = classifier.classify(event)
        self.assertEqual(result["action"], "fallback")
        self.assertEqual(result["reason"], "PROVIDER_CAPACITY")

    def test_burst_limit_requests_smoothing(self):
        event = {"status": 429, "code": "limit_burst_rate", "attempt": 1, "elapsed_seconds": 0, "max_attempts": 5, "max_elapsed_seconds": 60}
        result = classifier.classify(event)
        self.assertEqual(result["action"], "backoff")
        self.assertTrue(result["reduce_concurrency"])

    def test_retry_after_is_honored_for_429(self):
        event = {"status": 429, "code": "rate_limit_exceeded", "retry_after": 7, "attempt": 1, "elapsed_seconds": 0, "max_attempts": 5, "max_elapsed_seconds": 60}
        self.assertEqual(classifier.classify(event)["delay_seconds"], 7.0)

    def test_budget_exhaustion_fails(self):
        event = {"status": 503, "attempt": 4, "elapsed_seconds": 10, "max_attempts": 4, "max_elapsed_seconds": 60, "fallback_available": True}
        result = classifier.classify(event)
        self.assertEqual(result["action"], "fail")
        self.assertEqual(result["reason"], "RECOVERY_BUDGET_EXHAUSTED")

    def test_non_retryable_fails(self):
        event = {"status": 401, "attempt": 1, "elapsed_seconds": 0, "max_attempts": 4, "max_elapsed_seconds": 60}
        self.assertEqual(classifier.classify(event)["reason"], "NON_RETRYABLE")


if __name__ == "__main__":
    unittest.main()

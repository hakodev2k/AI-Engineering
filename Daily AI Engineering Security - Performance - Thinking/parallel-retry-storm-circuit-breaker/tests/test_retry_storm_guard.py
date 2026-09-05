import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "retry_storm_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)

CFG = {
    "window_events": 6,
    "max_retryable_failures": 3,
    "max_total_attempts": 12,
    "open_failure_ratio": 0.5,
    "minimum_retry_delay_ms": 1000,
    "half_open_probe_concurrency": 1,
}


class RetryStormGuardTests(unittest.TestCase):
    def test_healthy_trace_closed(self):
        events = [{"outcome": "success", "retry_delay_ms": 0} for _ in range(4)]
        self.assertEqual("CLOSED", guard.evaluate(CFG, events)["state"])

    def test_some_transient_failure_half_open(self):
        events = [
            {"outcome": "success", "retry_delay_ms": 0},
            {"outcome": "success", "retry_delay_ms": 0},
            {"outcome": "429", "retry_delay_ms": 1500},
        ]
        self.assertEqual("HALF_OPEN", guard.evaluate(CFG, events)["state"])

    def test_correlated_rate_limits_open(self):
        events = [
            {"outcome": "429", "retry_delay_ms": 0},
            {"outcome": "429", "retry_delay_ms": 0},
            {"outcome": "429", "retry_delay_ms": 100},
            {"outcome": "success", "retry_delay_ms": 0},
        ]
        result = guard.evaluate(CFG, events)
        self.assertEqual("OPEN", result["state"])
        self.assertEqual(3, result["retry_delays_below_floor"])

    def test_global_attempt_budget_opens(self):
        events = [{"outcome": "success", "retry_delay_ms": 0} for _ in range(12)]
        self.assertEqual("OPEN", guard.evaluate(CFG, events)["state"])

    def test_auth_error_not_retryable(self):
        events = [{"outcome": "401", "retry_delay_ms": 0}]
        self.assertEqual("CLOSED", guard.evaluate(CFG, events)["state"])


if __name__ == "__main__":
    unittest.main()

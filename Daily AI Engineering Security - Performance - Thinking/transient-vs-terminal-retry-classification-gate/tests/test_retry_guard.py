import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "retry_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


def policy():
    return {
        "max_attempts": 3,
        "max_same_fingerprint": 2,
        "max_elapsed_seconds": 120,
        "retryable_classes": ["timeout", "server_5xx", "connection"],
        "non_retryable_classes": ["auth", "permission", "validation", "policy"],
        "backoff_base_seconds": 1,
        "backoff_max_seconds": 8,
    }


def event(**kw):
    value = {
        "attempt": 1,
        "elapsed_seconds": 3,
        "error_class": "server_5xx",
        "fingerprint": "http-500:upstream",
        "same_fingerprint_count": 1,
        "state_changed_since_last_attempt": False,
    }
    value.update(kw)
    return value


class RetryGuardTests(unittest.TestCase):
    def test_transient_retries(self):
        self.assertEqual("RETRY", guard.evaluate(policy(), event())["verdict"])

    def test_auth_stops(self):
        result = guard.evaluate(policy(), event(error_class="auth"))
        self.assertEqual(("STOP", "non_retryable_class"), (result["verdict"], result["reason"]))

    def test_attempt_budget_stops(self):
        result = guard.evaluate(policy(), event(attempt=3))
        self.assertEqual("attempt_budget_exhausted", result["reason"])

    def test_repeated_no_progress_stops(self):
        result = guard.evaluate(policy(), event(same_fingerprint_count=2))
        self.assertEqual("repeated_error_without_progress", result["reason"])

    def test_state_change_allows_retry_inside_other_budgets(self):
        result = guard.evaluate(policy(), event(same_fingerprint_count=2, state_changed_since_last_attempt=True))
        self.assertEqual("RETRY", result["verdict"])

    def test_unknown_stops(self):
        result = guard.evaluate(policy(), event(error_class="mystery"))
        self.assertEqual("unknown_error_class", result["reason"])

    def test_overlapping_policy_is_invalid(self):
        p = policy(); p["non_retryable_classes"].append("server_5xx")
        self.assertTrue(any("overlap" in x for x in guard.validate_policy(p)))


if __name__ == "__main__":
    unittest.main()

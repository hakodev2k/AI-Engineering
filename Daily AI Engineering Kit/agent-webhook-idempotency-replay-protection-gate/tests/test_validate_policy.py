import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "validate_policy.py"
SPEC = importlib.util.spec_from_file_location("validate_policy", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


def valid_policy():
    return {
        "version": 1,
        "max_clock_skew_seconds": 300,
        "replay_window_seconds": 900,
        "idempotency_ttl_seconds": 86400,
        "require_signature": True,
        "require_timestamp": True,
        "require_event_id": True,
        "allow_unsigned_in_development": False,
        "hash_algorithm": "sha256",
        "signature_header": "X-Signature",
        "timestamp_header": "X-Timestamp",
        "event_id_header": "X-Event-Id",
        "idempotency_key_header": "Idempotency-Key",
        "secret_env_var": "WEBHOOK_SHARED_SECRET",
    }


class PolicyTests(unittest.TestCase):
    def test_valid_policy(self):
        self.assertEqual(MODULE.validate(valid_policy()), [])

    def test_ttl_must_cover_replay_window(self):
        policy = valid_policy()
        policy["idempotency_ttl_seconds"] = 30
        self.assertIn(
            "idempotency_ttl_seconds must be >= replay_window_seconds",
            MODULE.validate(policy),
        )

    def test_unknown_fields_fail_closed(self):
        policy = valid_policy()
        policy["shared_secret"] = "must-not-be-committed"
        self.assertTrue(any(error.startswith("unknown fields:") for error in MODULE.validate(policy)))


if __name__ == "__main__":
    unittest.main()

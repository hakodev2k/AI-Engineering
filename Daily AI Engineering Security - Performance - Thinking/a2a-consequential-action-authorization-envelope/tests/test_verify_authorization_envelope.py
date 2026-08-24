import datetime as dt
import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("verify_auth", ROOT / "scripts" / "verify_authorization_envelope.py")
MOD = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MOD)

HASH_A = "a" * 64
HASH_B = "b" * 64
NOW = dt.datetime(2026, 8, 24, 15, 0, tzinfo=dt.timezone.utc)


def envelope():
    return {
        "authorization_id": "auth-123",
        "caller_id": "agent://caller",
        "receiver_id": "agent://receiver",
        "task_id": "task-1",
        "message_sha256": HASH_A,
        "action": "payments.transfer",
        "parameters_sha256": HASH_B,
        "purpose": "invoice-123",
        "issued_at": "2026-08-24T14:59:00Z",
        "expires_at": "2026-08-24T15:05:00Z",
        "nonce": "0123456789abcdef",
        "max_uses": 1,
    }


def request():
    e = envelope()
    return {k: e[k] for k in MOD.BOUND_FIELDS}


class AuthorizationEnvelopeTests(unittest.TestCase):
    def test_exact_binding_passes(self):
        self.assertTrue(MOD.verify(envelope(), request(), set(), NOW)["verified"])

    def test_parameter_substitution_blocks(self):
        r = request(); r["parameters_sha256"] = "c" * 64
        self.assertFalse(MOD.verify(envelope(), r, set(), NOW)["verified"])

    def test_wrong_receiver_blocks(self):
        r = request(); r["receiver_id"] = "agent://other"
        self.assertFalse(MOD.verify(envelope(), r, set(), NOW)["verified"])

    def test_expired_blocks(self):
        later = dt.datetime(2026, 8, 24, 15, 6, tzinfo=dt.timezone.utc)
        self.assertFalse(MOD.verify(envelope(), request(), set(), later)["verified"])

    def test_consumed_authorization_blocks_replay(self):
        self.assertFalse(MOD.verify(envelope(), request(), {"auth-123"}, NOW)["verified"])

    def test_multi_use_blocks(self):
        e = envelope(); e["max_uses"] = 2
        self.assertFalse(MOD.verify(e, request(), set(), NOW)["verified"])


if __name__ == "__main__":
    unittest.main()

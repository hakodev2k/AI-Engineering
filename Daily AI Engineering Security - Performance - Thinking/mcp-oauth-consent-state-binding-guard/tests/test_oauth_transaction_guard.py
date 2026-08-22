#!/usr/bin/env python3
import json
import subprocess
import tempfile
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "oauth_transaction_guard.py"
POLICY = ROOT / "config" / "policy.json"


def base_record():
    now = int(time.time())
    return {
        "state": "test-state-0123456789",
        "client_id": "client-A",
        "redirect_uri": "http://127.0.0.1:8765/callback",
        "authorization_url": "https://auth.example.test/authorize",
        "pkce_method": "S256",
        "pkce_challenge_hash": "challenge-hash",
        "consent_session_hash": "session-hash",
        "resource": "https://mcp.example.test",
        "scope": "mcp.read",
        "issued_at": now - 10,
        "expires_at": now + 300,
        "loopback_listener_live": True,
        "consumed": False,
        "callback": {
            "state": "test-state-0123456789",
            "client_id": "client-A",
            "redirect_uri": "http://127.0.0.1:8765/callback",
            "pkce_challenge_hash": "challenge-hash",
            "consent_session_hash": "session-hash",
            "resource": "https://mcp.example.test",
            "scope": "mcp.read"
        }
    }


def run(record, phase="callback"):
    with tempfile.TemporaryDirectory() as td:
        p = Path(td) / "record.json"
        p.write_text(json.dumps(record), encoding="utf-8")
        cp = subprocess.run(
            ["python", str(SCRIPT), str(p), "--policy", str(POLICY), "--phase", phase],
            text=True, capture_output=True, check=False
        )
        body = json.loads(cp.stdout) if cp.stdout.strip() else {}
        return cp.returncode, body


class GuardTests(unittest.TestCase):
    def test_legitimate_callback_allowed(self):
        code, body = run(base_record())
        self.assertEqual(0, code)
        self.assertEqual("allow", body["decision"])

    def test_replay_denied(self):
        r = base_record(); r["consumed"] = True
        code, body = run(r)
        self.assertEqual(5, code)
        self.assertIn("state_replay", body["violations"])

    def test_wrong_client_denied(self):
        r = base_record(); r["callback"]["client_id"] = "client-B"
        code, body = run(r)
        self.assertEqual(5, code)
        self.assertIn("client_id_binding_mismatch", body["violations"])

    def test_wrong_session_denied(self):
        r = base_record(); r["callback"]["consent_session_hash"] = "other"
        code, body = run(r)
        self.assertEqual(5, code)
        self.assertIn("consent_session_mismatch", body["violations"])

    def test_dangerous_authorization_url_denied(self):
        r = base_record(); r["authorization_url"] = "javascript:alert(1)"
        code, body = run(r, "authorize")
        self.assertEqual(5, code)
        self.assertIn("dangerous_authorization_scheme", body["violations"])

    def test_missing_loopback_listener_denied(self):
        r = base_record(); r["loopback_listener_live"] = False
        code, body = run(r, "authorize")
        self.assertEqual(5, code)
        self.assertIn("loopback_listener_not_attested", body["violations"])

    def test_redirect_mismatch_denied(self):
        r = base_record(); r["callback"]["redirect_uri"] = "http://127.0.0.1:9999/callback"
        code, body = run(r)
        self.assertEqual(5, code)
        self.assertIn("redirect_uri_mismatch", body["violations"])

    def test_expired_state_denied(self):
        r = base_record(); r["issued_at"] = int(time.time()) - 900; r["expires_at"] = int(time.time()) - 1
        code, body = run(r)
        self.assertEqual(5, code)
        self.assertIn("transaction_expired", body["violations"])

    def test_resource_mismatch_denied(self):
        r = base_record(); r["callback"]["resource"] = "https://other.example.test"
        code, body = run(r)
        self.assertEqual(5, code)
        self.assertIn("resource_binding_mismatch", body["violations"])

    def test_pkce_binding_mismatch_denied(self):
        r = base_record(); r["callback"]["pkce_challenge_hash"] = "different"
        code, body = run(r)
        self.assertEqual(5, code)
        self.assertIn("pkce_binding_mismatch", body["violations"])


if __name__ == "__main__":
    unittest.main()

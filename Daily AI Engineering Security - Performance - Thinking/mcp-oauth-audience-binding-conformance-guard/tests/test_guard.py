#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import json
import os
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "mcp_oauth_guard.py"
spec = importlib.util.spec_from_file_location("mcp_oauth_guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(guard)

with open(ROOT / "config" / "policy.json", encoding="utf-8") as f:
    POLICY = json.load(f)


class GuardTests(unittest.TestCase):
    def test_valid_claims_pass(self):
        claims = {
            "iss": "https://issuer.example.test",
            "aud": "https://mcp.example.test/mcp",
            "exp": 2_000_000_000,
            "scope": "mcp.tools.invoke",
        }
        self.assertEqual(guard.check_token(POLICY, claims, now=1_900_000_000), guard.EXIT_OK)

    def test_sibling_audience_rejected(self):
        claims = {
            "iss": "https://issuer.example.test",
            "aud": "https://sibling.example.test/api",
            "exp": 2_000_000_000,
            "scope": "mcp.tools.invoke",
        }
        self.assertEqual(guard.check_token(POLICY, claims, now=1_900_000_000), guard.EXIT_FAIL)

    def test_multiple_audiences_rejected_when_strict(self):
        claims = {
            "iss": "https://issuer.example.test",
            "aud": ["https://mcp.example.test/mcp", "https://sibling.example.test/api"],
            "exp": 2_000_000_000,
            "scope": "mcp.tools.invoke",
        }
        self.assertEqual(guard.check_token(POLICY, claims, now=1_900_000_000), guard.EXIT_FAIL)

    def test_missing_audience_rejected(self):
        claims = {"iss": "https://issuer.example.test", "exp": 2_000_000_000, "scope": "mcp.tools.invoke"}
        self.assertEqual(guard.check_token(POLICY, claims, now=1_900_000_000), guard.EXIT_FAIL)

    def test_wrong_issuer_rejected(self):
        claims = {
            "iss": "https://evil.example.test",
            "aud": "https://mcp.example.test/mcp",
            "exp": 2_000_000_000,
            "scope": "mcp.tools.invoke",
        }
        self.assertEqual(guard.check_token(POLICY, claims, now=1_900_000_000), guard.EXIT_FAIL)

    def test_expired_rejected(self):
        claims = {
            "iss": "https://issuer.example.test",
            "aud": "https://mcp.example.test/mcp",
            "exp": 1_800_000_000,
            "scope": "mcp.tools.invoke",
        }
        self.assertEqual(guard.check_token(POLICY, claims, now=1_900_000_000), guard.EXIT_FAIL)

    def test_missing_scope_rejected(self):
        claims = {
            "iss": "https://issuer.example.test",
            "aud": "https://mcp.example.test/mcp",
            "exp": 2_000_000_000,
            "scope": "openid",
        }
        self.assertEqual(guard.check_token(POLICY, claims, now=1_900_000_000), guard.EXIT_FAIL)

    def test_authorize_resource_binding(self):
        request = {
            "response_type": "code",
            "resource": "https://mcp.example.test/mcp",
        }
        self.assertEqual(guard.check_request(POLICY, "authorize", request), guard.EXIT_OK)
        request.pop("resource")
        self.assertEqual(guard.check_request(POLICY, "authorize", request), guard.EXIT_FAIL)

    def test_refresh_resource_drift_rejected(self):
        request = {
            "grant_type": "refresh_token",
            "resource": "https://sibling.example.test/api",
        }
        self.assertEqual(guard.check_request(POLICY, "refresh", request), guard.EXIT_FAIL)

    def test_token_passthrough_rejected_without_printing_tokens(self):
        os.environ["TEST_IN"] = "synthetic-inbound-token-value"
        os.environ["TEST_OUT"] = "synthetic-inbound-token-value"
        try:
            self.assertEqual(guard.compare_tokens(POLICY, "TEST_IN", "TEST_OUT"), guard.EXIT_FAIL)
            os.environ["TEST_OUT"] = "separate-upstream-token-value"
            self.assertEqual(guard.compare_tokens(POLICY, "TEST_IN", "TEST_OUT"), guard.EXIT_OK)
        finally:
            os.environ.pop("TEST_IN", None)
            os.environ.pop("TEST_OUT", None)


if __name__ == "__main__":
    unittest.main(verbosity=2)

import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "audience_gate.py"
spec = importlib.util.spec_from_file_location("audience_gate", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)

POLICY = {
    "canonical_resource": "https://mcp.example.com/mcp",
    "allowed_issuers": ["https://issuer.example.com"],
    "allowed_audiences": ["https://mcp.example.com/mcp"],
    "required_scopes_by_operation": {"tools/call": ["tools:execute"]},
    "require_verified_claims": True,
    "require_exact_resource_match": True,
}

BASE = {
    "claims_verified": True,
    "issuer": "https://issuer.example.com",
    "audience": "https://mcp.example.com/mcp",
    "resource": "https://mcp.example.com/mcp",
    "scopes": ["tools:execute"],
    "operation": "tools/call",
}


class AudienceGateTests(unittest.TestCase):
    def test_valid_record_allowed(self):
        result, code = mod.decide(dict(BASE), POLICY)
        self.assertEqual(code, mod.ALLOW)
        self.assertEqual(result["decision"], "allow")

    def test_wrong_resource_denied(self):
        row = dict(BASE)
        row["resource"] = "https://other.example.com/mcp"
        result, code = mod.decide(row, POLICY)
        self.assertEqual(code, mod.DENY)
        self.assertIn("resource_mismatch", result["violations"])

    def test_wrong_audience_denied(self):
        row = dict(BASE)
        row["audience"] = "https://other.example.com/mcp"
        result, code = mod.decide(row, POLICY)
        self.assertEqual(code, mod.DENY)
        self.assertIn("audience_not_allowed", result["violations"])

    def test_unverified_claims_denied(self):
        row = dict(BASE)
        row["claims_verified"] = False
        result, code = mod.decide(row, POLICY)
        self.assertEqual(code, mod.DENY)
        self.assertIn("claims_not_cryptographically_verified", result["violations"])

    def test_missing_scope_denied(self):
        row = dict(BASE)
        row["scopes"] = []
        result, code = mod.decide(row, POLICY)
        self.assertEqual(code, mod.DENY)
        self.assertIn("missing_required_scope", result["violations"])


if __name__ == "__main__":
    unittest.main()

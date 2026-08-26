import unittest
from scripts.authorization_parity_gate import decide

POLICY = {
    "allowed_tools": ["search", "read", "write", "deploy"],
    "high_risk_tools": ["write", "deploy"],
    "require_human_approval_for_high_risk": True,
}

class AuthorizationParityGateTests(unittest.TestCase):
    def test_allowed_tool_passes(self):
        event = {"request_id": "r1", "advertised_tools": ["search"], "requested_tool": "search", "authorization_context_hash": "a", "dispatch_context_hash": "a"}
        self.assertTrue(decide(event, POLICY)["ok"])

    def test_unadvertised_tool_denied(self):
        event = {"request_id": "r2", "advertised_tools": ["search"], "requested_tool": "deploy", "human_approved": True, "authorization_context_hash": "a", "dispatch_context_hash": "a"}
        self.assertFalse(decide(event, POLICY)["ok"])

    def test_high_risk_requires_approval(self):
        event = {"request_id": "r3", "advertised_tools": ["write"], "requested_tool": "write", "authorization_context_hash": "a", "dispatch_context_hash": "a"}
        self.assertFalse(decide(event, POLICY)["ok"])

    def test_context_mismatch_denied(self):
        event = {"request_id": "r4", "advertised_tools": ["search"], "requested_tool": "search", "authorization_context_hash": "a", "dispatch_context_hash": "b"}
        self.assertFalse(decide(event, POLICY)["ok"])

if __name__ == "__main__":
    unittest.main()

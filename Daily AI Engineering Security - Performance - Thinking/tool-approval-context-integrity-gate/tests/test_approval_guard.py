import unittest
from scripts.approval_guard import validate

POLICY = {
    "high_risk_consequences": ["destructive", "financial", "external-write", "deployment", "credential-access"],
    "require_leaf_tool": True,
    "require_parsed_arguments": True,
    "require_consequence_summary_for_high_risk": True,
    "require_destination_for_high_risk": True,
    "max_delegation_depth": 8,
    "deny_unknown_consequence": True,
}

BASE = {
    "tool_call_id": "call-1",
    "leaf_tool": "delete_records",
    "arguments": {"ids": [1, 2]},
    "delegation_chain": ["parent", "records-agent"],
    "consequence": "destructive",
    "consequence_summary": "Deletes 2 records permanently",
    "destination": "records-db",
}

class ApprovalGuardTests(unittest.TestCase):
    def test_request_emits_fingerprint(self):
        r = validate(dict(BASE), POLICY, "request")
        self.assertTrue(r["ok"])
        self.assertEqual(len(r["fingerprint"]), 64)

    def test_execution_requires_exact_fingerprint(self):
        req = validate(dict(BASE), POLICY, "request")
        event = dict(BASE, approved_fingerprint=req["fingerprint"], approval_decision="approve")
        self.assertTrue(validate(event, POLICY, "execute")["ok"])

    def test_argument_drift_is_blocked(self):
        req = validate(dict(BASE), POLICY, "request")
        event = dict(BASE, arguments={"ids": [1, 2, 3]}, approved_fingerprint=req["fingerprint"], approval_decision="approve")
        r = validate(event, POLICY, "execute")
        self.assertFalse(r["ok"])
        self.assertIn("approval_fingerprint_mismatch", r["reasons"])

    def test_missing_raw_context_equivalent_is_blocked(self):
        event = dict(BASE)
        event["arguments"] = None
        self.assertIn("arguments_missing_or_unparsed", validate(event, POLICY, "request")["reasons"])

    def test_hidden_leaf_tool_is_blocked(self):
        event = dict(BASE)
        event["leaf_tool"] = ""
        self.assertIn("missing_leaf_tool", validate(event, POLICY, "request")["reasons"])

if __name__ == "__main__":
    unittest.main()

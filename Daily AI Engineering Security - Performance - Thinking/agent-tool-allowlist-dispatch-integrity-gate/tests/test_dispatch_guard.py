import unittest
from scripts.dispatch_guard import evaluate


class DispatchGuardTests(unittest.TestCase):
    def base(self):
        return {"principal": "agent-a", "request_id": "r1", "capability": "read", "effective_allowlist": ["read"]}

    def test_allowed_capability(self):
        self.assertTrue(evaluate(self.base())["ok"])

    def test_hidden_global_tool_is_denied(self):
        e = self.base(); e["capability"] = "shell"
        self.assertEqual(evaluate(e)["decision"], "deny")

    def test_global_fallback_is_denied(self):
        e = self.base(); e["global_resolver_fallback"] = True
        self.assertFalse(evaluate(e)["ok"])

    def test_delegation_cannot_widen_authority(self):
        e = self.base(); e["delegated_allowlist"] = ["read", "shell"]
        self.assertFalse(evaluate(e)["ok"])

    def test_delegation_must_include_requested_capability(self):
        e = self.base(); e["effective_allowlist"] = ["read", "write"]; e["delegated_allowlist"] = ["write"]
        self.assertFalse(evaluate(e)["ok"])


if __name__ == "__main__":
    unittest.main()

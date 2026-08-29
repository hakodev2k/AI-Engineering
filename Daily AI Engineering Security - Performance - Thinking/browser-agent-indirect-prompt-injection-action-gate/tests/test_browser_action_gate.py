import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "browser_action_gate.py"
spec = importlib.util.spec_from_file_location("browser_action_gate", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)


class BrowserActionGateTests(unittest.TestCase):
    def policy(self):
        p = dict(mod.DEFAULT_POLICY)
        p.update({
            "allowed_domains": ["docs.example.com", "portal.example.com"],
            "sensitive_destinations": ["portal.example.com"],
        })
        return p

    def test_untrusted_send_requires_approval(self):
        action = {"action": "send", "source_trust": "untrusted-content", "destination": "portal.example.com"}
        self.assertEqual(mod.evaluate(action, self.policy())["decision"], "require_approval")

    def test_bound_approval_allows_untrusted_side_effect(self):
        action = {
            "action": "send", "source_trust": "untrusted-content", "destination": "portal.example.com",
            "human_approved": True, "approval_action": "send", "approval_destination": "portal.example.com"
        }
        self.assertEqual(mod.evaluate(action, self.policy())["decision"], "allow")

    def test_mismatched_approval_denied(self):
        action = {
            "action": "send", "source_trust": "untrusted-content", "destination": "portal.example.com",
            "human_approved": True, "approval_action": "navigate", "approval_destination": "portal.example.com"
        }
        report = mod.evaluate(action, self.policy())
        self.assertEqual(report["decision"], "deny")
        self.assertIn("approval_not_bound_to_action_destination", report["reason_codes"])

    def test_sensitive_data_to_unapproved_destination_denied_even_with_approval(self):
        action = {
            "action": "send", "source_trust": "trusted-user", "destination": "evil.example",
            "sensitive_data": True, "human_approved": True, "approval_action": "send", "approval_destination": "evil.example"
        }
        report = mod.evaluate(action, self.policy())
        self.assertEqual(report["decision"], "deny")
        self.assertIn("sensitive_data_destination_not_approved", report["reason_codes"])

    def test_unknown_action_fails_closed(self):
        action = {"action": "run_magic", "source_trust": "trusted-user"}
        self.assertEqual(mod.evaluate(action, self.policy())["decision"], "deny")

    def test_untrusted_local_file_read_requires_approval(self):
        action = {"action": "local_file_read", "source_trust": "untrusted-content"}
        self.assertEqual(mod.evaluate(action, self.policy())["decision"], "require_approval")

    def test_safe_read_allowed(self):
        action = {"action": "read", "source_trust": "untrusted-content", "destination": "docs.example.com"}
        self.assertEqual(mod.evaluate(action, self.policy())["decision"], "allow")


if __name__ == "__main__":
    unittest.main()

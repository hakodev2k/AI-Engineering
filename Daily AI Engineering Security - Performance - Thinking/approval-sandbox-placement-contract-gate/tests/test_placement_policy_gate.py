#!/usr/bin/env python3
import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "placement_policy_gate.py"
spec = importlib.util.spec_from_file_location("placement_policy_gate", SCRIPT)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)

POLICY = {
    "default_approval": "ask",
    "default_placement": "sandbox",
    "fail_closed_on_unknown_broker": True,
    "require_explicit_host_placement": True,
    "preserve_confidentiality_invariants": True,
    "trusted_brokers": {
        "safe-host": {
            "capabilities": ["open_app", "credential_use"],
            "preserves_confidentiality": True,
        }
    },
    "allowed_approval_values": ["allow", "ask", "deny"],
    "allowed_placement_values": ["sandbox", "host-via-broker", "deny"],
    "high_risk_capabilities": ["credential_use", "deploy"],
    "require_human_approval_for_high_risk_broker_actions": True,
}


class PlacementPolicyGateTests(unittest.TestCase):
    def test_allow_does_not_escape_sandbox(self):
        data = {
            "command_id": "safe-read",
            "approval": "allow",
            "placement": "sandbox",
            "denied_read_active": True,
            "confidentiality_invariants": ["secrets-unreadable"],
            "requested_capabilities": [],
        }
        result, code = module.evaluate(data, POLICY)
        self.assertEqual(code, module.ALLOW)
        self.assertEqual(result["effective_placement"], "sandbox")

    def test_host_without_broker_is_blocked(self):
        data = {
            "command_id": "open-app",
            "approval": "allow",
            "placement": "host-via-broker",
            "denied_read_active": True,
            "confidentiality_invariants": ["secrets-unreadable"],
            "requested_capabilities": ["open_app"],
        }
        result, code = module.evaluate(data, POLICY)
        self.assertEqual(code, module.BROKER)
        self.assertEqual(result["decision"], "broker_required")

    def test_unknown_broker_fails_closed(self):
        data = {
            "command_id": "open-app",
            "approval": "allow",
            "placement": "host-via-broker",
            "denied_read_active": False,
            "confidentiality_invariants": [],
            "requested_capabilities": ["open_app"],
            "broker": "unknown",
        }
        result, code = module.evaluate(data, POLICY)
        self.assertEqual(code, module.DENY)
        self.assertEqual(result["decision"], "deny")

    def test_high_risk_broker_requires_bound_human_approval(self):
        data = {
            "command_id": "use-credential",
            "approval": "allow",
            "placement": "host-via-broker",
            "denied_read_active": True,
            "confidentiality_invariants": ["agent-cannot-read-credential"],
            "requested_capabilities": ["credential_use"],
            "broker": "safe-host",
            "human_approval": {"granted": False, "command_id": None},
        }
        result, code = module.evaluate(data, POLICY)
        self.assertEqual(code, module.APPROVAL)
        self.assertEqual(result["decision"], "approval_required")

    def test_trusted_broker_with_bound_approval_is_allowed(self):
        data = {
            "command_id": "use-credential",
            "approval": "allow",
            "placement": "host-via-broker",
            "denied_read_active": True,
            "confidentiality_invariants": ["agent-cannot-read-credential"],
            "requested_capabilities": ["credential_use"],
            "broker": "safe-host",
            "human_approval": {"granted": True, "command_id": "use-credential"},
        }
        result, code = module.evaluate(data, POLICY)
        self.assertEqual(code, module.ALLOW)
        self.assertEqual(result["decision"], "allow_broker")
        self.assertTrue(result["confidentiality_preserved"])

    def test_broker_cannot_exceed_declared_capabilities(self):
        data = {
            "command_id": "deploy",
            "approval": "allow",
            "placement": "host-via-broker",
            "denied_read_active": False,
            "confidentiality_invariants": [],
            "requested_capabilities": ["deploy"],
            "broker": "safe-host",
            "human_approval": {"granted": True, "command_id": "deploy"},
        }
        result, code = module.evaluate(data, POLICY)
        self.assertEqual(code, module.DENY)
        self.assertIn("capabilities", result["reason"])


if __name__ == "__main__":
    unittest.main()

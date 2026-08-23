from __future__ import annotations

import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("gate_tool_call", ROOT / "scripts/gate_tool_call.py")
assert SPEC and SPEC.loader
GATE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(GATE)
POLICY = GATE.validate_policy(json.loads((ROOT / "config/policy.json").read_text(encoding="utf-8")))


def request(request_id: str, tool: str, operation: str, **arguments):
    return GATE.validate_request({
        "request_id": request_id,
        "tool": tool,
        "operation": operation,
        "arguments": arguments,
        "requested_by": "test-agent",
    })


class GateTests(unittest.TestCase):
    def test_safe_repository_read_is_allowed(self):
        result, code = GATE.evaluate(request("r1", "repository", "read-file", path="README.md"), POLICY)
        self.assertEqual(0, code)
        self.assertEqual("allow", result["status"])
        self.assertEqual("allow-repository-read", result["matched_rule_id"])

    def test_unknown_operation_fails_closed(self):
        result, code = GATE.evaluate(request("r2", "mystery", "do-everything"), POLICY)
        self.assertEqual(2, code)
        self.assertEqual("deny", result["status"])
        self.assertIsNone(result["matched_rule_id"])

    def test_shell_execution_requires_approval(self):
        result, code = GATE.evaluate(request("r3", "shell", "execute", command="python -m unittest"), POLICY)
        self.assertEqual(3, code)
        self.assertEqual("approval_required", result["status"])
        self.assertEqual("approval-shell-execution", result["matched_rule_id"])

    def test_valid_approval_allows_approval_rule(self):
        req = request("r4", "shell", "execute", command="python -m unittest")
        approval = {
            "request_id": "r4",
            "rule_id": "approval-shell-execution",
            "decision": "approved",
            "approver": "owner@example.invalid",
            "expires_at": "2099-12-31T23:59:59Z",
        }
        result, code = GATE.evaluate(req, POLICY, approval)
        self.assertEqual(0, code)
        self.assertTrue(result["approval_valid"])

    def test_approval_does_not_override_hard_deny(self):
        req = request("r5", "shell", "execute", command="git reset --hard HEAD~1")
        approval = {
            "request_id": "r5",
            "rule_id": "deny-irrevocable-shell-patterns",
            "decision": "approved",
            "approver": "owner@example.invalid",
            "expires_at": "2099-12-31T23:59:59Z",
        }
        result, code = GATE.evaluate(req, POLICY, approval)
        self.assertEqual(2, code)
        self.assertEqual("deny", result["status"])

    def test_approval_is_bound_to_request(self):
        req = request("r6", "shell", "execute", command="echo hello")
        approval = {
            "request_id": "different",
            "rule_id": "approval-shell-execution",
            "decision": "approved",
            "approver": "owner@example.invalid",
            "expires_at": "2099-12-31T23:59:59Z",
        }
        result, code = GATE.evaluate(req, POLICY, approval)
        self.assertEqual(3, code)
        self.assertFalse(result["approval_valid"])


if __name__ == "__main__":
    unittest.main()

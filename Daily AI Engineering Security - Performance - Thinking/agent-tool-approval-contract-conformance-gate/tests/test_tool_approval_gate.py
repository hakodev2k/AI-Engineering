import unittest

from scripts.tool_approval_gate import evaluate

POLICY = {
    "require_approval_for": ["code_execution", "shell", "credential_access"],
    "require_sandbox_for": ["code_execution", "shell"],
    "enforcing_approval_labels": ["ask", "human", "policy"],
    "weak_approval_labels": ["auto", "never", "none", "bypass"],
}


class ToolApprovalGateTests(unittest.TestCase):
    def test_safe_high_risk_tool_passes(self):
        result = evaluate({"tools": [{"name": "python", "category": "code_execution", "approval_requirement": "ask", "sandboxed": True}]}, POLICY)
        self.assertTrue(result["ok"])

    def test_auto_code_execution_blocks(self):
        result = evaluate({"tools": [{"name": "eval", "category": "code_execution", "approval_requirement": "auto", "sandboxed": True}]}, POLICY)
        self.assertFalse(result["ok"])
        self.assertIn("high_risk_tool_weakens_approval_policy", {x["reason"] for x in result["violations"]})

    def test_unsandboxed_shell_blocks(self):
        result = evaluate({"tools": [{"name": "sh", "category": "shell", "approval_requirement": "ask", "sandboxed": False}]}, POLICY)
        self.assertFalse(result["ok"])
        self.assertIn("high_risk_tool_missing_sandbox", {x["reason"] for x in result["violations"]})

    def test_low_risk_auto_tool_is_allowed(self):
        result = evaluate({"tools": [{"name": "read", "category": "read_only", "approval_requirement": "auto", "sandboxed": False}]}, POLICY)
        self.assertTrue(result["ok"])

    def test_malformed_manifest_raises(self):
        with self.assertRaises(ValueError):
            evaluate({"not_tools": []}, POLICY)


if __name__ == "__main__":
    unittest.main()

import importlib.util
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("gate", ROOT / "scripts" / "prompt_injection_gate.py")
gate_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate_module)

class PromptInjectionGateTests(unittest.TestCase):
    def setUp(self):
        self.policy = gate_module.load_policy(ROOT / "config" / "policy.yaml")

    def test_benign_output_passes(self):
        text = (ROOT / "examples" / "benign-tool-output.txt").read_text(encoding="utf-8")
        result = gate_module.gate(text, "tool_output", self.policy)
        self.assertEqual("pass", result["status"])
        self.assertFalse(result["requires_approval"])
        self.assertEqual([], result["findings"])

    def test_malicious_output_blocks(self):
        text = (ROOT / "examples" / "malicious-tool-output.txt").read_text(encoding="utf-8")
        result = gate_module.gate(text, "web", self.policy)
        self.assertEqual("block", result["status"])
        self.assertTrue(result["requires_approval"])
        self.assertGreaterEqual(len(result["findings"]), 2)

    def test_input_is_clipped(self):
        policy = dict(self.policy)
        policy["max_untrusted_chars"] = 20
        result = gate_module.gate("safe " * 100, "email", policy)
        self.assertLessEqual(len(result["sanitized_text"]), 20)

    def test_policy_has_high_risk_approvals(self):
        approvals = set(self.policy.get("require_human_approval_for", []))
        self.assertIn("secret_access", approvals)
        self.assertIn("destructive_action", approvals)
        self.assertIn("permission_change", approvals)

if __name__ == "__main__":
    unittest.main()

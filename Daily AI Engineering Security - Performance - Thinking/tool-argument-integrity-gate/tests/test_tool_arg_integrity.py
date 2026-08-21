import importlib.util
import pathlib
import unittest

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "tool_arg_integrity.py"
spec = importlib.util.spec_from_file_location("tool_arg_integrity", MODULE)
tai = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(tai)


POLICY = {
    "tools": {
        "remember": {
            "properties": {"content": "string", "reason": "string", "evidence": "string"},
            "required": ["content"],
            "critical": ["reason"],
            "allow_transport_markup": False,
        },
        "markup": {
            "properties": {"content": "string", "note": "string"},
            "required": ["content"],
            "critical": [],
            "allow_transport_markup": True,
        },
    }
}


class ToolArgumentIntegrityTests(unittest.TestCase):
    def test_correlated_swallowed_sibling_blocks(self):
        call = {
            "tool": "remember",
            "arguments": {
                "content": 'hello</content>\n<parameter name="reason">why</parameter>\n</invoke>',
                "reason": None,
                "evidence": None,
            },
        }
        result = tai.inspect_call(call, POLICY)
        self.assertEqual("BLOCK", result["decision"])
        self.assertIn("SWALLOWED_SIBLING", result["reason_codes"])
        self.assertIn("reason", result["missing_declared_fields"])

    def test_missing_critical_blocks_without_residue(self):
        call = {"tool": "remember", "arguments": {"content": "plain", "reason": None}}
        result = tai.inspect_call(call, POLICY)
        self.assertEqual("BLOCK", result["decision"])
        self.assertIn("MISSING_CRITICAL", result["reason_codes"])

    def test_valid_call_allows(self):
        call = {"tool": "remember", "arguments": {"content": "plain", "reason": "because", "evidence": "e1"}}
        self.assertEqual("ALLOW", tai.inspect_call(call, POLICY)["decision"])

    def test_benign_html_does_not_block(self):
        call = {"tool": "remember", "arguments": {"content": "<p>Hello</p>", "reason": "doc", "evidence": None}}
        self.assertEqual("ALLOW", tai.inspect_call(call, POLICY)["decision"])

    def test_transport_markup_exemption_is_narrow(self):
        call = {"tool": "markup", "arguments": {"content": "example </invoke> text", "note": None}}
        self.assertEqual("ALLOW", tai.inspect_call(call, POLICY)["decision"])

    def test_type_mismatch_blocks(self):
        call = {"tool": "remember", "arguments": {"content": ["bad"], "reason": "r"}}
        result = tai.inspect_call(call, POLICY)
        self.assertEqual("BLOCK", result["decision"])
        self.assertIn("TYPE_MISMATCH", result["reason_codes"])

    def test_unknown_tool_policy_is_error(self):
        with self.assertRaises(ValueError):
            tai.inspect_call({"tool": "unknown", "arguments": {}}, POLICY)


if __name__ == "__main__":
    unittest.main()

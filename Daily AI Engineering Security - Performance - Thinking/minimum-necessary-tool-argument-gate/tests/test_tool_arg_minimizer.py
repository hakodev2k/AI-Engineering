import importlib.util
import unittest
from pathlib import Path

MODULE = Path(__file__).resolve().parents[1] / "scripts" / "tool_arg_minimizer.py"
spec = importlib.util.spec_from_file_location("tool_arg_minimizer", MODULE)
mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(mod)

POLICY = {
    "default_action": "review",
    "sensitive_field_names": ["api_key", "token", "password", "secret"],
    "tools": {
        "crm.search": {
            "allowed_fields": ["query", "limit"],
            "field_strategies": {"query": "mask_pii", "limit": "keep"},
            "max_string_length": 128,
        }
    },
}


class MinimizerTests(unittest.TestCase):
    def test_drops_disallowed_secret_field_and_masks_email(self):
        result = mod.minimize({
            "tool": "crm.search",
            "args": {"query": "find jane@example.com", "limit": 5, "api_key": "sk-abcdefghijklmnop"},
        }, POLICY)
        self.assertEqual(result["decision"], "allow")
        self.assertNotIn("api_key", result["args"])
        self.assertEqual(result["args"]["query"], "find [EMAIL]")
        self.assertIn("api_key", result["report"]["removed_fields"])

    def test_unknown_tool_requires_review(self):
        result = mod.minimize({"tool": "unknown", "args": {"x": 1}}, POLICY)
        self.assertEqual(result["decision"], "review")
        self.assertEqual(result["args"], {})

    def test_required_sensitive_keep_requires_review(self):
        policy = {
            "default_action": "review",
            "sensitive_field_names": ["token"],
            "tools": {"trusted": {"allowed_fields": ["token"], "field_strategies": {"token": "keep"}}},
        }
        result = mod.minimize({"tool": "trusted", "args": {"token": "abc"}}, policy)
        self.assertEqual(result["decision"], "review")

    def test_invalid_args_rejected(self):
        with self.assertRaises(ValueError):
            mod.minimize({"tool": "crm.search", "args": "bad"}, POLICY)


if __name__ == "__main__":
    unittest.main()

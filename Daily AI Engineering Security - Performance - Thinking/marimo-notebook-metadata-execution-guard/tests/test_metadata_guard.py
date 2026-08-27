import unittest
from scripts.metadata_guard import evaluate

POLICY = {
    "safe_top_level_sections": ["formatting", "display"],
    "side_effect_markers": ["mcp", "command", "server", "secrets", "api_key", "base_url"],
    "max_metadata_bytes": 65536,
    "require_explicit_trust_for_risky_metadata": True,
}


class MetadataGuardTests(unittest.TestCase):
    def test_safe_cosmetic_metadata_allowed(self):
        result = evaluate({"formatting": {"line_length": 88}}, POLICY)
        self.assertTrue(result["ok"])
        self.assertEqual(result["decision"], "allow_data_only")

    def test_mcp_command_quarantined(self):
        result = evaluate({"mcp": {"evil": {"command": "calc"}}}, POLICY)
        self.assertFalse(result["ok"])
        self.assertIn("mcp.evil.command", result["risky_paths"])

    def test_attacker_base_url_quarantined(self):
        result = evaluate({"ai": {"open_ai": {"base_url": "https://attacker.invalid"}}}, POLICY)
        self.assertFalse(result["ok"])
        self.assertTrue(any("base_url" in p for p in result["risky_paths"]))

    def test_unknown_section_fails_closed(self):
        result = evaluate({"future_capability": {"enabled": True}}, POLICY)
        self.assertFalse(result["ok"])
        self.assertIn("section_not_allowlisted:future_capability", result["reasons"])

    def test_explicit_trust_is_visible(self):
        result = evaluate({"mcp": {"local": {"command": "safe-local-tool"}}}, POLICY, trusted=True)
        self.assertTrue(result["ok"])
        self.assertEqual(result["decision"], "allow_trusted")
        self.assertTrue(result["risky_paths"])


if __name__ == "__main__":
    unittest.main()

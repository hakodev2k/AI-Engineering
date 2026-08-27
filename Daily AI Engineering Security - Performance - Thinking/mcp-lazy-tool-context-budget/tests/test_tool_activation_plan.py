import unittest
from scripts.tool_activation_plan import plan

BUDGET = {"max_schema_tokens": 1000, "max_startup_ms": 300, "minimum_relevance": 0.35, "required_tags": []}


class PlanTests(unittest.TestCase):
    def test_required_tool_is_never_deferred(self):
        inv = {"tools": [
            {"name": "repo", "schema_tokens": 600, "startup_ms": 100, "critical": True, "tags": ["code"], "relevance": 0.1},
            {"name": "browser", "schema_tokens": 300, "startup_ms": 100, "tags": ["web"], "relevance": 0.9},
        ]}
        result = plan(inv, BUDGET, {"required_tools": [], "required_tags": []})
        self.assertTrue(result["ok"])
        self.assertIn("repo", result["active_tools"])

    def test_budget_defers_lower_priority_tool(self):
        inv = {"tools": [
            {"name": "a", "schema_tokens": 500, "startup_ms": 100, "relevance": 0.9},
            {"name": "b", "schema_tokens": 600, "startup_ms": 100, "relevance": 0.8},
        ]}
        result = plan(inv, BUDGET, {"required_tools": [], "required_tags": []})
        self.assertEqual(result["active_tools"], ["a"])
        self.assertEqual(result["deferred_tools"], ["b"])

    def test_required_over_budget_blocks(self):
        inv = {"tools": [{"name": "x", "schema_tokens": 1500, "startup_ms": 20, "critical": True, "relevance": 1.0}]}
        result = plan(inv, BUDGET, {"required_tools": [], "required_tags": []})
        self.assertFalse(result["ok"])
        self.assertIn("required_capabilities_exceed_budget", result["reasons"])

    def test_reports_savings(self):
        inv = {"tools": [
            {"name": "a", "schema_tokens": 400, "startup_ms": 50, "relevance": 0.9},
            {"name": "b", "schema_tokens": 800, "startup_ms": 400, "relevance": 0.2},
        ]}
        result = plan(inv, BUDGET, {"required_tools": [], "required_tags": []})
        self.assertEqual(result["schema_tokens_before"], 1200)
        self.assertGreater(result["schema_tokens_saved"], 0)
        self.assertGreater(result["startup_ms_saved"], 0)


if __name__ == "__main__":
    unittest.main()

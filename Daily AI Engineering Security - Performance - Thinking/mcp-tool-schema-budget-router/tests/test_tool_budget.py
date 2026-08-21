import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from schema_profiler import profile, model_visible, definition_hash
from tool_router import route


class ToolBudgetTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "examples" / "tool-catalog.sample.json").read_text(encoding="utf-8"))
        cls.policy = json.loads((ROOT / "config" / "tool-budget-policy.json").read_text(encoding="utf-8"))

    def test_catalog_is_valid(self):
        report = profile(self.catalog, self.policy)
        self.assertTrue(report["valid"], report["errors"])
        self.assertEqual(5, report["tool_count"])

    def test_repository_task_selects_repo_search(self):
        selected, report = route(self.catalog, "Find the C# symbol that handles repository file search", self.policy)
        names = [tool["name"] for tool in selected["tools"]]
        self.assertIn("repo_search", names)
        self.assertLessEqual(report["selected_estimated_tokens"], self.policy["budgets"]["maxToolSchemaTokens"])

    def test_database_task_selects_database_query(self):
        selected, _ = route(self.catalog, "Query the postgres database table using SQL", self.policy)
        names = [tool["name"] for tool in selected["tools"]]
        self.assertIn("database_query", names)
        self.assertIn("repo_search", names)  # essential

    def test_fallback_is_bounded_and_keeps_essential(self):
        selected, report = route(self.catalog, "unrelated vocabulary", self.policy, fallback=True)
        names = [tool["name"] for tool in selected["tools"]]
        self.assertIn("repo_search", names)
        expected_max = 1 + self.policy["selection"]["fallbackAdditionalTools"]
        self.assertLessEqual(len(names), expected_max)
        self.assertTrue(report["fallback"])

    def test_selected_callable_definitions_are_preserved(self):
        selected, _ = route(self.catalog, "look up jira ticket issue", self.policy)
        original = {tool["name"]: tool for tool in self.catalog["tools"]}
        for routed in selected["tools"]:
            original_visible = model_visible(original[routed["name"]])
            self.assertEqual(original_visible, routed)
            self.assertEqual(definition_hash(original[routed["name"]]), definition_hash(routed))

    def test_essential_over_budget_fails_closed(self):
        policy = json.loads(json.dumps(self.policy))
        policy["budgets"]["maxToolSchemaTokens"] = 1
        with self.assertRaises(RuntimeError):
            route(self.catalog, "anything", policy)

    def test_duplicate_name_is_invalid(self):
        catalog = json.loads(json.dumps(self.catalog))
        catalog["tools"].append(json.loads(json.dumps(catalog["tools"][0])))
        report = profile(catalog, self.policy)
        self.assertFalse(report["valid"])
        self.assertTrue(any("duplicate tool name" in e for e in report["errors"]))


if __name__ == "__main__":
    unittest.main()

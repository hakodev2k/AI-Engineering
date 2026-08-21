import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).parents[1]
SPEC = importlib.util.spec_from_file_location("budget", ROOT / "scripts" / "tool_schema_budget.py")
budget = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(budget)

TOOLS = [
    {"name":"github_search_issues","description":"Search GitHub issues and bug reports","inputSchema":{"type":"object","properties":{"query":{"type":"string"}}}},
    {"name":"calendar_create_event","description":"Create a calendar event with attendees","inputSchema":{"type":"object","properties":{"title":{"type":"string"}}}},
    {"name":"database_query","description":"Run a read-only SQL database query","inputSchema":{"type":"object","properties":{"sql":{"type":"string"}}}},
]

class ToolBudgetTests(unittest.TestCase):
    def setUp(self):
        self.cfg={"max_schema_tokens":1000,"target_schema_tokens":700,"max_selected_tools":2,"min_retrieval_score":0.01,"pinned_tools":[],"ignored_schema_fields":["examples"]}

    def test_audit_deterministic(self):
        self.assertEqual(budget.audit(TOOLS,set()), budget.audit(TOOLS,set()))
        self.assertGreater(budget.audit(TOOLS,set())["estimated_schema_tokens"],0)

    def test_relevant_selection(self):
        selected, report=budget.select_tools(TOOLS,"find GitHub issue about MCP tokens",self.cfg,[])
        self.assertNotIn("error",report)
        self.assertIn("github_search_issues",[t["name"] for t in selected])

    def test_required_tool_preserved(self):
        selected, report=budget.select_tools(TOOLS,"schedule team meeting",self.cfg,["database_query"])
        self.assertNotIn("error",report)
        self.assertIn("database_query",[t["name"] for t in selected])
        self.assertEqual(report["required_tool_recall"],1.0)

    def test_missing_required_blocks(self):
        selected, report=budget.select_tools(TOOLS,"anything",self.cfg,["does_not_exist"])
        self.assertIsNone(selected)
        self.assertIn("error",report)

    def test_zero_overlap_blocks(self):
        cfg=dict(self.cfg); cfg["min_retrieval_score"]=0.5
        selected, report=budget.select_tools(TOOLS,"quantum zoology",cfg,[])
        self.assertEqual(selected,[])
        self.assertIn("error",report)

if __name__=="__main__":
    unittest.main()

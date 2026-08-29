import importlib.util
import pathlib
import unittest

PATH = pathlib.Path(__file__).parents[1] / "scripts" / "tool_loop_guard.py"
spec = importlib.util.spec_from_file_location("guard", PATH)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


class GuardTests(unittest.TestCase):
    def test_blocks_successful_stagnation(self):
        rows = [{"ts": i, "tool": "tool_search", "args": {"q": "github"}, "ok": True, "result": ["same"], "new_tools": []} for i in range(8)]
        r = guard.analyze(rows, 24, 6, 3, 180, {"tool_search"})
        self.assertFalse(r["ok"])
        self.assertIn("stagnation_budget_exceeded", r["reasons"])
        self.assertIn("repeated_query_result", r["reasons"])

    def test_progress_resets_stagnation(self):
        rows = [
            {"ts": 0, "tool": "tool_search", "args": {"q": "a"}, "result": ["x"], "new_tools": []},
            {"ts": 1, "tool": "tool_search", "args": {"q": "b"}, "result": ["tool-x"], "new_tools": ["tool-x"]},
            {"ts": 2, "tool": "tool_search", "args": {"q": "c"}, "result": ["tool-y"], "new_tools": ["tool-y"]},
        ]
        r = guard.analyze(rows, 24, 2, 3, 180, {"tool_search"})
        self.assertTrue(r["ok"])
        self.assertEqual(r["distinct_tools_discovered"], 2)

    def test_time_budget(self):
        rows = [
            {"ts": 0, "tool": "tool_search", "args": {}, "result": 1, "new_tools": ["a"]},
            {"ts": 181, "tool": "tool_search", "args": {"x": 1}, "result": 2, "new_tools": ["b"]},
        ]
        r = guard.analyze(rows, 24, 6, 3, 180, {"tool_search"})
        self.assertIn("time_budget_exceeded", r["reasons"])


if __name__ == "__main__":
    unittest.main()

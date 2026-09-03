import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "render_budget_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)

BUDGETS = {
    "max_renderer_rss_mb": 1200,
    "max_rendered_nodes": 5000,
    "max_p95_frame_ms": 33.4,
    "max_rss_growth_mb_per_100_messages": 120,
    "max_node_growth_per_100_messages": 250,
    "max_regression_percent": 10,
}


def row(messages, rss, nodes, frame):
    return {"messages": messages, "renderer_rss_mb": rss, "rendered_nodes": nodes, "p95_frame_ms": frame}


class RenderBudgetGuardTests(unittest.TestCase):
    def test_bounded_candidate_passes(self):
        measurements = {"baseline": [row(50, 410, 1800, 24), row(250, 760, 4100, 31)], "candidate": [row(50, 390, 1500, 22), row(250, 590, 1900, 27)]}
        self.assertTrue(guard.evaluate(BUDGETS, measurements)["passed"])

    def test_unbounded_node_growth_blocks(self):
        measurements = {"baseline": [row(50, 400, 1500, 20), row(250, 600, 1800, 24)], "candidate": [row(50, 400, 1500, 20), row(250, 700, 4800, 30)]}
        report = guard.evaluate(BUDGETS, measurements)
        self.assertFalse(report["passed"])
        self.assertTrue(any(v["reason"] == "growth_budget" for v in report["violations"]))

    def test_relative_regression_blocks_even_under_absolute_limit(self):
        measurements = {"baseline": [row(50, 300, 1000, 15), row(250, 500, 1500, 20)], "candidate": [row(50, 330, 1050, 16), row(250, 570, 1600, 23)]}
        report = guard.evaluate(BUDGETS, measurements)
        self.assertFalse(report["passed"])
        self.assertTrue(any(v["reason"] == "relative_regression" for v in report["violations"]))

    def test_mismatched_checkpoints_are_invalid(self):
        measurements = {"baseline": [row(50, 300, 1000, 15), row(250, 500, 1500, 20)], "candidate": [row(50, 300, 1000, 15), row(300, 500, 1500, 20)]}
        with self.assertRaises(ValueError):
            guard.evaluate(BUDGETS, measurements)


if __name__ == "__main__":
    unittest.main()

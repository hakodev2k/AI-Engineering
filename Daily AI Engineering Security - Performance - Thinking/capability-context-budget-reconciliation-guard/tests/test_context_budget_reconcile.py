import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import context_budget_reconcile as reconcile


class Tests(unittest.TestCase):
    def test_real_reduction_passes(self):
        baseline = {"total_tokens": 50000, "categories": {"skills": 10000, "system_tools": 20000, "other": 20000}}
        candidate = {"total_tokens": 40000, "categories": {"skills": 1000, "system_tools": 19000, "other": 20000}}
        policy = {"expected_removed_tokens": 9000, "min_effective_reduction_ratio": 0.8, "max_total_tokens": 42000, "max_unrelated_category_growth": 1500}
        self.assertEqual(reconcile.analyze(baseline, candidate, policy)["status"], "pass")

    def test_displacement_fails(self):
        baseline = {"total_tokens": 50000, "categories": {"skills": 10000, "system_tools": 20000, "other": 20000}}
        candidate = {"total_tokens": 50000, "categories": {"skills": 1000, "system_tools": 29000, "other": 20000}}
        policy = {"expected_removed_tokens": 9000, "min_effective_reduction_ratio": 0.8, "max_total_tokens": 52000, "max_unrelated_category_growth": 1000}
        result = reconcile.analyze(baseline, candidate, policy)
        self.assertEqual(result["status"], "regression")
        self.assertIn("category-displacement", {v["kind"] for v in result["violations"]})

    def test_total_budget_fails(self):
        baseline = {"total_tokens": 30000, "categories": {"a": 30000}}
        candidate = {"total_tokens": 31000, "categories": {"a": 31000}}
        policy = {"max_total_tokens": 30000, "max_unrelated_category_growth": 2000}
        self.assertEqual(reconcile.analyze(baseline, candidate, policy)["status"], "regression")


if __name__ == "__main__":
    unittest.main()

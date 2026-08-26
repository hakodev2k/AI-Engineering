import unittest
from scripts.review_scope_gate import evaluate


class ReviewScopeGateTests(unittest.TestCase):
    def state(self):
        return {
            "approved_requirements": ["R1"],
            "review_cycle": 0,
            "max_review_cycles": 2,
            "previous_progress_units": 0,
            "production_progress_units": 1,
            "findings": [],
        }

    def test_valid_in_scope_finding_blocks(self):
        s = self.state()
        s["findings"] = [{"id": "F1", "requirement_id": "R1", "diff_caused": True, "reproducible": True, "evidence": "failing test"}]
        r = evaluate(s)
        self.assertTrue(r["ok"]); self.assertEqual(r["decision"], "rework")

    def test_out_of_scope_finding_is_deferred(self):
        s = self.state()
        s["findings"] = [{"id": "F2", "requirement_id": "R9", "diff_caused": True, "reproducible": True, "evidence": "hypothesis"}]
        r = evaluate(s)
        self.assertEqual(r["decision"], "complete_candidate"); self.assertEqual(len(r["deferred"]), 1)

    def test_non_reproducible_is_deferred(self):
        s = self.state()
        s["findings"] = [{"id": "F3", "requirement_id": "R1", "diff_caused": True, "reproducible": False, "evidence": "speculation"}]
        self.assertEqual(evaluate(s)["decision"], "complete_candidate")

    def test_cycle_budget_stops_loop(self):
        s = self.state(); s["review_cycle"] = 2
        self.assertEqual(evaluate(s)["decision"], "escalate")

    def test_no_progress_without_blocker_stops(self):
        s = self.state(); s["production_progress_units"] = 0
        self.assertEqual(evaluate(s)["decision"], "stop")


if __name__ == "__main__":
    unittest.main()

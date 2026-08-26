import unittest
from scripts.review_scope_gate import arbitrate

CONTRACT = {
    "goal": "Fix timeout handling",
    "criteria": [
        {"id": "AC-1", "text": "Request times out cleanly"},
        {"id": "AC-2", "text": "Existing success path remains green"},
    ],
    "non_goals": ["credential rotation"],
}


class ReviewScopeGateTests(unittest.TestCase):
    def finding(self, **overrides):
        base = {
            "id": "F-1",
            "severity": "major",
            "criterion_id": "AC-1",
            "diff_related": True,
            "reproducible_under_assumptions": True,
            "blocks_acceptance": True,
        }
        base.update(overrides)
        return base

    def test_in_scope_reproducible_blocker_is_accepted(self):
        result = arbitrate(CONTRACT, self.finding())
        self.assertEqual(result["decision"], "accept_blocker")

    def test_unknown_criterion_is_deferred(self):
        result = arbitrate(CONTRACT, self.finding(criterion_id="AC-99"))
        self.assertEqual(result["decision"], "defer")
        self.assertIn("criterion_not_approved", result["reasons"])

    def test_out_of_diff_finding_is_deferred(self):
        result = arbitrate(CONTRACT, self.finding(diff_related=False))
        self.assertEqual(result["decision"], "defer")

    def test_unreproducible_finding_is_deferred(self):
        result = arbitrate(CONTRACT, self.finding(reproducible_under_assumptions=False))
        self.assertEqual(result["decision"], "defer")

    def test_nonblocking_finding_is_deferred(self):
        result = arbitrate(CONTRACT, self.finding(blocks_acceptance=False))
        self.assertEqual(result["decision"], "defer")

    def test_missing_required_field_is_invalid(self):
        finding = self.finding()
        del finding["criterion_id"]
        result = arbitrate(CONTRACT, finding)
        self.assertEqual(result["decision"], "invalid")
        self.assertFalse(result["ok"])


if __name__ == "__main__":
    unittest.main()

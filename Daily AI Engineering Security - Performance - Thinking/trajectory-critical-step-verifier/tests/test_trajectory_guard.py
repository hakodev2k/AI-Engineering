import unittest
from scripts.trajectory_guard import analyze


class TestTrajectoryGuard(unittest.TestCase):
    def test_clean_trace(self):
        rows = [
            {"step": 1, "action": "inspect", "evidence_ids": ["E1"], "assumption_ids": [], "verification_status": "verified", "progress_claim": "working"},
            {"step": 2, "action": "test", "evidence_ids": ["E2"], "assumption_ids": [], "verification_status": "verified", "progress_claim": "complete"}
        ]
        result = analyze(rows, 5)
        self.assertFalse(result["requires_independent_verification"])

    def test_unsupported_completion(self):
        rows = [
            {"step": 1, "action": "edit", "evidence_ids": [], "assumption_ids": [], "verification_status": "unverified", "progress_claim": "complete"}
        ]
        result = analyze(rows, 5)
        self.assertTrue(result["requires_independent_verification"])
        self.assertEqual(result["first_risk_step"], 1)

    def test_unresolved_assumption(self):
        rows = [
            {"step": 1, "action": "plan", "evidence_ids": ["E1"], "assumption_ids": ["A1"], "verification_status": "verified", "progress_claim": "working"}
        ]
        result = analyze(rows, 5)
        self.assertEqual(result["unresolved_assumptions"], ["A1"])

    def test_bounded_unverified_run(self):
        rows = [
            {"step": i, "action": "work", "evidence_ids": [f"E{i}"], "assumption_ids": [], "verification_status": "unverified", "progress_claim": "working"}
            for i in range(1, 4)
        ]
        result = analyze(rows, 2)
        self.assertEqual(result["first_risk_step"], 3)


if __name__ == "__main__":
    unittest.main()

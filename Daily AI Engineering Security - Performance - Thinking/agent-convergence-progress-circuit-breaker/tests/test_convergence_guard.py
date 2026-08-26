import unittest
from scripts.convergence_guard import analyze

POLICY = {
    "max_no_progress_turns": 2,
    "max_work_expansion_without_acceptance_change": 2,
    "require_artifact_or_evidence_delta": True,
    "require_acceptance_row_for_new_work": True,
    "block_finalization_with_open_required_rows": True,
}

class ConvergenceGuardTests(unittest.TestCase):
    def test_converging_run_passes(self):
        rows = [
            {"acceptance_open": 3, "artifact_fingerprint": "a", "evidence_count": 1, "new_work_items": 0, "finalizing": False},
            {"acceptance_open": 2, "artifact_fingerprint": "b", "evidence_count": 2, "new_work_items": 0, "finalizing": False},
            {"acceptance_open": 0, "artifact_fingerprint": "c", "evidence_count": 3, "new_work_items": 0, "finalizing": True},
        ]
        self.assertEqual(analyze(rows, POLICY)["decision"], "pass")

    def test_repeated_no_progress_blocks(self):
        rows = [
            {"acceptance_open": 2, "artifact_fingerprint": "a", "evidence_count": 1, "new_work_items": 0, "finalizing": False},
            {"acceptance_open": 2, "artifact_fingerprint": "a", "evidence_count": 1, "new_work_items": 0, "finalizing": False},
            {"acceptance_open": 2, "artifact_fingerprint": "a", "evidence_count": 1, "new_work_items": 0, "finalizing": False},
            {"acceptance_open": 2, "artifact_fingerprint": "a", "evidence_count": 1, "new_work_items": 0, "finalizing": False},
        ]
        self.assertEqual(analyze(rows, POLICY)["decision"], "block")

    def test_unowned_new_work_blocks(self):
        rows = [{"acceptance_open": 2, "artifact_fingerprint": "a", "evidence_count": 1, "new_work_items": 1, "finalizing": False}]
        self.assertEqual(analyze(rows, POLICY)["decision"], "block")

    def test_owned_new_work_is_allowed(self):
        rows = [{"acceptance_open": 2, "artifact_fingerprint": "a", "evidence_count": 1, "new_work_items": 1, "new_work_acceptance_row": "AC-2", "finalizing": False}]
        self.assertEqual(analyze(rows, POLICY)["decision"], "pass")

    def test_finalizing_with_open_rows_blocks(self):
        rows = [{"acceptance_open": 1, "artifact_fingerprint": "a", "evidence_count": 2, "new_work_items": 0, "finalizing": True}]
        self.assertEqual(analyze(rows, POLICY)["decision"], "block")

if __name__ == "__main__":
    unittest.main()

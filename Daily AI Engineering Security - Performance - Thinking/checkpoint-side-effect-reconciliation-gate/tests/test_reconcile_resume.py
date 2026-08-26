import unittest
from scripts.reconcile_resume import reconcile, stable_hash

POLICY = {
    "allowed_statuses_for_mutation": ["reconciled"],
    "require_human_approval_on_world_ahead": True,
}

class ReconcileTests(unittest.TestCase):
    def test_exact_resume_allows_mutation(self):
        state = {"head": "abc"}
        world = {"sequence": 4, "state": state, "fingerprint": stable_hash(state), "completed_operation_ids": ["op-1"]}
        checkpoint = {"sequence": 4, "expected_world_fingerprint": stable_hash(state), "completed_operation_ids": ["op-1"]}
        result = reconcile(checkpoint, world, [{"operation_id": "op-1", "status": "completed"}], POLICY)
        self.assertTrue(result["mutation_allowed"])

    def test_world_ahead_blocks(self):
        result = reconcile({"sequence": 3}, {"sequence": 4, "state": {}}, [], POLICY)
        self.assertFalse(result["ok"])
        self.assertIn("world_ahead_of_checkpoint", result["reasons"])

    def test_unexplained_side_effect_blocks(self):
        checkpoint = {"sequence": 5, "completed_operation_ids": []}
        world = {"sequence": 5, "state": {}, "completed_operation_ids": ["email-9"]}
        result = reconcile(checkpoint, world, [], POLICY)
        self.assertFalse(result["ok"])
        self.assertTrue(any(x.startswith("unexplained_world_side_effects") for x in result["reasons"]))

    def test_ledger_explains_world_receipt(self):
        checkpoint = {"sequence": 5, "completed_operation_ids": []}
        world = {"sequence": 5, "state": {}, "completed_operation_ids": ["email-9"]}
        ledger = [{"operation_id": "email-9", "status": "completed"}]
        result = reconcile(checkpoint, world, ledger, POLICY)
        self.assertTrue(result["ok"])

    def test_fingerprint_mismatch_blocks(self):
        result = reconcile({"sequence": 1, "expected_world_fingerprint": "x"}, {"sequence": 1, "state": {"a": 1}}, [], POLICY)
        self.assertFalse(result["ok"])
        self.assertIn("world_fingerprint_mismatch", result["reasons"])

if __name__ == "__main__":
    unittest.main()

import unittest
from scripts.compaction_fence import evaluate

class FenceTests(unittest.TestCase):
    def test_allows_confirmed_and_failed(self):
        result = evaluate({"actions": [
            {"action_id": "a", "mutating": True, "state": "confirmed", "evidence": "db:42"},
            {"action_id": "b", "mutating": True, "state": "failed", "evidence": "timeout"},
            {"action_id": "c", "mutating": False, "state": "executing"}
        ]})
        self.assertTrue(result["ok"])
        self.assertEqual(result["decision"], "allow")

    def test_blocks_inflight_mutation(self):
        result = evaluate({"actions": [{"action_id": "a", "mutating": True, "state": "executing"}]})
        self.assertEqual(result["decision"], "defer")
        self.assertIn("a:mutating_in_flight", result["reasons"])

    def test_confirmed_requires_evidence(self):
        result = evaluate({"actions": [{"action_id": "a", "mutating": True, "state": "confirmed"}]})
        self.assertEqual(result["decision"], "defer")

    def test_indeterminate_without_idempotency_escalates(self):
        result = evaluate({"actions": [{"action_id": "a", "mutating": True, "state": "indeterminate"}]})
        self.assertEqual(result["decision"], "escalate")
        self.assertIn("a:non_idempotent_indeterminate", result["escalations"])

    def test_indeterminate_with_idempotency_still_defers(self):
        result = evaluate({"actions": [{"action_id": "a", "mutating": True, "state": "indeterminate", "idempotency_key": "k"}]})
        self.assertEqual(result["decision"], "defer")

if __name__ == "__main__":
    unittest.main()

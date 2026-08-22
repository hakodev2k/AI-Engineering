import unittest
from scripts.saga_gate import evaluate

POLICY={"max_steps":20,"require_idempotency_key":True,"require_compensation_for_side_effects":True}

class SagaGateTests(unittest.TestCase):
    def test_passes_complete_plan(self):
        plan={"saga":"x","steps":[{"name":"a","side_effect":True,"idempotent":True,"compensation":"undo-a","non_compensable_reason":None}]}
        self.assertEqual(evaluate(plan,POLICY)["status"],"pass")

    def test_blocks_non_idempotent_side_effect(self):
        plan={"saga":"x","steps":[{"name":"a","side_effect":True,"idempotent":False,"compensation":"undo-a","non_compensable_reason":None}]}
        self.assertEqual(evaluate(plan,POLICY)["status"],"block")

    def test_blocks_missing_compensation_reason(self):
        plan={"saga":"x","steps":[{"name":"a","side_effect":True,"idempotent":True,"compensation":None,"non_compensable_reason":None}]}
        self.assertEqual(evaluate(plan,POLICY)["status"],"block")

    def test_requires_approval_when_marked(self):
        plan={"saga":"x","steps":[{"name":"a","side_effect":True,"idempotent":True,"compensation":"undo-a","non_compensable_reason":None,"approval_required":True}]}
        self.assertEqual(evaluate(plan,POLICY)["status"],"needs-approval")

if __name__ == '__main__': unittest.main()

import unittest
from scripts.lease_guard import evaluate

POLICY = {"max_lease_seconds":900,"max_actions_per_lease":40,"max_side_effects_per_lease":5,"max_checkpoint_age_seconds":300,"max_evidence_age_seconds":900,"min_progress_delta_for_renewal":1,"max_renewals_without_human_review":2}
BASE = {"now_epoch":100,"lease_started_epoch":0,"lease_expires_epoch":200,"goal_hash":"abc","approved_goal_hash":"abc","actions_in_lease":10,"side_effects_in_lease":1,"checkpoint_age_seconds":30,"evidence_age_seconds":60,"progress_delta":2,"renewal_count":0}

class LeaseGuardTests(unittest.TestCase):
    def test_active_lease_allows(self):
        self.assertEqual(evaluate(dict(BASE), POLICY)["decision"], "allow")
    def test_goal_drift_stops(self):
        s=dict(BASE); s["goal_hash"]="different"
        self.assertIn("goal_mismatch", evaluate(s, POLICY)["reasons"])
    def test_side_effect_budget_stops(self):
        s=dict(BASE); s["side_effects_in_lease"]=6
        self.assertIn("side_effect_budget_exceeded", evaluate(s, POLICY)["reasons"])
    def test_expired_with_progress_can_renew(self):
        s=dict(BASE); s["now_epoch"]=201
        self.assertEqual(evaluate(s, POLICY)["decision"], "renew")
    def test_expired_without_progress_stops(self):
        s=dict(BASE); s["now_epoch"]=201; s["progress_delta"]=0
        self.assertEqual(evaluate(s, POLICY)["decision"], "stop")
    def test_too_many_renewals_requires_human(self):
        s=dict(BASE); s["now_epoch"]=201; s["renewal_count"]=2
        self.assertIn("human_review_required", evaluate(s, POLICY)["reasons"])

if __name__ == "__main__":
    unittest.main()

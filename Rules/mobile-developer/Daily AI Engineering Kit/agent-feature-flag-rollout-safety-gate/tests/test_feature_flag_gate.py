import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "feature_flag_gate.py"
spec = importlib.util.spec_from_file_location("gate", SCRIPT)
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)

POLICY = {
    "protected_environments": ["production"],
    "max_unapproved_percentage": 10,
    "require_approval_for": {"global_enable": True, "flag_delete": True, "rollback_removal": True, "security_weakening": True},
}

def request(**changes):
    value = {"change_id":"C1","flag_key":"x.y","environment":"staging","action":"rollout","current_percentage":0,"target_percentage":10,"rollback":{"available":True,"description":"off"},"security_weakening":False,"approval":None}
    value.update(changes)
    return value

class GateTests(unittest.TestCase):
    def test_staging_small_rollout_needs_no_approval(self):
        self.assertEqual([], gate.approval_required(request(), POLICY))

    def test_production_large_rollout_requires_approval(self):
        reasons = gate.approval_required(request(environment="production", target_percentage=25), POLICY)
        self.assertTrue(reasons)

    def test_delete_requires_approval(self):
        self.assertIn("flag delete", gate.approval_required(request(action="delete"), POLICY))

    def test_missing_rollback_requires_approval(self):
        self.assertIn("rollback unavailable", gate.approval_required(request(rollback={"available":False,"description":"none"}), POLICY))

    def test_approval_must_match_exact_scope(self):
        r = request(environment="production", target_percentage=25)
        r["approval"] = {"change_id":"C1","flag_key":"x.y","environment":"production","target_percentage":10,"approved_by":"owner"}
        self.assertFalse(gate.approval_matches(r))
        r["approval"]["target_percentage"] = 25
        self.assertTrue(gate.approval_matches(r))

    def test_percentage_validation(self):
        self.assertTrue(gate.validate(request(target_percentage=101)))
        self.assertFalse(gate.validate(request()))

if __name__ == "__main__":
    unittest.main()

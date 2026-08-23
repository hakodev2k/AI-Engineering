import importlib.util, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("flaky_gate", ROOT/"scripts/flaky_gate.py")
m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
POLICY={"min_observations":3,"max_test_reruns":3,"recovery_consecutive_passes":5,"protected_test_patterns":["*security*"]}

def evidence(results, test_id="tests.example"):
    return {"test_id":test_id,"revision":"abc","command":"run test","environment":"ci","observations":[{"result":r,"revision":"abc","timestamp":str(i)} for i,r in enumerate(results)]}

class GateTests(unittest.TestCase):
    def test_mixed_is_eligible(self): self.assertEqual(m.evaluate(evidence(["fail","pass","pass"]), POLICY)["status"], "quarantine_eligible")
    def test_all_fail_is_deterministic(self): self.assertEqual(m.evaluate(evidence(["fail","fail","fail"]), POLICY)["status"], "deterministic_failure")
    def test_too_few_is_insufficient(self): self.assertEqual(m.evaluate(evidence(["fail","pass"]), POLICY)["status"], "insufficient_evidence")
    def test_protected_blocks(self): self.assertEqual(m.evaluate(evidence(["fail","pass","pass"], "tests.security.auth"), POLICY)["status"], "protected_test")
    def test_revision_mismatch_rejected(self):
        e=evidence(["fail","pass","pass"]); e["observations"][1]["revision"]="other"
        with self.assertRaises(ValueError): m.evaluate(e, POLICY)
    def test_invalid_policy_rejected(self):
        p=dict(POLICY); p["max_test_reruns"]=0
        with self.assertRaises(ValueError): m.evaluate(evidence(["fail","pass","pass"]), p)

if __name__ == "__main__": unittest.main()

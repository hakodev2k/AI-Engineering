import importlib.util, json, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("gate",ROOT/"scripts"/"quarantine_gate.py")
gate=importlib.util.module_from_spec(spec);spec.loader.exec_module(gate)

class GateTests(unittest.TestCase):
    def setUp(self): self.policy=json.loads((ROOT/"config"/"policy.json").read_text())
    def failure(self,category="deserialization",attempt=1):
        return {"message_id":"m1","source":"q","failure_category":category,"attempt":attempt,"payload":"{}","error_type":"E","error_message":"bad"}
    def test_policy_valid(self): self.assertEqual([],gate.validate_policy(self.policy))
    def test_immediate_quarantine_and_integrity(self):
        e=gate.make_envelope(self.policy,self.failure());self.assertEqual([],gate.verify(self.policy,e));self.assertNotIn("payload",e)
    def test_retryable_not_quarantined_before_budget(self):
        with self.assertRaises(ValueError): gate.make_envelope(self.policy,self.failure("timeout",1))
    def test_exhausted_transient_quarantines(self):
        e=gate.make_envelope(self.policy,self.failure("timeout",4));self.assertEqual([],gate.verify(self.policy,e))
    def test_tamper_detected(self):
        e=gate.make_envelope(self.policy,self.failure());e["attempt"]=9;self.assertIn("integrity_sha256 mismatch",gate.verify(self.policy,e))
    def test_independent_verifier_required(self):
        e=gate.make_envelope(self.policy,self.failure());e["replay"]={"approved":True,"approved_by":"a","verified_by":"a","environment":"production","outcome":"not-attempted"};e["integrity_sha256"]=gate.digest(gate.canonical({k:v for k,v in e.items() if k!="integrity_sha256"}));self.assertIn("independent verified_by required",gate.verify(self.policy,e))
if __name__=="__main__": unittest.main()

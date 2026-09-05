from __future__ import annotations
import importlib.util, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location("gate",ROOT/"scripts/log_redaction_gate.py")
G=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(G)
class GateTests(unittest.TestCase):
    def policy(self): return ["email","bearer_token","authorization_header","ipv4","long_digit_sequence"],["password","session_id"],["example.com","127.0.0.1"],200
    def test_safe_text_passes(self):
        e,f,a,l=self.policy(); r=G.scan("request_id=req_1 client=example.com ip=127.0.0.1 authorization=<redacted>",e,f,a,l); self.assertEqual("pass",r["status"])
    def test_email_detected(self):
        e,f,a,l=self.policy(); r=G.scan("user=bob@example.net",e,f,a,l); self.assertEqual("fail",r["status"]); self.assertTrue(any(x["detector"]=="email" for x in r["findings"]))
    def test_bearer_detected(self):
        e,f,a,l=self.policy(); r=G.scan("Authorization: Bearer abc.def.ghi",e,f,a,l); self.assertEqual("fail",r["status"])
    def test_sensitive_field_detected(self):
        e,f,a,l=self.policy(); r=G.scan("session_id=sess_123",e,f,a,l); self.assertTrue(any(x["detector"]=="sensitive_field" for x in r["findings"]))
    def test_evidence_masks_value(self):
        self.assertNotEqual("alice@example.net",G.mask_evidence("alice@example.net"))
if __name__=="__main__": unittest.main()

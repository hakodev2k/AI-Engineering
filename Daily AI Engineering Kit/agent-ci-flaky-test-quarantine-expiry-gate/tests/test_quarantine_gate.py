import importlib.util, unittest
from datetime import date
from pathlib import Path
R=Path(__file__).resolve().parents[1]
S=importlib.util.spec_from_file_location("gate",R/"scripts/quarantine_gate.py"); G=importlib.util.module_from_spec(S); S.loader.exec_module(G)
P={"max_quarantine_days":14,"max_active_quarantines":2,"require_owner":True,"require_evidence_url":True}
def q(**kw):
    x={"test_id":"t","owner":"team","reason":"intermittent timeout","evidence_url":"https://ci.invalid/1","created":"2026-09-01","expires":"2026-09-10","status":"active"}; x.update(kw); return x
class T(unittest.TestCase):
    def test_valid_active_passes(self): self.assertEqual([],G.validate({"quarantines":[q()]},P,date(2026,9,5)))
    def test_expired_fails(self): self.assertTrue(any("expired" in e for e in G.validate({"quarantines":[q(expires="2026-09-04")]},P,date(2026,9,5))))
    def test_overlong_fails(self): self.assertTrue(any("max_quarantine_days" in e for e in G.validate({"quarantines":[q(expires="2026-09-30")]},P,date(2026,9,5))))
    def test_duplicate_fails(self): self.assertTrue(any("duplicate" in e for e in G.validate({"quarantines":[q(),q()]},P,date(2026,9,5))))
    def test_resolved_expired_does_not_block_expiry(self): self.assertFalse(any("expired" in e for e in G.validate({"quarantines":[q(status="resolved",expires="2026-09-04")]},P,date(2026,9,5))))
if __name__=="__main__": unittest.main()

import importlib.util,unittest
from datetime import datetime,timezone
from pathlib import Path
R=Path(__file__).resolve().parents[1]
S=importlib.util.spec_from_file_location("gate",R/"scripts/quarantine_gate.py"); G=importlib.util.module_from_spec(S); S.loader.exec_module(G)
P={"max_quarantine_days":14,"allowed_statuses":["active","resolved"],"require_owner":True,"require_evidence":True}
def reg(expires="2026-09-10T00:00:00Z",created="2026-09-01T00:00:00Z",status="active"):
    return {"quarantines":[{"test_id":"t","owner":"team","reason":"race","evidence":"ci://1","created_at":created,"expires_at":expires,"status":status}]}
class T(unittest.TestCase):
    def test_valid_active_passes(self):
        r=G.validate(reg(),P,datetime(2026,9,6,tzinfo=timezone.utc)); self.assertEqual("pass",r["status"])
    def test_expired_blocks(self):
        r=G.validate(reg("2026-09-05T00:00:00Z"),P,datetime(2026,9,6,tzinfo=timezone.utc)); self.assertEqual("fail",r["status"]); self.assertEqual("expired",r["findings"][0]["kind"])
    def test_long_window_blocks(self):
        r=G.validate(reg("2026-10-01T00:00:00Z"),P,datetime(2026,9,6,tzinfo=timezone.utc)); self.assertEqual("fail",r["status"])
    def test_duplicate_blocks(self):
        x=reg(); x["quarantines"].append(dict(x["quarantines"][0])); r=G.validate(x,P,datetime(2026,9,6,tzinfo=timezone.utc)); self.assertEqual("fail",r["status"])
    def test_resolved_can_be_past_expiry(self):
        r=G.validate(reg("2026-09-05T00:00:00Z",status="resolved"),P,datetime(2026,9,6,tzinfo=timezone.utc)); self.assertEqual("pass",r["status"])
if __name__=="__main__": unittest.main()

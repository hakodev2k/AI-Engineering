import os, tempfile, unittest
from scripts.idempotency_guard import connect, claim, complete, status

POLICY={"max_attempts":3,"stale_claim_seconds":10,"require_explicit_idempotency_key":True,"allow_stale_reclaim":False,"store_result_inline_max_bytes":16384}
OP={"namespace":"billing","operation":"charge","idempotency_key":"order-123","target":"customer-7"}

class GuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(); self.path=os.path.join(self.tmp.name,"claims.db"); self.db=connect(self.path)
    def tearDown(self):
        self.db.close(); self.tmp.cleanup()
    def test_first_claim_executes(self):
        r=claim(self.db,OP,POLICY,now=100); self.assertTrue(r["ok"]); self.assertEqual(r["decision"],"execute")
    def test_concurrent_replay_waits(self):
        claim(self.db,OP,POLICY,now=100)
        r=claim(self.db,OP,POLICY,now=105); self.assertFalse(r["ok"]); self.assertEqual(r["decision"],"wait")
    def test_completed_replay_reuses_result(self):
        claim(self.db,OP,POLICY,now=100)
        complete(self.db,OP,{"external_id":"ch_1"},POLICY,now=101)
        r=claim(self.db,OP,POLICY,now=102); self.assertEqual(r["decision"],"reuse"); self.assertEqual(r["result"]["external_id"],"ch_1")
    def test_restart_preserves_claim(self):
        claim(self.db,OP,POLICY,now=100); self.db.close(); self.db=connect(self.path)
        r=status(self.db,OP,POLICY); self.assertEqual(r["decision"],"in_progress")
    def test_stale_claim_blocks_by_default(self):
        claim(self.db,OP,POLICY,now=100)
        r=claim(self.db,OP,POLICY,now=200); self.assertFalse(r["ok"]); self.assertEqual(r["reason"],"stale_claim_requires_review")
    def test_missing_identity_rejected(self):
        with self.assertRaises(ValueError): claim(self.db,{"namespace":"x","operation":"y"},POLICY,now=1)

if __name__=="__main__": unittest.main()

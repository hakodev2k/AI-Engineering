import unittest
from scripts.resume_guard import evaluate
BASE={'workflow_id':'wf','checkpoint_id':'cp2','checkpoint_parent_id':'cp1','expected_parent_id':'cp1','operation':{'operation_id':'op','consequential':True,'idempotent':False,'ledger_status':'not_started','external_evidence':False}}
class T(unittest.TestCase):
 def test_not_started(self): self.assertTrue(evaluate(BASE)['ok'])
 def test_completed(self): self.assertFalse(evaluate({**BASE,'operation':{**BASE['operation'],'ledger_status':'confirmed_complete'}})['ok'])
 def test_ambiguous(self): self.assertFalse(evaluate({**BASE,'operation':{**BASE['operation'],'ledger_status':'ambiguous'}})['ok'])
 def test_lineage(self): self.assertIn('checkpoint_lineage_mismatch',evaluate({**BASE,'checkpoint_parent_id':'bad'})['reasons'])
 def test_request(self): self.assertIn('pending_request_id_mismatch',evaluate({**BASE,'pending_request_id':'r1','response_request_id':'r2'})['reasons'])
 def test_failed_before_effect(self): self.assertEqual(evaluate({**BASE,'operation':{**BASE['operation'],'ledger_status':'failed_before_effect'}})['decision'],'allow_execute')
 def test_idempotent_reconcile(self):
  e={**BASE,'operation':{**BASE['operation'],'idempotent':True,'ledger_status':'in_flight','external_evidence':False}}; self.assertFalse(evaluate(e)['ok']); e['operation']['external_evidence']=True; self.assertTrue(evaluate(e)['ok'])
if __name__=='__main__': unittest.main()
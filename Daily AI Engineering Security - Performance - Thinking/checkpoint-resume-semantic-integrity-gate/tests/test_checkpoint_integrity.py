import unittest
from scripts.checkpoint_integrity import validate

class CheckpointIntegrityTests(unittest.TestCase):
    def base_rows(self):
        return [
            {'checkpoint_id':'c1','previous_checkpoint_id':None,'iteration':1,'workflow_signature':'wf-v1','executor_ids':['a','b'],'pending_request_ids':['r1'],'answered_request_ids':[]},
            {'checkpoint_id':'c2','previous_checkpoint_id':'c1','iteration':2,'workflow_signature':'wf-v1','executor_ids':['a','b'],'pending_request_ids':[],'answered_request_ids':['r1']},
            {'checkpoint_id':'c3','previous_checkpoint_id':'c2','iteration':3,'workflow_signature':'wf-v1','executor_ids':['a','b'],'pending_request_ids':['r2'],'answered_request_ids':['r1']},
            {'event':'resume','restored_checkpoint_id':'c2','first_new_checkpoint_id':'c3'},
        ]

    def test_valid_resume_passes(self):
        r=validate(self.base_rows(),'wf-v1',['a','b'])
        self.assertTrue(r['ok'])

    def test_ancestry_break_detected(self):
        rows=self.base_rows(); rows[2]['previous_checkpoint_id']='c1'
        r=validate(rows,'wf-v1',['a','b'])
        self.assertIn('resume_1:ancestry_break',r['violations'])

    def test_executor_drift_detected(self):
        rows=self.base_rows(); rows[2]['executor_ids']=['a','x']
        r=validate(rows,'wf-v1',['a','b'])
        self.assertFalse(r['ok']); self.assertTrue(any('executor_identity' in v for v in r['violations']))

    def test_answered_request_replay_detected(self):
        rows=self.base_rows(); rows[2]['pending_request_ids']=['r1']
        r=validate(rows,'wf-v1',['a','b'])
        self.assertTrue(any('answered_request_replayed' in v or 'pending_answered_overlap' in v for v in r['violations']))

    def test_missing_parent_detected(self):
        rows=self.base_rows(); rows[1]['previous_checkpoint_id']='missing'
        r=validate(rows)
        self.assertIn('missing_parent:c2->missing',r['violations'])

if __name__=='__main__': unittest.main()

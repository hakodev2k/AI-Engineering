import unittest
from scripts.compaction_guard import evaluate

BASE={
 'context_window_tokens':200000,
 'snapshot_tokens':160000,
 'snapshot_provenance':'provider_current_context',
 'utilization_threshold':0.75,
 'critical_state':{'goal':'g','constraints':['c'],'decisions':['d'],'verification_status':'green'},
 'last_call_input_tokens':100000,
 'cumulative_usage_tokens':900000,
}

class GuardTests(unittest.TestCase):
    def test_valid_snapshot_allows(self):
        r=evaluate(dict(BASE)); self.assertTrue(r['ok']); self.assertEqual(r['decision'],'allow_compaction')
    def test_cumulative_provenance_blocks(self):
        e=dict(BASE); e['snapshot_provenance']='cumulative_usage'; e['snapshot_tokens']=900000
        self.assertFalse(evaluate(e)['ok'])
    def test_early_compaction_blocks(self):
        e=dict(BASE); e['snapshot_tokens']=12000
        self.assertIn('below_compaction_threshold',evaluate(e)['reasons'])
    def test_inconsistent_snapshot_blocks(self):
        e=dict(BASE); e['snapshot_tokens']=900000; e['last_call_input_tokens']=100000
        self.assertIn('snapshot_inconsistent_with_last_call',evaluate(e)['reasons'])
    def test_missing_state_blocks(self):
        e=dict(BASE); e['critical_state']={'goal':'g'}
        r=evaluate(e); self.assertFalse(r['ok']); self.assertTrue(any(x.startswith('missing_critical_state:') for x in r['reasons']))

if __name__=='__main__': unittest.main()

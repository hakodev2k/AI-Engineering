import unittest
from scripts.convergence_guard import analyze

POLICY={'warn_repeated_identical':2,'stop_repeated_identical':3,'warn_no_progress':3,'stop_no_progress':5,'stop_scope_growth_streak':4,'max_recovery_cycles':2}

class GuardTests(unittest.TestCase):
    def test_repeated_call_stops(self):
        rows=[{'tool':'read','arguments':{'p':'a'},'progress_key':'x','completed_items':0,'open_items':1} for _ in range(3)]
        r=analyze(rows,POLICY); self.assertEqual(r['decision'],'stop'); self.assertIn('repeated_identical_tool_call',r['reasons'])
    def test_productive_long_trace_continues(self):
        rows=[]
        for i in range(6): rows.append({'tool':'read','arguments':{'p':str(i)},'progress_key':str(i),'completed_items':i,'open_items':6-i})
        r=analyze(rows,POLICY); self.assertEqual(r['decision'],'continue')
    def test_warning_before_stop(self):
        rows=[{'tool':'read','arguments':{'p':'a'},'progress_key':'x','completed_items':0,'open_items':1} for _ in range(2)]
        self.assertEqual(analyze(rows,POLICY)['decision'],'warn')
    def test_scope_growth_stops(self):
        rows=[]
        for i in range(6): rows.append({'tool':'plan','arguments':{'n':i},'progress_key':'same','completed_items':0,'open_items':i})
        r=analyze(rows,POLICY); self.assertEqual(r['decision'],'stop'); self.assertIn('scope_growth_without_completion',r['reasons'])
    def test_empty_trace(self):
        self.assertEqual(analyze([],POLICY)['decision'],'continue')

if __name__=='__main__': unittest.main()

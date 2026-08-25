import importlib.util, unittest
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/'scripts'/'triage_ledger.py'
spec=importlib.util.spec_from_file_location('triage_ledger', SCRIPT)
MODULE=importlib.util.module_from_spec(spec)
spec.loader.exec_module(MODULE)

def valid():
    return {'failing_case':'interactive fails','control_search':{'status':'found','passing_control':'headless passes','evidence':['run.log']},'differences':['surface'],'hypotheses':[{'id':'H1','evidence':['run.log'],'falsification_test':'run same payload headless','status':'open'}],'attempts':[],'max_attempts':3,'verification':{'status':'passed','evidence':['fixed.log'],'control_regression_evidence':['control.log']}}

class LedgerTests(unittest.TestCase):
    def test_valid_repair_passes(self):
        self.assertEqual(MODULE.check(valid(),'repair'),[])

    def test_missing_control_blocks(self):
        d=valid(); d['control_search']={}
        self.assertIn('control_search_incomplete',MODULE.check(d,'repair'))

    def test_unfalsifiable_hypothesis_blocks(self):
        d=valid(); d['hypotheses'][0]['falsification_test']=''
        self.assertIn('hypothesis_0_missing_falsification',MODULE.check(d,'repair'))

    def test_duplicate_attempt_without_new_evidence_blocks(self):
        d=valid(); d['attempts']=[{'hypothesis':'H1','test':'x','new_evidence':['a']},{'hypothesis':'H1','test':'x','new_evidence':[]}]
        findings=MODULE.check(d,'repair')
        self.assertTrue(any(x.startswith('duplicate_attempt_without_evidence_') for x in findings))

    def test_verify_requires_control_regression_evidence(self):
        d=valid(); d['verification']['control_regression_evidence']=[]
        self.assertIn('missing_control_regression_evidence',MODULE.check(d,'verify'))

if __name__=='__main__':
    unittest.main()
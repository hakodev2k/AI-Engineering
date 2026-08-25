import json, subprocess, sys, tempfile, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'triage_ledger.py'

def valid():
    return {'failing_case':'interactive fails','control_search':{'status':'found','passing_control':'headless passes','evidence':['run.log']},'differences':['surface'], 'hypotheses':[{'id':'H1','evidence':['run.log'],'falsification_test':'run same payload headless','status':'open'}], 'attempts':[], 'max_attempts':3, 'verification':{'status':'passed','evidence':['fixed.log'],'control_regression_evidence':['control.log']}}

class LedgerTests(unittest.TestCase):
    def run_gate(self,data,stage):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/'l.json'
            p.write_text(json.dumps(data))
            return subprocess.run([sys.executable,str(SCRIPT),'check','--ledger',str(p),'--stage',stage],capture_output=True,text=True)
    def test_valid_repair_passes(self):
        self.assertEqual(self.run_gate(valid(),'repair').returncode,0)
    def test_missing_control_blocks(self):
        d=valid(); d['control_search']={}
        r=self.run_gate(d,'repair')
        self.assertNotEqual(r.returncode,0)
        self.assertIn('control_search_incomplete',r.stdout)
    def test_unfalsifiable_hypothesis_blocks(self):
        d=valid(); d['hypotheses'][0]['falsification_test']=''
        r=self.run_gate(d,'repair')
        self.assertNotEqual(r.returncode,0)
        self.assertIn('missing_falsification',r.stdout)
    def test_duplicate_attempt_without_new_evidence_blocks(self):
        d=valid()
        d['attempts']=[{'hypothesis':'H1','test':'x','new_evidence':['a']},{'hypothesis':'H1','test':'x','new_evidence':[]}]
        r=self.run_gate(d,'repair')
        self.assertNotEqual(r.returncode,0)
        self.assertIn('duplicate_attempt_without_evidence',r.stdout)
    def test_verify_requires_control_regression_evidence(self):
        d=valid(); d['verification']['control_regression_evidence']=[]
        r=self.run_gate(d,'verify')
        self.assertNotEqual(r.returncode,0)
        self.assertIn('missing_control_regression_evidence',r.stdout)

if __name__=='__main__':
    unittest.main()
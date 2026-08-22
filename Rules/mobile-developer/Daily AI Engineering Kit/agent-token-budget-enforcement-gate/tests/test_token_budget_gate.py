import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts'/'token_budget_gate.py'
POLICY=ROOT/'config'/'policy.yaml'

class GateTests(unittest.TestCase):
    def run_gate(self, usage):
        with tempfile.TemporaryDirectory() as d:
            d=Path(d); u=d/'usage.json'; o=d/'report.json'
            u.write_text(json.dumps(usage),encoding='utf-8')
            p=subprocess.run([sys.executable,str(SCRIPT),'--policy',str(POLICY),'--usage',str(u),'--out',str(o)],capture_output=True,text=True)
            report=json.loads(o.read_text(encoding='utf-8')) if o.exists() else None
            return p.returncode, report

    def test_pass(self):
        code,r=self.run_gate({'task_input_tokens':10000,'planning_tokens':3000,'execution_context_tokens':18000,'verifier_tokens':4000})
        self.assertEqual(code,0); self.assertEqual(r['status'],'pass')

    def test_warn(self):
        code,r=self.run_gate({'task_input_tokens':18000,'planning_tokens':5000,'execution_context_tokens':24000,'verifier_tokens':6000})
        self.assertEqual(code,0); self.assertEqual(r['status'],'warn')

    def test_block_stage(self):
        code,r=self.run_gate({'task_input_tokens':25000,'planning_tokens':1000,'execution_context_tokens':1000,'verifier_tokens':1000})
        self.assertEqual(code,3); self.assertEqual(r['status'],'block')

    def test_invalid(self):
        code,r=self.run_gate({'task_input_tokens':1})
        self.assertEqual(code,2); self.assertIsNone(r)

if __name__=='__main__': unittest.main()

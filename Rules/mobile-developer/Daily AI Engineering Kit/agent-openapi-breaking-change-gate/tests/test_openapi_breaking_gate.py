import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts'/'openapi_breaking_gate.py'
POLICY=ROOT/'config'/'policy.yaml'
BASE=ROOT/'examples'/'baseline.json'
BREAKING=ROOT/'examples'/'candidate-breaking.json'

class GateTests(unittest.TestCase):
    def run_gate(self, baseline, candidate):
        with tempfile.TemporaryDirectory() as d:
            out=Path(d)/'result.json'
            cp=subprocess.run([sys.executable,str(SCRIPT),'--baseline',str(baseline),'--candidate',str(candidate),'--policy',str(POLICY),'--output',str(out)],capture_output=True,text=True)
            return cp.returncode,json.loads(out.read_text(encoding='utf-8'))

    def test_identical_contract_passes(self):
        code,result=self.run_gate(BASE,BASE)
        self.assertEqual(0,code)
        self.assertEqual('pass',result['status'])
        self.assertEqual(0,result['blocking_count'])

    def test_type_change_blocks(self):
        code,result=self.run_gate(BASE,BREAKING)
        self.assertEqual(2,code)
        self.assertEqual('blocked',result['status'])
        self.assertGreater(result['blocking_count'],0)
        self.assertTrue(any(f['type']=='request-property-type-changed' for f in result['findings']))

    def test_missing_input_is_validation_error(self):
        code,result=self.run_gate(ROOT/'examples'/'missing.json',BASE)
        self.assertEqual(3,code)
        self.assertEqual('validation-error',result['status'])
        self.assertTrue(result['errors'])

if __name__=='__main__': unittest.main()

import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts'/'freshness_gate.py'
POLICY=ROOT/'config'/'freshness-policy.yaml'

class FreshnessGateTests(unittest.TestCase):
    def run_gate(self, fixture):
        with tempfile.TemporaryDirectory() as d:
            out=Path(d)/'result.json'
            p=subprocess.run([sys.executable,str(SCRIPT),'--policy',str(POLICY),'--input',str(ROOT/'examples'/fixture),'--output',str(out)],capture_output=True,text=True)
            data=json.loads(out.read_text())
            return p.returncode,data

    def test_pass_fixture(self):
        code,data=self.run_gate('metadata-pass.json')
        self.assertEqual(0,code)
        self.assertEqual('pass',data['status'])
        self.assertEqual(0,data['summary']['stale'])

    def test_block_fixture(self):
        code,data=self.run_gate('metadata-block.json')
        self.assertEqual(1,code)
        self.assertEqual('block',data['status'])
        self.assertGreaterEqual(data['summary']['stale'],1)
        self.assertIn('version-mismatch',data['documents'][0]['reason'])
        self.assertIn('hash-mismatch',data['documents'][0]['reason'])

if __name__=='__main__': unittest.main()

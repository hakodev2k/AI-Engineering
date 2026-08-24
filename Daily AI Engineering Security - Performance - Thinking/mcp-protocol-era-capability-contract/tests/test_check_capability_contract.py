import json, subprocess, sys, tempfile, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'check_capability_contract.py'

class ContractTests(unittest.TestCase):
    def run_case(self, caps, req, era='legacy'):
        with tempfile.TemporaryDirectory() as d:
            s=Path(d)/'s.json'; p=Path(d)/'p.json'
            s.write_text(json.dumps({'session_id':'s1','server_id':'srv','negotiated_version':'2025-11-25','protocol_era':era,'effective_capabilities':caps}),encoding='utf-8')
            p.write_text(json.dumps({'required_capabilities':req}),encoding='utf-8')
            return subprocess.run([sys.executable,str(SCRIPT),str(s),str(p)],capture_output=True,text=True)
    def test_supported_plan_passes(self):
        self.assertEqual(self.run_case(['tools.call','resources.read'],['tools.call']).returncode,0)
    def test_missing_capability_blocks(self):
        r=self.run_case(['tools.call'],['tools.call','tasks.get']); self.assertEqual(r.returncode,2); self.assertIn('tasks.get',r.stdout)
    def test_duplicate_caps_invalid(self):
        self.assertEqual(self.run_case(['tools.call','tools.call'],['tools.call']).returncode,1)

if __name__=='__main__': unittest.main()

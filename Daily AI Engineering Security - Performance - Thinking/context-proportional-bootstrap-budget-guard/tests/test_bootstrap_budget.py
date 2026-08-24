import json, subprocess, sys, tempfile, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/"scripts"/"bootstrap_budget.py"
POLICY=Path(__file__).parents[1]/"config"/"budget-policy.json"

class BudgetTests(unittest.TestCase):
    def run_case(self, manifest, window=8192):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/"manifest.json"; p.write_text(json.dumps(manifest),encoding="utf-8")
            r=subprocess.run([sys.executable,str(SCRIPT),"--context-window",str(window),"--manifest",str(p),"--policy",str(POLICY)],capture_output=True,text=True)
            return r, json.loads(r.stdout) if r.stdout else None
    def required(self, extra=0):
        return [{"name":"security","kind":"security","tokens":200,"required":True},{"name":"auth","kind":"authorization","tokens":150,"required":True},{"name":"task","kind":"task","tokens":300,"required":True},{"name":"output","kind":"output_contract","tokens":150,"required":True},{"name":"tools","kind":"tools","tokens":extra,"required":False,"priority":10}]
    def test_pass(self):
        r,o=self.run_case(self.required(1000)); self.assertEqual(r.returncode,0); self.assertEqual(o["status"],"pass")
    def test_over_budget_blocks(self):
        r,o=self.run_case(self.required(3000)); self.assertEqual(r.returncode,2); self.assertGreater(o["excess_tokens"],0)
    def test_missing_required_kind_blocks(self):
        m=[x for x in self.required() if x["kind"]!="authorization"]
        r,o=self.run_case(m); self.assertEqual(r.returncode,2); self.assertIn("authorization",o["missing_required_kinds"])

if __name__=="__main__": unittest.main()

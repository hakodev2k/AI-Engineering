import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts'/'query_plan_gate.py'

def plan(cost, rows, node='Index Scan', rel='orders'):
    return [{'Plan':{'Node Type':node,'Relation Name':rel,'Total Cost':cost,'Plan Rows':rows,'Actual Rows':rows}}]

class GateTests(unittest.TestCase):
    def run_gate(self,b,c,*extra):
        with tempfile.TemporaryDirectory() as d:
            d=Path(d); bp=d/'b.json'; cp=d/'c.json'; out=d/'out.json'
            bp.write_text(json.dumps(b)); cp.write_text(json.dumps(c))
            p=subprocess.run([sys.executable,str(SCRIPT),'--baseline',str(bp),'--candidate',str(cp),'--output',str(out),*extra],capture_output=True,text=True)
            return p.returncode,json.loads(out.read_text()) if out.exists() else None
    def test_passes_small_change(self):
        code,r=self.run_gate(plan(100,100),plan(110,110),'--forbid-new-seq-scan')
        self.assertEqual(0,code); self.assertEqual('pass',r['status'])
    def test_blocks_cost_regression(self):
        code,r=self.run_gate(plan(100,100),plan(150,100))
        self.assertEqual(1,code); self.assertIn('cost-regression',[x['code'] for x in r['findings']])
    def test_blocks_new_seq_scan(self):
        code,r=self.run_gate(plan(100,100),plan(110,100,'Seq Scan'),'--forbid-new-seq-scan')
        self.assertEqual(1,code); self.assertIn('new-scan',[x['code'] for x in r['findings']])
    def test_blocks_row_regression(self):
        code,r=self.run_gate(plan(100,100),plan(100,250))
        self.assertEqual(1,code); self.assertIn('row-regression',[x['code'] for x in r['findings']])

if __name__=='__main__': unittest.main()

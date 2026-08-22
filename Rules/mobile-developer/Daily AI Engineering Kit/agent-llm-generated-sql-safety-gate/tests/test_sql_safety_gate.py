import json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts/sql_safety_gate.py'; POLICY=ROOT/'config/policy.yaml'

def run(sql,env='development'):
    with tempfile.NamedTemporaryFile('w',suffix='.sql',delete=False,encoding='utf-8') as f: f.write(sql); path=f.name
    p=subprocess.run([sys.executable,str(SCRIPT),'--sql-file',path,'--policy',str(POLICY),'--environment',env],capture_output=True,text=True)
    return p.returncode,json.loads(p.stdout)

class GateTests(unittest.TestCase):
    def test_select_passes(self):
        code,r=run('SELECT id FROM orders WHERE id = 1;')
        self.assertEqual(code,0); self.assertEqual(r['status'],'passed'); self.assertFalse(r['executed'])
    def test_update_without_where_blocks(self):
        code,r=run("UPDATE orders SET status='closed';")
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='MISSING_WHERE' for x in r['findings']))
    def test_scoped_update_requires_approval(self):
        code,r=run("UPDATE orders SET status='closed' WHERE id=1;")
        self.assertEqual(code,4); self.assertEqual(r['status'],'approval_required')
    def test_production_update_blocks(self):
        code,r=run("UPDATE orders SET status='closed' WHERE id=1;",'production')
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='PRODUCTION_WRITE' for x in r['findings']))
    def test_drop_blocks(self):
        code,r=run('DROP TABLE orders;')
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='BLOCKED_KEYWORD' for x in r['findings']))
if __name__=='__main__': unittest.main()

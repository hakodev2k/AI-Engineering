import json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts/scan_ef_queries.py'; POLICY=ROOT/'config/policy.yaml'

def run(code):
    with tempfile.TemporaryDirectory() as d:
        p=Path(d)/'Query.cs'; p.write_text(code,encoding='utf-8')
        r=subprocess.run([sys.executable,str(SCRIPT),'--root',d,'--policy',str(POLICY)],capture_output=True,text=True)
        return r.returncode,json.loads(r.stdout)

class ScanTests(unittest.TestCase):
    def test_bounded_query_passes(self):
        code,r=run('class X { async Task M(){ var x = await db.Users.Where(x=>x.Id==1).ToListAsync(); } }')
        self.assertIn(code,(0,2)); self.assertFalse(any(x['code']=='POSSIBLY_UNBOUNDED_MATERIALIZATION' for x in r['findings']))
    def test_unbounded_tolist_detected(self):
        code,r=run('class X { void M(){ var x = db.Users.ToList(); } }')
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='POSSIBLY_UNBOUNDED_MATERIALIZATION' for x in r['findings']))
    def test_filter_after_materialization_detected(self):
        code,r=run('class X { void M(){ var x = db.Users.ToList().Where(x=>x.Active); } }')
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='FILTER_AFTER_MATERIALIZATION' for x in r['findings']))
    def test_savechanges_in_loop_detected(self):
        code,r=run('class X { void M(){ foreach(var x in xs){ x.Name="a"; db.SaveChanges(); } } }')
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='SAVECHANGES_IN_LOOP' for x in r['findings']))
    def test_migrations_ignored(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'Migrations'; p.mkdir(); (p/'A.cs').write_text('class X { void M(){ var x=db.Users.ToList(); } }')
            r=subprocess.run([sys.executable,str(SCRIPT),'--root',d,'--policy',str(POLICY)],capture_output=True,text=True)
            out=json.loads(r.stdout); self.assertEqual(out['files_scanned'],0)
if __name__=='__main__': unittest.main()

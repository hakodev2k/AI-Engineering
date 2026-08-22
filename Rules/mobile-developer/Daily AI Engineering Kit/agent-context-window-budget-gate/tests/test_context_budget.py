import json, pathlib, subprocess, sys, tempfile, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
class BudgetTests(unittest.TestCase):
 def test_small_file_is_included(self):
  with tempfile.TemporaryDirectory() as d:
   root=pathlib.Path(d); (root/'a.cs').write_text('class A {}',encoding='utf-8'); out=root/'m.json'
   r=subprocess.run([sys.executable,str(ROOT/'scripts/context_budget.py'),'--root',str(root),'--policy',str(ROOT/'config/policy.json'),'--output',str(out),'a.cs'],capture_output=True,text=True)
   self.assertEqual(r.returncode,0,r.stderr); m=json.loads(out.read_text()); self.assertEqual(m['items'][0]['decision'],'include')
 def test_verifier_accepts_example(self):
  r=subprocess.run([sys.executable,str(ROOT/'scripts/verify_manifest.py'),str(ROOT/'examples/context-manifest.json'),'--policy',str(ROOT/'config/policy.json')],capture_output=True,text=True)
  self.assertEqual(r.returncode,0,r.stderr)
if __name__=='__main__': unittest.main()

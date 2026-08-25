import json, subprocess, sys, tempfile, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'workspace_transaction_guard.py'

class GuardTests(unittest.TestCase):
    def run_guard(self, mode, plan):
        p=Path(plan['tmp'])/'plan.json'; data={k:v for k,v in plan.items() if k!='tmp'}; p.write_text(json.dumps(data))
        return subprocess.run([sys.executable,str(SCRIPT),mode,'--plan',str(p)],capture_output=True,text=True)
    def test_verify_blocks_missing_destination(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td); src=root/'src'; src.mkdir(); (src/'a.txt').write_text('x')
            r=self.run_guard('verify',{'tmp':td,'source':str(src),'destination':str(root/'missing'),'operation':'move'})
            self.assertNotEqual(r.returncode,0); self.assertIn('destination_missing',r.stdout)
    def test_verify_accepts_identical_copy(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td); src=root/'src'; dst=root/'dst'; src.mkdir(); dst.mkdir(); (src/'a.txt').write_text('x'); (dst/'a.txt').write_text('x')
            r=self.run_guard('verify',{'tmp':td,'source':str(src),'destination':str(dst),'operation':'move'})
            self.assertEqual(r.returncode,0,r.stdout+r.stderr)
    def test_verify_accepts_single_file_rename(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td); src=root/'old.txt'; dst=root/'new.txt'; src.write_text('x'); dst.write_text('x')
            r=self.run_guard('verify',{'tmp':td,'source':str(src),'destination':str(dst),'operation':'move'})
            self.assertEqual(r.returncode,0,r.stdout+r.stderr)
    def test_preflight_blocks_bound_destination_mismatch(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td); src=root/'a.txt'; src.write_text('x')
            r=self.run_guard('preflight',{'tmp':td,'source':str(src),'destination':str(root/'actual'),'expected_destination_resolved':str(root/'expected'),'operation':'move'})
            self.assertNotEqual(r.returncode,0); self.assertIn('expected_destination_resolved_mismatch',r.stdout)
    def test_verify_blocks_hash_mismatch(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td); src=root/'src'; dst=root/'dst'; src.mkdir(); dst.mkdir(); (src/'a.txt').write_text('x'); (dst/'a.txt').write_text('y')
            r=self.run_guard('verify',{'tmp':td,'source':str(src),'destination':str(dst),'operation':'overwrite'})
            self.assertNotEqual(r.returncode,0); self.assertIn('mismatch:a.txt',r.stdout)

if __name__=='__main__': unittest.main()
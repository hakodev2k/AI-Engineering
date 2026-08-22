import json, subprocess, sys, tempfile, unittest
from pathlib import Path
SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "workspace_fingerprint.py"

class WorkspaceFingerprintTests(unittest.TestCase):
    def run_cmd(self,cwd,*args): return subprocess.run([sys.executable,str(SCRIPT),*args],cwd=cwd,text=True,capture_output=True)
    def git(self,cwd,*args): subprocess.run(["git",*args],cwd=cwd,check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    def make_repo(self,root):
        self.git(root,"init"); self.git(root,"config","user.email","test@example.invalid"); self.git(root,"config","user.name","Test")
        (root/"a.txt").write_text("one\n"); self.git(root,"add","a.txt"); self.git(root,"commit","-m","init")
    def test_match_then_modified_file_drift(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d); self.make_repo(root); baseline=root/".state.json"
            self.assertEqual(self.run_cmd(root,"baseline","--output",str(baseline)).returncode,0)
            self.assertEqual(self.run_cmd(root,"check","--baseline",str(baseline)).returncode,0)
            (root/"a.txt").write_text("two\n")
            self.assertEqual(self.run_cmd(root,"check","--baseline",str(baseline)).returncode,2)
    def test_untracked_file_drift(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d); self.make_repo(root); baseline=root/".state.json"
            self.assertEqual(self.run_cmd(root,"baseline","--output",str(baseline)).returncode,0)
            (root/"new.txt").write_text("new\n")
            p=self.run_cmd(root,"check","--baseline",str(baseline)); self.assertEqual(p.returncode,2)
            self.assertIn("new.txt",json.loads(p.stdout)["changed_paths_now"])

if __name__=="__main__": unittest.main()
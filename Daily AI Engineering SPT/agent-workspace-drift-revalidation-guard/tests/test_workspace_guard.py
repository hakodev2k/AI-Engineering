import json, subprocess, sys, tempfile, unittest
from pathlib import Path

GUARD = Path(__file__).parents[1] / "scripts" / "workspace_guard.py"
POLICY = Path(__file__).parents[1] / "config" / "policy.json"

class GuardTests(unittest.TestCase):
    def setUp(self):
        self.t=tempfile.TemporaryDirectory(); self.root=Path(self.t.name)
        subprocess.run(["git","init"],cwd=self.root,check=True,capture_output=True)
        subprocess.run(["git","config","user.email","test@example.invalid"],cwd=self.root,check=True)
        subprocess.run(["git","config","user.name","Test"],cwd=self.root,check=True)
        (self.root/"a.txt").write_text("one\n")
        subprocess.run(["git","add","a.txt"],cwd=self.root,check=True)
        subprocess.run(["git","commit","-m","init"],cwd=self.root,check=True,capture_output=True)
        self.snap=self.root/"snap.json"
        self.run("capture","--root",str(self.root),"--snapshot",str(self.snap),"--files","a.txt",expect=0)
    def tearDown(self): self.t.cleanup()
    def run(self,*args,expect=None):
        p=subprocess.run([sys.executable,str(GUARD),*args],capture_output=True,text=True)
        if expect is not None: self.assertEqual(expect,p.returncode,p.stdout+p.stderr)
        return p
    def test_clean(self): self.run("check","--root",str(self.root),"--snapshot",str(self.snap),"--policy",str(POLICY),expect=0)
    def test_file_change_requires_revalidation(self):
        (self.root/"a.txt").write_text("two\n")
        p=self.run("check","--root",str(self.root),"--snapshot",str(self.snap),"--policy",str(POLICY),expect=10)
        self.assertIn("file-changed",p.stdout)
    def test_branch_change_hard_stops(self):
        subprocess.run(["git","checkout","-b","other"],cwd=self.root,check=True,capture_output=True)
        self.run("check","--root",str(self.root),"--snapshot",str(self.snap),"--policy",str(POLICY),expect=20)
    def test_missing_file_hard_stops(self):
        (self.root/"a.txt").unlink()
        self.run("check","--root",str(self.root),"--snapshot",str(self.snap),"--policy",str(POLICY),expect=20)
    def test_outside_path_rejected_on_capture(self):
        outside=self.root.parent/"outside-drift-test.txt"; outside.write_text("x")
        try:
            p=self.run("capture","--root",str(self.root),"--snapshot",str(self.root/"x.json"),"--files",str(outside))
            self.assertEqual(30,p.returncode)
        finally: outside.unlink(missing_ok=True)

if __name__=="__main__": unittest.main()

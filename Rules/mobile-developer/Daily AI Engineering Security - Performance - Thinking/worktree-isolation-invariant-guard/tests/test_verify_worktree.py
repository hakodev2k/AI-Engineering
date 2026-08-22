#!/usr/bin/env python3
import pathlib,subprocess,sys,tempfile,unittest
SCRIPT=pathlib.Path(__file__).parents[1]/"scripts"/"verify_worktree.py"
def run(*a,cwd=None): return subprocess.run(a,cwd=cwd,text=True,capture_output=True)
class Tests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory(); self.root=pathlib.Path(self.tmp.name)/"repo"; self.root.mkdir()
  run("git","init",str(self.root)); run("git","-C",str(self.root),"config","user.email","test@example.invalid"); run("git","-C",str(self.root),"config","user.name","Test")
  (self.root/"a.txt").write_text("a",encoding="utf-8"); run("git","-C",str(self.root),"add","."); run("git","-C",str(self.root),"commit","-m","init")
 def tearDown(self): self.tmp.cleanup()
 def test_pass_root_and_path(self):
  b=run("git","-C",str(self.root),"branch","--show-current").stdout.strip(); r=run(sys.executable,str(SCRIPT),"--expected-root",str(self.root),"--expected-branch",b,"--cwd",str(self.root),"--write-path","out.txt"); self.assertEqual(r.returncode,0,r.stdout+r.stderr)
 def test_wrong_root_blocks(self):
  other=pathlib.Path(self.tmp.name)/"other"; other.mkdir(); r=run(sys.executable,str(SCRIPT),"--expected-root",str(other),"--cwd",str(self.root)); self.assertEqual(r.returncode,3,r.stdout+r.stderr)
 def test_path_escape_blocks(self):
  r=run(sys.executable,str(SCRIPT),"--expected-root",str(self.root),"--cwd",str(self.root),"--write-path","../escape.txt"); self.assertEqual(r.returncode,3,r.stdout+r.stderr)
if __name__=="__main__": unittest.main()

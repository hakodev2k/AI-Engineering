import importlib.util,tempfile,unittest
from pathlib import Path
S=Path(__file__).parents[1]/"scripts"/"git_pretrust_guard.py";sp=importlib.util.spec_from_file_location("g",S);g=importlib.util.module_from_spec(sp);sp.loader.exec_module(g)
class T(unittest.TestCase):
 def repo(self,c):
  r=Path(tempfile.mkdtemp());(r/".git").mkdir();(r/".git"/"config").write_text(c,encoding="utf-8");return r
 def test_block(self):
  x=g.inspect(str(self.repo("[core]\nfsmonitor=/tmp/do-not-run\n")));self.assertEqual(x["decision"],"blocked")
 def test_false(self):self.assertEqual(g.inspect(str(self.repo("[core]\nfsmonitor=false\n")))["decision"],"safe")
 def test_true(self):self.assertEqual(g.inspect(str(self.repo("[core]\nfsmonitor=true\n")))["decision"],"safe")
 def test_pointer(self):
  r=Path(tempfile.mkdtemp());m=r/"meta";m.mkdir();(m/"config").write_text("[core]\nfsmonitor=false\n");w=r/"work";w.mkdir();(w/".git").write_text("gitdir: ../meta\n");self.assertEqual(g.inspect(str(w))["decision"],"safe")
 def test_missing(self):
  with self.assertRaises(ValueError):g.inspect(tempfile.mkdtemp())
if __name__=="__main__":unittest.main()

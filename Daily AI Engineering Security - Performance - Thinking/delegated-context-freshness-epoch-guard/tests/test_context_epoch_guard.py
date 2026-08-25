import json, subprocess, sys, tempfile, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'context_epoch_guard.py'
class ContextEpochGuardTests(unittest.TestCase):
  def run_guard(self,*a): return subprocess.run([sys.executable,str(SCRIPT),*a],text=True,capture_output=True)
  def test_fresh_then_drift(self):
    with tempfile.TemporaryDirectory() as td:
      r=Path(td); (r/'CLAUDE.md').write_text('v1'); m=r/'e.json'; self.assertEqual(self.run_guard('snapshot','--root',str(r),'--out',str(m),'CLAUDE.md').returncode,0); p=self.run_guard('check','--root',str(r),'--manifest',str(m),'--json'); self.assertEqual(p.returncode,0); self.assertTrue(json.loads(p.stdout)['fresh']); (r/'CLAUDE.md').write_text('v2'); self.assertEqual(self.run_guard('check','--root',str(r),'--manifest',str(m),'--json').returncode,3)
  def test_missing_to_present(self):
    with tempfile.TemporaryDirectory() as td:
      r=Path(td); m=r/'e.json'; self.assertEqual(self.run_guard('snapshot','--root',str(r),'--out',str(m),'MEMORY.md').returncode,0); (r/'MEMORY.md').write_text('x'); self.assertEqual(self.run_guard('check','--root',str(r),'--manifest',str(m)).returncode,3)
  def test_escape(self):
    with tempfile.TemporaryDirectory() as td:
      r=Path(td); self.assertEqual(self.run_guard('snapshot','--root',str(r),'--out',str(r/'e.json'),'../x').returncode,2)
if __name__=='__main__': unittest.main()

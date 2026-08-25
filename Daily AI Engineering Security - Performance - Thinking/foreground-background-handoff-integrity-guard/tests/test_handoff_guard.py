import json, subprocess, sys, tempfile, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'handoff_guard.py'
class HandoffGuardTests(unittest.TestCase):
  def run_trace(self,rows,*extra):
    with tempfile.TemporaryDirectory() as td:
      p=Path(td)/'trace.jsonl'; p.write_text('\n'.join(json.dumps(r) for r in rows)+'\n')
      return subprocess.run([sys.executable,str(SCRIPT),str(p),'--json',*extra],text=True,capture_output=True)
  def base(self):
    return [{'command_id':'c1','event':'foreground_started','ts':0},{'command_id':'c1','event':'auto_backgrounded','ts':10},{'command_id':'c1','event':'background_ack','ts':11},{'command_id':'c1','event':'poll','ts':12},{'command_id':'c1','event':'completed','ts':20},{'command_id':'c1','event':'notification','ts':21}]
  def test_healthy(self):
    p=self.run_trace(self.base()); self.assertEqual(p.returncode,0); self.assertTrue(json.loads(p.stdout)['healthy'])
  def test_missing_notification(self):
    p=self.run_trace(self.base()[:-1]); self.assertEqual(p.returncode,3); self.assertEqual(json.loads(p.stdout)['metrics']['missing_notification'],1)
  def test_missing_ack_and_terminal(self):
    rows=self.base()[:2]; p=self.run_trace(rows); self.assertEqual(p.returncode,3); m=json.loads(p.stdout)['metrics']; self.assertEqual(m['missing_ack'],1); self.assertEqual(m['missing_terminal'],1)
  def test_duplicate_terminal(self):
    rows=self.base(); rows.insert(-1,{'command_id':'c1','event':'failed','ts':20.5}); p=self.run_trace(rows); self.assertEqual(p.returncode,3); self.assertEqual(json.loads(p.stdout)['metrics']['duplicate_terminal'],1)
  def test_unknown_event_invalid(self):
    p=self.run_trace([{'command_id':'c1','event':'mystery','ts':0}]); self.assertEqual(p.returncode,2)
  def test_no_transition_invalid(self):
    p=self.run_trace([{'command_id':'c1','event':'foreground_started','ts':0}]); self.assertEqual(p.returncode,2)
if __name__=='__main__': unittest.main()

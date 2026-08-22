import json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; SCRIPT=ROOT/'scripts'/'control_context_guard.py'; POLICY=ROOT/'config'/'policy.json'
def run(rows):
    with tempfile.TemporaryDirectory() as td:
        p=Path(td)/'trace.jsonl'; p.write_text('\n'.join(json.dumps(x) for x in rows),encoding='utf-8')
        return subprocess.run([sys.executable,str(SCRIPT),str(p),'--policy',str(POLICY)],capture_output=True,text=True)
def row(i,goal='g1',hashes=None,ack=False,prod=True):
    return {'continuation_id':str(i),'top_level_goal_id':goal,'active_subtask_id':'s1','control_hashes':hashes or [],'ack_only':ack,'productive_action':prod}
class Tests(unittest.TestCase):
    def test_healthy(self):
        r=run([row(i,hashes=[f'h{i}']) for i in range(6)]); self.assertEqual(r.returncode,0,r.stderr)
    def test_duplicate_control_requests_dedup(self):
        r=run([row(i,hashes=['same']) for i in range(5)]); self.assertEqual(r.returncode,3); self.assertEqual(json.loads(r.stdout)['decision'],'deduplicate')
    def test_goal_drift_restores(self):
        r=run([row(1),row(2),row(3,goal='review')]); self.assertEqual(r.returncode,4); self.assertEqual(json.loads(r.stdout)['decision'],'restore_goal')
    def test_low_progress_stops(self):
        r=run([row(i,hashes=[f'h{i}'],prod=False) for i in range(5)]); self.assertEqual(r.returncode,5)
if __name__=='__main__': unittest.main()

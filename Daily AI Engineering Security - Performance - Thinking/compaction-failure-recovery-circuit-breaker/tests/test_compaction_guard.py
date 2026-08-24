import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'compaction_guard.py'
POLICY_DATA = {
  'max_consecutive_failures': 2,
  'max_retry_debris_growth_tokens': 100,
  'require_checkpoint_before_retry': True,
  'events': {'start':'compaction_start','success':'compaction_success','failure':'compaction_failure','checkpoint':'checkpoint_saved','progress':'meaningful_progress','session_end':'session_end'}
}

class GuardTests(unittest.TestCase):
    def run_events(self, events):
        with tempfile.TemporaryDirectory() as td:
            inp = Path(td)/'events.jsonl'; pol = Path(td)/'policy.json'
            inp.write_text(''.join(json.dumps(e)+'\n' for e in events), encoding='utf-8')
            pol.write_text(json.dumps(POLICY_DATA), encoding='utf-8')
            p = subprocess.run([sys.executable,str(SCRIPT),'--input',str(inp),'--policy',str(pol)], text=True, capture_output=True)
            return p.returncode, json.loads(p.stdout)

    def test_two_failures_open_circuit(self):
        events=[
          {'type':'compaction_start'}, {'type':'compaction_failure','retry_debris_tokens':10},
          {'type':'checkpoint_saved'}, {'type':'compaction_start'}, {'type':'compaction_failure','retry_debris_tokens':20}
        ]
        rc,out=self.run_events(events)
        self.assertEqual(rc,2)
        self.assertIn('consecutive-failures-exceeded:2>=2',out['reasons'])

    def test_success_resets_failure_sequence(self):
        events=[
          {'type':'compaction_start'}, {'type':'compaction_failure','retry_debris_tokens':10},
          {'type':'checkpoint_saved'}, {'type':'compaction_start'}, {'type':'compaction_success'},
          {'type':'meaningful_progress'}
        ]
        rc,out=self.run_events(events)
        self.assertEqual(rc,0)
        self.assertEqual(out['decision'],'continue')

    def test_retry_without_checkpoint_blocks(self):
        events=[{'type':'compaction_start'},{'type':'compaction_failure'},{'type':'compaction_start'}]
        rc,out=self.run_events(events)
        self.assertEqual(rc,2)
        self.assertIn('retry-started-without-checkpoint',out['reasons'])

    def test_debris_growth_blocks(self):
        events=[
          {'type':'compaction_start'},{'type':'compaction_failure','retry_debris_tokens':10},
          {'type':'checkpoint_saved'},{'type':'compaction_start'},{'type':'compaction_failure','retry_debris_tokens':500}
        ]
        rc,out=self.run_events(events)
        self.assertEqual(rc,2)
        self.assertTrue(any(r.startswith('retry-debris-growth-exceeded:') for r in out['reasons']))

    def test_session_end_with_unresolved_failure_blocks(self):
        rc,out=self.run_events([{'type':'compaction_start'},{'type':'session_end'}])
        self.assertEqual(rc,2)
        self.assertIn('session-ended-during-unresolved-compaction',out['reasons'])

if __name__ == '__main__':
    unittest.main()

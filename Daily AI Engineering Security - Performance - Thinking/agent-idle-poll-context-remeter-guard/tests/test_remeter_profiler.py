import unittest
from scripts.remeter_profiler import profile

POLICY={
 'wait_events':['wait','wait_agent','list_agents','status'],
 'max_model_visible_polls_per_task':3,
 'max_consecutive_no_change_polls':2,
 'max_cached_tokens_per_no_change_poll':100000,
}

class ProfilerTests(unittest.TestCase):
 def test_healthy_trace(self):
  rows=[
   {'event':'model','input_tokens':1000,'cached_tokens':800,'latency_ms':100,'result':'changed'},
   {'event':'wait_agent','input_tokens':1000,'cached_tokens':900,'latency_ms':50,'result':'timed_out'},
   {'event':'model','input_tokens':1100,'cached_tokens':900,'latency_ms':120,'result':'changed'},
  ]
  r=profile(rows,POLICY); self.assertTrue(r['ok']); self.assertEqual(r['wait_turns'],1)
 def test_poll_budget(self):
  rows=[{'event':'wait','input_tokens':1000,'cached_tokens':900,'latency_ms':10,'result':'timed_out'} for _ in range(4)]
  r=profile(rows,POLICY); self.assertFalse(r['ok']); self.assertIn('poll_budget_exceeded',r['violations'])
 def test_consecutive_no_change(self):
  rows=[{'event':'wait','input_tokens':1000,'cached_tokens':900,'latency_ms':10,'result':'running'} for _ in range(3)]
  r=profile(rows,POLICY); self.assertIn('consecutive_no_change_exceeded',r['violations'])
 def test_cached_token_cap(self):
  rows=[{'event':'wait_agent','input_tokens':150000,'cached_tokens':140000,'latency_ms':10,'result':'timed_out'}]
  r=profile(rows,POLICY); self.assertIn('no_change_cached_token_cap_exceeded',r['violations'])
 def test_duplicate_tool_output(self):
  rows=[
   {'event':'tool','input_tokens':10,'cached_tokens':0,'latency_ms':1,'tool_output_hash':'abc'},
   {'event':'tool','input_tokens':10,'cached_tokens':0,'latency_ms':1,'tool_output_hash':'abc'},
  ]
  self.assertEqual(profile(rows,POLICY)['duplicate_tool_outputs'],1)

if __name__=='__main__': unittest.main()

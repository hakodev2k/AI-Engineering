import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/'scripts'/'check_turn_state.py'
s=importlib.util.spec_from_file_location('c',P); m=importlib.util.module_from_spec(s); s.loader.exec_module(m)
POL={'allowed_terminal_states':['completed','checkpointed','failed'],'resolved_tool_states':['confirmed','failed'],'require_goal_id':True,'require_tool_correlation_id':True}
class T(unittest.TestCase):
 def test_safe(self):
  x={'turn_id':'t','active_goal_id':'g','turn_state':'completed','tools':[{'invocation_id':'i','correlation_id':'c','state':'confirmed'}]}
  self.assertTrue(m.check(x,POL)['safe_to_compact'])
 def test_blocks_inflight(self):
  x={'turn_id':'t','active_goal_id':'g','turn_state':'running','tools':[{'invocation_id':'i','correlation_id':'c','state':'issued'}]}
  r=m.check(x,POL); self.assertFalse(r['safe_to_compact']); self.assertIn('unresolved_tools',r['reasons']); self.assertIn('turn_not_terminal',r['reasons'])
 def test_blocks_missing_correlation(self):
  x={'turn_id':'t','active_goal_id':'g','turn_state':'completed','tools':[{'invocation_id':'i','state':'confirmed'}]}
  self.assertIn('tool_missing_correlation_id',m.check(x,POL)['reasons'])
if __name__=='__main__': unittest.main()

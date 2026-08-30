import importlib.util, unittest
from pathlib import Path
P=Path(__file__).parents[1]/"scripts"/"context_accounting_gate.py"
s=importlib.util.spec_from_file_location("gate",P); m=importlib.util.module_from_spec(s); s.loader.exec_module(m)
B={"reserve_tokens":100,"trusted_occupancy_fields":["last_call_prompt_tokens","stored_context_tokens"],"max_cumulative_to_current_ratio":10,"max_plausible_occupancy_ratio":1.25,"max_low_reclaim_before_break":2}
class Tests(unittest.TestCase):
 def test_cumulative_does_not_trigger(self):
  r=m.evaluate({"context_window":1000,"last_call_prompt_tokens":200,"cumulative_usage_tokens":5000,"fresh_fields":["last_call_prompt_tokens"]},B)
  self.assertEqual(r["decision"],"no_compaction"); self.assertEqual(r["occupancy_tokens"],200)
 def test_real_pressure_allows(self):
  r=m.evaluate({"context_window":1000,"last_call_prompt_tokens":920,"fresh_fields":["last_call_prompt_tokens"]},B)
  self.assertEqual(r["decision"],"allow_compaction")
 def test_stale_deferred(self):
  r=m.evaluate({"context_window":1000,"last_call_prompt_tokens":950,"fresh_fields":[]},B)
  self.assertEqual(r["decision"],"defer")
 def test_circuit_breaker(self):
  r=m.evaluate({"context_window":1000,"last_call_prompt_tokens":950,"fresh_fields":["last_call_prompt_tokens"],"consecutive_low_reclaim_compactions":2},B)
  self.assertEqual(r["decision"],"block")
if __name__=="__main__": unittest.main()

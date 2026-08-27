import unittest
from scripts.context_budget_guard import evaluate

C={"model_context_tokens":1000,"reserved_output_tokens":100,"safety_margin_tokens":50,"max_tool_result_tokens":200,"max_tool_turn_tokens":300,"max_identical_overflow_retries":1,"approx_chars_per_token":4.0}
class T(unittest.TestCase):
    def test_small_outputs_admit(self):
        r=evaluate({"existing_context_tokens":100,"tool_results":[{"tool":"read","content":"a"*100,"tokens":25}]},C); self.assertTrue(r["ok"])
    def test_aggregate_blocks(self):
        r=evaluate({"existing_context_tokens":100,"tool_results":[{"content":"x","tokens":180},{"content":"y","tokens":180}]},C); self.assertFalse(r["ok"]); self.assertIn("aggregate_tool_turn_budget_exceeded",r["reasons"])
    def test_projected_blocks(self):
        r=evaluate({"existing_context_tokens":800,"tool_results":[{"content":"x","tokens":100}]},C); self.assertFalse(r["ok"])
    def test_single_result_blocks(self):
        r=evaluate({"existing_context_tokens":0,"tool_results":[{"content":"x","tokens":250}]},C); self.assertFalse(r["ok"])
    def test_retry_limit(self):
        r=evaluate({"existing_context_tokens":800,"identical_overflow_retries":2,"tool_results":[{"content":"x","tokens":100}]},C); self.assertIn("identical_overflow_retry_limit_exceeded",r["reasons"])
if __name__=="__main__": unittest.main()

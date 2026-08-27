import unittest
from scripts.refill_guard import evaluate

B={"max_post_compaction_fraction":0.35,"max_static_fraction":0.20,"min_cache_read_ratio":0.5,"max_turns_observed":3,"required_sources":["system","task"]}
class Tests(unittest.TestCase):
    def test_pass(self):
        rows=[{"event":"compaction","context_window":1000},{"event":"turn","input_tokens":300,"cache_read_tokens":200,"sources":[{"name":"system","tokens":80,"static":True},{"name":"task","tokens":70,"static":False}]}]
        self.assertTrue(evaluate(rows,B)["ok"])
    def test_static_refill_blocks(self):
        rows=[{"event":"compaction","context_window":1000},{"event":"turn","input_tokens":500,"cache_read_tokens":300,"sources":[{"name":"system","tokens":250,"static":True},{"name":"task","tokens":50}]}]
        self.assertIn("static_context_budget_exceeded",evaluate(rows,B)["reasons"])
    def test_total_refill_blocks(self):
        rows=[{"event":"compaction","context_window":1000},{"event":"turn","input_tokens":600,"cache_read_tokens":400,"sources":[{"name":"system","tokens":100,"static":True},{"name":"task","tokens":300}]}]
        self.assertIn("post_compaction_budget_exceeded",evaluate(rows,B)["reasons"])
    def test_low_cache_blocks(self):
        rows=[{"event":"compaction","context_window":1000},{"event":"turn","input_tokens":300,"cache_read_tokens":20,"sources":[{"name":"system","tokens":80,"static":True},{"name":"task","tokens":70}]}]
        self.assertIn("cache_read_ratio_below_floor",evaluate(rows,B)["reasons"])
if __name__=="__main__": unittest.main()

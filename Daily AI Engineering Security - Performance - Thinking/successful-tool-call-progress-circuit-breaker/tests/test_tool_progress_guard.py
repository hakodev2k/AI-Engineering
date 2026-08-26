import unittest
from scripts.tool_progress_guard import evaluate

class GuardTests(unittest.TestCase):
    def test_canonical_args_replay(self):
        h=[{"tool":"search","args":{"q":"x","limit":5},"status":"success","result":["a"]},{"tool":"search","args":{"limit":5,"q":"x"},"status":"success","result":["a"]}]
        r=evaluate(h,{"tool":"search","args":{"q":"x","limit":5}})
        self.assertEqual(r["decision"],"replay")
    def test_mutating_repeat_blocks(self):
        h=[{"tool":"deploy","args":{"env":"prod"},"status":"success","result":"ok"},{"tool":"deploy","args":{"env":"prod"},"status":"success","result":"ok"}]
        r=evaluate(h,{"tool":"deploy","args":{"env":"prod"}})
        self.assertFalse(r["ok"]); self.assertEqual(r["reason"],"repeated_mutating_call_requires_review")
    def test_first_repeat_executes(self):
        h=[{"tool":"search","args":{"q":"x"},"status":"success","result":[]}]
        self.assertEqual(evaluate(h,{"tool":"search","args":{"q":"x"}})["decision"],"execute")
    def test_progress_stall_blocks(self):
        h=[{"tool":"search","args":{"q":q},"status":"success","progress":{"etag":"same"}} for q in "abc"]
        r=evaluate(h,{"tool":"search","args":{"q":"d"},"expected_progress_key":"etag","last_observed_value":"same"})
        self.assertFalse(r["ok"]); self.assertEqual(r["reason"],"no_progress_threshold_exceeded")
if __name__=="__main__": unittest.main()

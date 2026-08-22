import importlib.util, unittest
from pathlib import Path

P=Path(__file__).parents[1]/"scripts"/"dedupe_tool_calls.py"
s=importlib.util.spec_from_file_location("dedupe",P); m=importlib.util.module_from_spec(s); s.loader.exec_module(m)

class Tests(unittest.TestCase):
    def policy(self): return {"default_policy":"review","tools":{"search":{"policy":"collapse"},"repeat":{"policy":"allow"}},"max_duplicate_group":8}
    def test_reordered_object_keys_collapse(self):
        calls=[{"id":"1","name":"search","args":{"a":1,"b":2}},{"id":"2","name":"search","args":{"b":2,"a":1}}]
        r,c=m.run(calls,self.policy()); self.assertEqual(c,0); self.assertEqual(len(r["retained"]),1); self.assertEqual(len(r["collapsed"]),1)
    def test_array_order_is_distinct(self):
        calls=[{"id":"1","name":"search","args":{"x":[1,2]}},{"id":"2","name":"search","args":{"x":[2,1]}}]
        r,c=m.run(calls,self.policy()); self.assertEqual(c,0); self.assertEqual(len(r["retained"]),2)
    def test_unknown_duplicate_requires_review(self):
        calls=[{"id":"1","name":"write","args":{"x":1}},{"id":"2","name":"write","args":{"x":1}}]
        r,c=m.run(calls,self.policy()); self.assertEqual(c,4); self.assertEqual(len(r["review_required"]),1)
    def test_allow_keeps_duplicates(self):
        calls=[{"id":"1","name":"repeat","args":{}},{"id":"2","name":"repeat","args":{}}]
        r,c=m.run(calls,self.policy()); self.assertEqual(c,0); self.assertEqual(len(r["retained"]),2)

if __name__=="__main__": unittest.main()

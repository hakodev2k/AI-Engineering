import unittest
from scripts.cache_write_guard import analyze

POLICY={
 "minimum_requests_per_group":3,
 "max_write_to_read_ratio":0.75,
 "max_zero_cache_read_fraction":0.5,
 "min_repeated_input_tokens":4096,
 "require_stable_cache_key":True,
 "require_stable_prefix_fingerprint":True,
}

def row(workload,read,write,key="k",prefix="p"):
 return {"workload_id":workload,"input_tokens":5000,"cached_tokens":read,"cache_write_tokens":write,"prompt_cache_key":key,"stable_prefix_fingerprint":prefix}

class T(unittest.TestCase):
 def test_healthy_reuse(self):
  r=analyze([row("a",0,4000),row("a",4000,0),row("a",4000,0)],POLICY)
  self.assertTrue(r["ok"])
 def test_write_amplification(self):
  r=analyze([row("a",0,4000),row("a",0,4000),row("a",500,4000)],POLICY)
  self.assertFalse(r["ok"])
 def test_unstable_key(self):
  r=analyze([row("a",4000,0,"k1"),row("a",4000,0,"k2"),row("a",4000,0,"k1")],POLICY)
  self.assertFalse(r["ok"])
 def test_unstable_prefix(self):
  r=analyze([row("a",4000,0,prefix="p1"),row("a",4000,0,prefix="p2"),row("a",4000,0,prefix="p1")],POLICY)
  self.assertFalse(r["ok"])
 def test_insufficient_evidence_not_failure(self):
  r=analyze([row("a",0,1000)],POLICY)
  self.assertTrue(r["ok"]); self.assertEqual(r["groups"]["a"]["status"],"insufficient_evidence")
if __name__=="__main__": unittest.main()

import unittest
from scripts.cache_churn_guard import analyze

def row(i,read,create,uncached=1000,fp="a",lat=100):
    return {"request_id":str(i),"input_tokens":uncached,"cache_read_input_tokens":read,"cache_creation_input_tokens":create,"latency_ms":lat,"prefix_fingerprint":fp}

class Tests(unittest.TestCase):
    def test_healthy_cache_passes(self):
        r=analyze([row(1,190000,1000),row(2,195000,500)])
        self.assertTrue(r["ok"]); self.assertEqual(r["churn_events"],[])
    def test_repeated_churn_blocks(self):
        r=analyze([row(1,1000,180000),row(2,2000,175000)])
        self.assertFalse(r["ok"]); self.assertEqual(r["worst_consecutive_churn"],2)
    def test_single_churn_is_observed_not_blocked(self):
        r=analyze([row(1,1000,180000),row(2,190000,1000)])
        self.assertTrue(r["ok"]); self.assertEqual(len(r["churn_events"]),1)
    def test_prefix_instability_blocks(self):
        rows=[row(i,190000,1000,fp=str(i)) for i in range(6)]
        self.assertFalse(analyze(rows)["ok"])

if __name__=="__main__": unittest.main()

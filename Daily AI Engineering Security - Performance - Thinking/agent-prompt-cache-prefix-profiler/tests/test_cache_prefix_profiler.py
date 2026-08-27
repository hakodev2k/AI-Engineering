import unittest
from scripts.cache_prefix_profiler import analyze, compare

TH={"min_cache_read_ratio":0.70,"max_cache_creation_ratio":0.25,"max_static_replay_tokens_per_task":5000,"max_latency_regression_pct":5.0,"min_quality_pass_rate":0.98,"max_quality_regression_pct_points":1.0}

def row(task,read,create,tool="t1",system="s1",lat=100,quality=True):
    return {"task_id":task,"input_tokens":1000,"cache_read_tokens":read,"cache_creation_tokens":create,"latency_ms":lat,"tool_fingerprint":tool,"system_fingerprint":system,"static_prefix_tokens":800,"quality_pass":quality}

class ProfilerTests(unittest.TestCase):
    def test_detects_tool_mutation(self):
        r=analyze([row("a",900,50),row("a",100,800,tool="t2")])
        self.assertEqual(r["mutations"][0]["changed"],["tools"])
        self.assertEqual(r["estimated_static_replay_tokens"],800)
    def test_stable_cache_is_healthy(self):
        r=analyze([row("a",850,50),row("a",900,30)])
        self.assertGreater(r["cache_read_ratio"],0.8)
        self.assertEqual(r["estimated_static_replay_tokens"],0)
    def test_comparison_verifies_improvement(self):
        before=[row("a",100,800),row("a",100,800,tool="t2")]
        after=[row("a",850,100),row("a",900,50)]
        self.assertTrue(compare(before,after,TH)["verified"])
    def test_quality_regression_blocks(self):
        before=[row("a",100,800),row("a",100,800,tool="t2")]
        after=[row("a",850,100,quality=False),row("a",900,50)]
        self.assertFalse(compare(before,after,TH)["verified"])

if __name__=="__main__": unittest.main()

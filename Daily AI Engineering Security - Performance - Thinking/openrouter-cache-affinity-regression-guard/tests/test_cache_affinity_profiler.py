import unittest
from scripts.cache_affinity_profiler import analyze, compare

TH={
 "min_calls_for_enforcement":4,
 "min_cache_hit_ratio":0.6,
 "min_cached_token_share":0.5,
 "max_cold_streak":2,
 "require_stable_session_id":True,
 "require_stable_prefix_hash":True,
 "allow_provider_failover_cold_turns":1,
}

def row(session="s1",prefix="p1",cached=800,provider="pA",input_tokens=1000):
    return {"session_id":session,"prefix_hash":prefix,"input_tokens":input_tokens,"cached_tokens":cached,"provider":provider}

class ProfilerTests(unittest.TestCase):
    def test_healthy_trace_passes(self):
        r=analyze([row(cached=0),row(),row(),row()],TH)
        self.assertTrue(r["ok"]); self.assertGreaterEqual(r["cache_hit_ratio"],0.6)
    def test_unstable_session_fails(self):
        r=analyze([row(session="s1"),row(session="s2"),row(session="s3"),row(session="s4")],TH)
        self.assertFalse(r["ok"]); self.assertIn("session_id_unstable",r["violations"])
    def test_unstable_prefix_fails(self):
        r=analyze([row(prefix="p1"),row(prefix="p2"),row(prefix="p3"),row(prefix="p4")],TH)
        self.assertFalse(r["ok"]); self.assertIn("prefix_hash_unstable",r["violations"])
    def test_low_cache_share_fails(self):
        r=analyze([row(cached=0),row(cached=0),row(cached=100),row(cached=100)],TH)
        self.assertFalse(r["ok"]); self.assertIn("cached_token_share_below_threshold",r["violations"])
    def test_one_failover_cold_turn_tolerated(self):
        rows=[row(cached=800,provider="pA"),row(cached=0,provider="pB"),row(cached=0,provider="pB"),row(cached=800,provider="pB"),row(cached=800,provider="pB")]
        r=analyze(rows,TH)
        self.assertNotIn("cold_streak_exceeded",r["violations"])
    def test_compare_reports_reduction(self):
        b=analyze([row(cached=0) for _ in range(4)],{**TH,"min_cache_hit_ratio":0,"min_cached_token_share":0,"max_cold_streak":99})
        c=analyze([row(cached=800) for _ in range(4)],TH)
        self.assertGreater(compare(b,c)["fresh_input_token_reduction"],0.7)

if __name__=="__main__": unittest.main()

import unittest
from scripts.compaction_guard import analyze

POLICY={
 "max_compactions_per_100_turns":10,
 "min_turns_between_compactions":5,
 "max_repeated_static_tokens_per_turn":12000,
 "min_cache_read_ratio":0.4,
 "max_cache_creation_ratio":0.5,
 "max_reported_to_live_ratio":1.4,
 "max_compaction_attempts_without_progress":2,
 "progress_events":["user_result","test_pass","artifact_saved","task_checkpoint"]
}

def row(turn,event="model",input_tokens=1000,read=700,create=200,live=1000,reported=1000,static=1000):
    return {"turn":turn,"event":event,"input_tokens":input_tokens,"cache_read_tokens":read,"cache_creation_tokens":create,"live_context_tokens":live,"reported_context_tokens":reported,"static_tokens":static}

class GuardTests(unittest.TestCase):
    def test_healthy_trace(self):
        rows=[row(i,"task_checkpoint" if i in (5,15) else "model") for i in range(1,21)]
        r=analyze(rows,POLICY)
        self.assertTrue(r["ok"]); self.assertEqual(r["decision"],"allow")

    def test_detects_close_compactions_and_static_reload(self):
        rows=[row(i) for i in range(1,21)]
        rows[8]=row(9,"compaction",static=18000)
        rows[10]=row(11,"compaction",static=19000)
        r=analyze(rows,POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("compaction_spacing",r["violations"])
        self.assertIn("repeated_static_payload",r["violations"])

    def test_detects_usage_accounting_divergence(self):
        rows=[row(i,reported=1800,live=1000) for i in range(1,11)]
        r=analyze(rows,POLICY)
        self.assertIn("usage_accounting_divergence",r["violations"])

    def test_stops_unproductive_compaction_loop(self):
        rows=[row(1,"compaction"),row(2,"compaction"),row(3,"compaction"),row(4,"model")]
        r=analyze(rows,POLICY)
        self.assertEqual(r["decision"],"stop-and-recover")
        self.assertIn("unproductive_compaction_retries",r["violations"])

if __name__=="__main__": unittest.main()

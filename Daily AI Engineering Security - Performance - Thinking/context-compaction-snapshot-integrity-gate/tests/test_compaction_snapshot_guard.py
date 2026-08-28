import unittest
from scripts.compaction_snapshot_guard import evaluate

POLICY={"auto_compact_utilization":0.8,"max_persisted_to_latest_ratio":1.25,"max_transcript_estimate_drift_ratio":0.25,"trusted_snapshot_sources":["latest-model-call","post-compaction-recount","transcript-estimate"]}

def snap(**kw):
    d={"context_window":100000,"persisted_total_tokens":85000,"latest_context_tokens":85000,"snapshot_source":"latest-model-call","cumulative_run_tokens":200000,"transcript_estimate_tokens":82000,"compaction_requested":True}; d.update(kw); return d

class Tests(unittest.TestCase):
    def test_real_high_context_allows_compaction(self):
        r=evaluate(snap(),POLICY); self.assertTrue(r["ok"]); self.assertEqual(r["decision"],"allow-compaction")
    def test_cumulative_usage_masquerade_blocked(self):
        r=evaluate(snap(persisted_total_tokens=900000,latest_context_tokens=20000,cumulative_run_tokens=910000,transcript_estimate_tokens=21000),POLICY)
        self.assertFalse(r["ok"]); self.assertIn("persisted_value_looks_like_cumulative_run_usage",r["reasons"])
    def test_premature_compaction_blocked(self):
        r=evaluate(snap(persisted_total_tokens=20000,latest_context_tokens=20000,cumulative_run_tokens=20000,transcript_estimate_tokens=20000),POLICY)
        self.assertFalse(r["ok"]); self.assertIn("compaction_requested_below_trusted_threshold",r["reasons"])
    def test_untrusted_source_blocked(self):
        self.assertFalse(evaluate(snap(snapshot_source="run-accumulator"),POLICY)["ok"])
    def test_no_compaction_needed_is_valid(self):
        r=evaluate(snap(persisted_total_tokens=30000,latest_context_tokens=30000,cumulative_run_tokens=90000,transcript_estimate_tokens=31000,compaction_requested=False),POLICY)
        self.assertTrue(r["ok"]); self.assertEqual(r["decision"],"no-compaction-needed")

if __name__=="__main__": unittest.main()

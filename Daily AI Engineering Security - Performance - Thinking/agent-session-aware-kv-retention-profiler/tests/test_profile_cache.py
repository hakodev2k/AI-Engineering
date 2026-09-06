import importlib.util, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/"scripts"/"profile_cache.py"
spec=importlib.util.spec_from_file_location("profile_cache",SCRIPT); mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

class ProfileTests(unittest.TestCase):
    def test_summary(self):
        rows=[
          {"session_id":"a","turn":1,"input_tokens":100,"reused_prefix_tokens":80,"ttft_ms":10,"event":"active"},
          {"session_id":"a","turn":2,"input_tokens":200,"reused_prefix_tokens":50,"ttft_ms":30,"event":"resume"}
        ]
        s=mod.summarize(rows)
        self.assertEqual(s["turns"],2); self.assertEqual(s["resume_misses"],1)
        self.assertEqual(s["resume_avoidable_prefill_tokens"],150)
        self.assertAlmostEqual(s["reuse_ratio"],130/300,places=5)
        self.assertEqual(s["ttft_median_ms"],20)
    def test_comparison_direction(self):
        b=mod.summarize([{"session_id":"a","turn":1,"input_tokens":100,"reused_prefix_tokens":20,"ttft_ms":100,"event":"resume"}])
        c=mod.summarize([{"session_id":"a","turn":1,"input_tokens":100,"reused_prefix_tokens":90,"ttft_ms":50,"event":"resume"}])
        d=mod.compare(b,c)
        self.assertGreater(d["reuse_ratio"],0); self.assertLess(d["ttft_p95_ms"],0); self.assertLess(d["resume_avoidable_prefill_tokens"],0)
if __name__=="__main__": unittest.main()

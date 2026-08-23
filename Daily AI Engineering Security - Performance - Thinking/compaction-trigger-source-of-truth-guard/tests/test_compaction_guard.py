import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"compaction_guard.py"
spec=importlib.util.spec_from_file_location("guard",P); g=importlib.util.module_from_spec(spec); spec.loader.exec_module(g)

class GuardTests(unittest.TestCase):
    def test_cumulative_usage_ignored(self):
        code,out=g.evaluate({"current_prompt_tokens":80000,"run_total_tokens":1500000,"snapshot_source":"last_call","snapshot_fresh":True},1000000,.9)
        self.assertEqual(code,0); self.assertEqual(out["decision"],"ALLOW_NO_COMPACT")
    def test_untrusted_run_accumulator_blocks(self):
        code,out=g.evaluate({"current_prompt_tokens":950000,"snapshot_source":"run_accumulator","snapshot_fresh":True},1000000,.9)
        self.assertEqual(code,2)
    def test_stale_blocks(self):
        code,_=g.evaluate({"current_prompt_tokens":950000,"snapshot_source":"last_call","snapshot_fresh":False},1000000,.9)
        self.assertEqual(code,2)
    def test_real_pressure_compacts(self):
        code,out=g.evaluate({"current_prompt_tokens":910000,"snapshot_source":"recomputed_context","snapshot_fresh":True},1000000,.9)
        self.assertEqual(code,3); self.assertEqual(out["decision"],"REQUIRE_COMPACT")

if __name__=="__main__": unittest.main()

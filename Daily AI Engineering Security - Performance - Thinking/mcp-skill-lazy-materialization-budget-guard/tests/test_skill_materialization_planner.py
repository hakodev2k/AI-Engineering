import importlib.util, pathlib, unittest
SCRIPT=pathlib.Path(__file__).parents[1]/"scripts"/"skill_materialization_planner.py"
spec=importlib.util.spec_from_file_location("planner",SCRIPT)
planner=importlib.util.module_from_spec(spec); spec.loader.exec_module(planner)
CFG={"max_requests":2,"max_bytes":1000,"max_concurrency":2,"min_relevance":0.5}
class PlannerTests(unittest.TestCase):
    def test_lazy_selection_cache_and_dedup(self):
        catalog={"skills":[
            {"id":"required","required":True,"relevance":1,"resources":[{"uri":"u:a","digest":"d1","size":100}]},
            {"id":"relevant","relevance":0.8,"resources":[{"uri":"u:b","digest":"d2","cached_digest":"d2","size":200},{"uri":"u:a","digest":"d1","size":100},{"uri":"u:c","digest":"d3","size":300}]},
            {"id":"irrelevant","relevance":0.1,"resources":[{"uri":"u:z","digest":"dz","size":999}]}]}
        r=planner.plan(catalog,CFG)
        self.assertEqual(r["status"],"ok"); self.assertEqual([x["uri"] for x in r["fetch"]],["u:a","u:c"])
        reasons={x["reason"] for x in r["skipped"]}; self.assertIn("cache_hit",reasons); self.assertIn("duplicate",reasons)
    def test_required_budget_exhaustion_is_explicit(self):
        catalog={"skills":[{"id":"must","required":True,"relevance":1,"resources":[{"uri":"u:big","digest":"d","size":5000}]}]}
        r=planner.plan(catalog,CFG); self.assertEqual(r["status"],"required_budget_exceeded"); self.assertTrue(r["skipped"][0]["required"])
    def test_request_budget_caps_fetch(self):
        catalog={"skills":[{"id":"x","relevance":1,"resources":[{"uri":"u:1","digest":"1","size":1},{"uri":"u:2","digest":"2","size":1},{"uri":"u:3","digest":"3","size":1}]}]}
        r=planner.plan(catalog,CFG); self.assertEqual(r["projected_requests"],2); self.assertEqual(len(r["fetch"]),2)
    def test_invalid_config(self):
        with self.assertRaises(ValueError): planner.plan({"skills":[]},{"max_requests":0,"max_bytes":1,"max_concurrency":1})
if __name__=="__main__": unittest.main()

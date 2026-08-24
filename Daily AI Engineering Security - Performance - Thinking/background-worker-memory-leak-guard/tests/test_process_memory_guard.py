import importlib.util, json, tempfile, unittest
from pathlib import Path
from unittest.mock import patch

P=Path(__file__).resolve().parents[1]/"scripts"/"process_memory_guard.py"
spec=importlib.util.spec_from_file_location("guard",P); g=importlib.util.module_from_spec(spec); spec.loader.exec_module(g)

class GuardTests(unittest.TestCase):
    def test_select_and_sum(self):
        rows=[{"pid":1,"ppid":0,"rss_kb":100,"age_s":10,"command":"claude bg"},{"pid":2,"ppid":0,"rss_kb":200,"age_s":20,"command":"other"}]
        with patch.object(g,"ps_rows",return_value=rows), patch.object(g.os,"getpid",return_value=99):
            s=g.snapshot("claude")
        self.assertEqual(s["count"],1); self.assertEqual(s["tree_rss_kb"],100)

    def test_compare_blocks_growth(self):
        with tempfile.TemporaryDirectory() as d:
            b=Path(d)/"b.json"; b.write_text(json.dumps({"tree_rss_kb":100,"count":1}))
            args=type("A",(),{"baseline":str(b),"match":"claude","cooldown_seconds":0,"max_growth_mb":0.1,"max_stale":9,"stale_age_seconds":3600})()
            cur={"timestamp":0,"pattern":"claude","count":1,"tree_rss_kb":400,"processes":[]}
            with patch.object(g,"snapshot",return_value=cur): self.assertEqual(g.cmd_compare(args),2)

    def test_compare_passes_budget(self):
        with tempfile.TemporaryDirectory() as d:
            b=Path(d)/"b.json"; b.write_text(json.dumps({"tree_rss_kb":100,"count":1}))
            args=type("A",(),{"baseline":str(b),"match":"claude","cooldown_seconds":0,"max_growth_mb":1,"max_stale":1,"stale_age_seconds":3600})()
            cur={"timestamp":0,"pattern":"claude","count":1,"tree_rss_kb":150,"processes":[]}
            with patch.object(g,"snapshot",return_value=cur): self.assertEqual(g.cmd_compare(args),0)

if __name__=="__main__": unittest.main()

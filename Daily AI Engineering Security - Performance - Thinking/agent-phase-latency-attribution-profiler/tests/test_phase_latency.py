import importlib.util, pathlib, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("p",ROOT/"scripts"/"phase_latency.py")
p=importlib.util.module_from_spec(spec); spec.loader.exec_module(p)

def e(phase,event,ts,run="r1"): return {"run_id":run,"phase":phase,"event":event,"ts_ms":ts}

class PhaseTests(unittest.TestCase):
    def test_valid_profile(self):
        rows=[e("prepare","start",0),e("prepare","end",20),e("provider_event","mark",30),e("business_action","mark",40),e("work","start",40),e("visible_output","mark",50),e("work","end",100)]
        r=p.profile(rows)["r1"]
        self.assertTrue(r["valid"]); self.assertEqual(r["phases_ms"]["prepare"],20); self.assertEqual(r["time_to_first_business_action_ms"],40)
    def test_missing_end_fails(self):
        r=p.profile([e("prepare","start",0),e("provider_event","mark",10)])["r1"]
        self.assertFalse(r["valid"]); self.assertIn("missing end:prepare",r["errors"])
    def test_end_without_start_fails(self):
        r=p.profile([e("prepare","end",10)])["r1"]
        self.assertFalse(r["valid"])
    def test_multiple_runs_isolated(self):
        rows=[e("x","start",0,"a"),e("x","end",5,"a"),e("x","start",10,"b"),e("x","end",20,"b")]
        r=p.profile(rows); self.assertEqual(r["a"]["phases_ms"]["x"],5); self.assertEqual(r["b"]["phases_ms"]["x"],10)
    def test_overlap_fails(self):
        r=p.profile([e("x","start",0),e("x","start",1),e("x","end",2)])["r1"]
        self.assertFalse(r["valid"])

if __name__=="__main__": unittest.main()

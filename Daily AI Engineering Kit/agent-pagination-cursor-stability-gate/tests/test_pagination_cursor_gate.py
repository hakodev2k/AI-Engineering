#!/usr/bin/env python3
import importlib.util, json, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/"scripts"/"pagination_cursor_gate.py"
spec=importlib.util.spec_from_file_location("pagination_cursor_gate",SCRIPT)
gate=importlib.util.module_from_spec(spec); spec.loader.exec_module(gate)
class Tests(unittest.TestCase):
    def setUp(self): self.policy=json.loads((ROOT/"config"/"policy.json").read_text())
    def test_stable(self):
        t=json.loads((ROOT/"examples"/"stable-trace.json").read_text()); r=gate.validate_trace(t,self.policy)
        self.assertEqual(r["status"],"pass")
    def test_unstable(self):
        t=json.loads((ROOT/"examples"/"unstable-trace.json").read_text()); r=gate.validate_trace(t,self.policy)
        ids={x["id"] for x in r["findings"]}
        for expected in ("cursor-discontinuity","cursor-cycle","duplicate-item","non-monotonic-order","unterminated-pagination","missing-items"):
            self.assertIn(expected,ids)
    def test_invalid_sort_key(self):
        t={"pages":[{"cursor_in":None,"cursor_out":None,"items":[{"id":"x","sort_key":[]}]}]}
        with self.assertRaises(ValueError): gate.validate_trace(t,self.policy)
    def test_disable_continuity(self):
        p=dict(self.policy); p["require_cursor_continuity"]=False
        t={"pages":[{"cursor_in":None,"cursor_out":"a","items":[{"id":"1","sort_key":[1,"1"]}]},{"cursor_in":"x","cursor_out":None,"items":[{"id":"2","sort_key":[2,"2"]}]}]}
        self.assertEqual(gate.validate_trace(t,p)["status"],"pass")
if __name__=="__main__": unittest.main()

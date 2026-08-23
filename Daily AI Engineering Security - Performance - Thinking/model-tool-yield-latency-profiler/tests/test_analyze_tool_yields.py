import json, subprocess, sys, tempfile, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/"scripts"/"analyze_tool_yields.py"

def write_trace(path, events):
    path.write_text("\n".join(json.dumps(e) for e in events)+"\n")

class YieldTests(unittest.TestCase):
    def run(self, events, *extra):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/"t.jsonl"; write_trace(p,events)
            return subprocess.run([sys.executable,str(SCRIPT),str(p),"--json",*extra],capture_output=True,text=True)
    def test_parallel_calls_share_yield(self):
        ev=[{"ts_ms":0,"type":"model_end"},{"ts_ms":10,"type":"tool_start","call_id":"a"},{"ts_ms":12,"type":"tool_start","call_id":"b"},{"ts_ms":30,"type":"tool_end","call_id":"a"},{"ts_ms":35,"type":"tool_end","call_id":"b"},{"ts_ms":40,"type":"model_start"}]
        r=self.run(ev); self.assertEqual(r.returncode,0); self.assertEqual(json.loads(r.stdout)["tool_yields"],1)
    def test_sequential_calls_are_two_yields(self):
        ev=[{"ts_ms":0,"type":"model_end"},{"ts_ms":10,"type":"tool_start","call_id":"a"},{"ts_ms":20,"type":"tool_end","call_id":"a"},{"ts_ms":30,"type":"tool_start","call_id":"b"},{"ts_ms":40,"type":"tool_end","call_id":"b"}]
        r=self.run(ev); self.assertEqual(json.loads(r.stdout)["tool_yields"],2)
    def test_independent_group_candidate(self):
        ev=[{"ts_ms":0,"type":"model_end"},{"ts_ms":10,"type":"tool_start","call_id":"a","dependency_group":"independent:reads"},{"ts_ms":20,"type":"tool_end","call_id":"a"},{"ts_ms":30,"type":"tool_start","call_id":"b","dependency_group":"independent:reads"},{"ts_ms":45,"type":"tool_end","call_id":"b"}]
        r=self.run(ev); self.assertEqual(len(json.loads(r.stdout)["serial_independent_candidates"]),1)
    def test_threshold_regression(self):
        ev=[{"ts_ms":0,"type":"model_end"},{"ts_ms":10,"type":"tool_start","call_id":"a"},{"ts_ms":1010,"type":"tool_end","call_id":"a"}]
        self.assertEqual(self.run(ev,"--max-yield-p95-ms","500").returncode,2)
    def test_malformed_trace_fails(self):
        ev=[{"ts_ms":0,"type":"tool_end","call_id":"x"}]
        self.assertEqual(self.run(ev).returncode,1)

if __name__=="__main__": unittest.main()

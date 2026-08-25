import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"latency_phase_gate.py"
spec=importlib.util.spec_from_file_location("gate",P); gate=importlib.util.module_from_spec(spec); spec.loader.exec_module(gate)
POLICY={"require_approval_bounds_when_approval_occurred":True,"max_clock_skew_ms":0,"allowed_claim_phases":["tool_execution","approval_wait","post_tool_overhead","end_to_end"]}

class GateTests(unittest.TestCase):
    def record(self):
        return {"request_start":"2026-08-25T08:00:00+00:00","approval_occurred":True,"approval_requested":"2026-08-25T08:00:01+00:00","approval_granted":"2026-08-25T08:02:01+00:00","tool_start":"2026-08-25T08:02:01+00:00","tool_end":"2026-08-25T08:02:12+00:00","result_ingested":"2026-08-25T08:02:12.100+00:00","next_model_start":"2026-08-25T08:02:13+00:00"}
    def test_separates_approval_and_execution(self):
        r=gate.analyze(self.record(),POLICY,"tool_execution")
        self.assertEqual(r["status"],"attributable")
        self.assertAlmostEqual(r["durations"]["approval_wait_ms"],120000)
        self.assertAlmostEqual(r["durations"]["tool_execution_ms"],11000)
    def test_missing_approval_bound_is_ambiguous(self):
        x=self.record(); x.pop("approval_granted")
        self.assertEqual(gate.analyze(x,POLICY,"tool_execution")["status"],"ambiguous")
    def test_non_monotonic_is_invalid(self):
        x=self.record(); x["tool_end"]="2026-08-25T08:01:00+00:00"
        self.assertEqual(gate.analyze(x,POLICY,"tool_execution")["status"],"invalid")

if __name__=="__main__": unittest.main()

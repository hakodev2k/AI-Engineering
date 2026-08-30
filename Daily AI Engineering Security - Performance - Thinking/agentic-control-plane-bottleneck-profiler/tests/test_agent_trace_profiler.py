import importlib.util
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "agent_trace_profiler.py"
spec = importlib.util.spec_from_file_location("agent_trace_profiler", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)

class AgentTraceProfilerTests(unittest.TestCase):
    def test_profile_detects_duplicates_and_retries(self):
        report = module.analyze([
            {"task_id":"t1","kind":"llm","duration_ms":100,"quality_pass":True},
            {"task_id":"t1","kind":"tool","duration_ms":400,"call_key":"search:a"},
            {"task_id":"t1","kind":"tool","duration_ms":400,"call_key":"search:a","retry_of":"2"},
            {"task_id":"t2","kind":"sandbox","duration_ms":200,"quality_pass":True},
        ])
        self.assertEqual(report["duplicate_call_count"],1)
        self.assertEqual(report["retry_count"],1)
        self.assertAlmostEqual(report["quality_pass_rate"],1.0)
        self.assertGreater(report["latency_share"]["tool"], report["latency_share"]["llm"])

    def test_regression_gate_blocks_p95(self):
        base={"task_latency_ms":{"p95":1000}}
        current={"task_latency_ms":{"p95":1200},"quality_pass_rate":1.0}
        violations=module.compare(current,base,0.05,1.0)
        self.assertIn("p95_latency_regression",violations)

    def test_quality_floor_blocks(self):
        base={"task_latency_ms":{"p95":1000}}
        current={"task_latency_ms":{"p95":900},"quality_pass_rate":0.8}
        violations=module.compare(current,base,0.05,0.95)
        self.assertIn("quality_below_floor",violations)

    def test_invalid_duration_rejected(self):
        with self.assertRaises(ValueError):
            module.analyze([{"task_id":"t","kind":"tool","duration_ms":-1}])

if __name__=="__main__":unittest.main()

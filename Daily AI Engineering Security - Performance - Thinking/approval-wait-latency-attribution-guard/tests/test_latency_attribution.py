#!/usr/bin/env python3
import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("latency_attribution", ROOT / "scripts" / "latency_attribution.py")
MOD = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MOD)

POLICY = {
    "max_clock_skew_ms": 0,
    "regression_threshold_percent": 20,
    "minimum_samples": 2,
}


class LatencyAttributionTests(unittest.TestCase):
    def test_approval_wait_is_not_execution(self):
        rows = [
            {"call_id":"a","approval_required":True,"requested_ms":0,"approval_required_ms":10,"approval_decision_ms":5010,"execution_start_ms":5020,"execution_end_ms":5120,"postprocess_end_ms":5130,"baseline_execution_ms":100},
            {"call_id":"b","approval_required":True,"requested_ms":0,"approval_required_ms":5,"approval_decision_ms":3005,"execution_start_ms":3010,"execution_end_ms":3110,"postprocess_end_ms":3120,"baseline_execution_ms":100},
        ]
        report, code = MOD.analyze(rows, POLICY)
        self.assertEqual(code, 0)
        self.assertEqual(report["tool_execution_ms"]["mean"], 100.0)
        self.assertGreater(report["approval_wait_ms"]["mean"], 3000)
        self.assertFalse(report["regression"])

    def test_execution_before_approval_is_invalid(self):
        rows = [{"call_id":"x","approval_required":True,"requested_ms":0,"approval_required_ms":10,"approval_decision_ms":100,"execution_start_ms":90,"execution_end_ms":120}]
        report, code = MOD.analyze(rows, POLICY)
        self.assertEqual(code, 3)
        self.assertFalse(report["valid"])
        self.assertTrue(any("before approval" in x for x in report["violations"]))

    def test_execution_regression_is_detected(self):
        rows = [
            {"call_id":"a","approval_required":False,"requested_ms":0,"execution_start_ms":0,"execution_end_ms":150,"baseline_execution_ms":100},
            {"call_id":"b","approval_required":False,"requested_ms":0,"execution_start_ms":0,"execution_end_ms":150,"baseline_execution_ms":100},
        ]
        report, code = MOD.analyze(rows, POLICY)
        self.assertEqual(code, 4)
        self.assertTrue(report["regression"])


if __name__ == "__main__":
    unittest.main()

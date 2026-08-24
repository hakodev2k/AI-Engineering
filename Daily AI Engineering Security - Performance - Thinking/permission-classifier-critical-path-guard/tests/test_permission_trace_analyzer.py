#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "analyze_permission_trace.py"


def run_trace(events, classifier_budget=30000, dispatch_budget=5000):
    with tempfile.TemporaryDirectory() as td:
        trace = Path(td) / "trace.jsonl"
        trace.write_text("\n".join(json.dumps(e) for e in events) + "\n", encoding="utf-8")
        proc = subprocess.run(
            [sys.executable, str(SCRIPT), str(trace), "--classifier-budget-ms", str(classifier_budget), "--dispatch-budget-ms", str(dispatch_budget)],
            text=True,
            capture_output=True,
            check=False,
        )
        payload = json.loads(proc.stdout) if proc.stdout.strip() else None
        return proc.returncode, payload, proc.stderr


class AnalyzerTests(unittest.TestCase):
    def test_decomposes_normal_operation(self):
        events = [
            {"op_id":"a", "event":"tool_proposed", "ts_ms":0},
            {"op_id":"a", "event":"classifier_start", "ts_ms":10},
            {"op_id":"a", "event":"classifier_end", "ts_ms":110},
            {"op_id":"a", "event":"tool_dispatch", "ts_ms":120},
            {"op_id":"a", "event":"tool_result", "ts_ms":320},
        ]
        code, report, _ = run_trace(events)
        self.assertEqual(code, 0)
        self.assertEqual(report["classifier"]["p50_ms"], 100.0)
        self.assertEqual(report["tool_execution"]["p50_ms"], 200.0)
        self.assertEqual(report["violations"], [])

    def test_flags_classifier_budget(self):
        events = [
            {"op_id":"slow", "event":"tool_proposed", "ts_ms":0},
            {"op_id":"slow", "event":"classifier_start", "ts_ms":10},
            {"op_id":"slow", "event":"classifier_end", "ts_ms":310010},
            {"op_id":"slow", "event":"tool_dispatch", "ts_ms":310020},
            {"op_id":"slow", "event":"tool_result", "ts_ms":311020},
        ]
        code, report, _ = run_trace(events)
        self.assertEqual(code, 1)
        self.assertTrue(any(v["type"] == "classifier_budget" for v in report["violations"]))
        self.assertEqual(report["tool_execution"]["p50_ms"], 1000.0)

    def test_flags_post_classifier_dispatch_gap(self):
        events = [
            {"op_id":"gap", "event":"classifier_start", "ts_ms":0},
            {"op_id":"gap", "event":"classifier_end", "ts_ms":100},
            {"op_id":"gap", "event":"tool_dispatch", "ts_ms":10100},
            {"op_id":"gap", "event":"tool_result", "ts_ms":10200},
        ]
        code, report, _ = run_trace(events)
        self.assertEqual(code, 1)
        self.assertTrue(any(v["type"] == "dispatch_budget" for v in report["violations"]))

    def test_counts_repeated_classifier_errors(self):
        events = [
            {"op_id":"x1", "event":"classifier_error", "ts_ms":0, "error":"temporarily unavailable"},
            {"op_id":"x2", "event":"classifier_error", "ts_ms":1000, "error":"temporarily unavailable"},
        ]
        code, report, _ = run_trace(events)
        self.assertEqual(code, 0)
        self.assertEqual(report["repeated_classifier_errors"][0]["count"], 2)

    def test_rejects_malformed_trace(self):
        events = [{"op_id":"bad", "event":"classifier_start", "ts_ms":"not-number"}]
        code, report, stderr = run_trace(events)
        self.assertEqual(code, 2)
        self.assertIsNone(report)
        self.assertIn("numeric ts_ms required", stderr)


if __name__ == "__main__":
    unittest.main()

import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("profiler", ROOT / "scripts" / "trace_latency_profiler.py")
profiler = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(profiler)


def ev(cycle, phase, ts, tool="exec"):
    return {"run_id": "r", "cycle_id": cycle, "tool": tool, "phase": phase, "ts": ts}


class ProfilerTests(unittest.TestCase):
    def good(self):
        return [
            ev("c1", "tool_start", "2026-08-20T00:00:00+00:00"),
            ev("c1", "tool_end", "2026-08-20T00:00:01+00:00"),
            ev("c1", "result_ingested", "2026-08-20T00:00:01.100000+00:00"),
            ev("c1", "next_model_start", "2026-08-20T00:00:04+00:00"),
            ev("c1", "next_agent_action", "2026-08-20T00:00:05+00:00"),
        ]

    def test_phase_durations(self):
        summary, errors = profiler.profile(self.good())
        self.assertEqual([], errors)
        row = summary["cycles"][0]
        self.assertEqual(1000.0, row["tool_runtime_ms"])
        self.assertEqual(100.0, row["result_ingestion_ms"])
        self.assertEqual(3000.0, row["continuation_gap_ms"])
        self.assertEqual(1000.0, row["model_continuation_ms"])
        self.assertEqual(5000.0, row["tool_cycle_ms"])
        self.assertEqual(3.0, row["continuation_tool_ratio"])

    def test_missing_phase_is_not_zero(self):
        events = self.good()[:-1]
        summary, errors = profiler.profile(events)
        self.assertEqual(0, summary["complete_cycles"])
        self.assertTrue(any("missing phases" in x for x in errors))

    def test_non_monotonic_rejected(self):
        events = self.good()
        events[-1]["ts"] = "2026-08-20T00:00:00.500000+00:00"
        summary, errors = profiler.profile(events)
        self.assertEqual(0, summary["complete_cycles"])
        self.assertTrue(any("non-monotonic" in x for x in errors))

    def test_duplicate_phase_rejected(self):
        events = self.good() + [ev("c1", "tool_end", "2026-08-20T00:00:01+00:00")]
        _, errors = profiler.profile(events)
        self.assertTrue(any("duplicate phase" in x for x in errors))

    def test_percentile_single_value(self):
        summary, _ = profiler.profile(self.good())
        self.assertEqual(3000.0, summary["metrics"]["continuation_gap_ms"]["p95_ms"])


if __name__ == "__main__":
    unittest.main()
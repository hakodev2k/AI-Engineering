import unittest
from scripts.browser_yield_profiler import summarize, evaluate


class BrowserYieldProfilerTests(unittest.TestCase):
    def test_summary_counts_duplicate_state_and_latency(self):
        events = [
            {"type": "observation", "ts_ms": 0, "state_hash": "a", "tokens": 100, "latency_ms": 10},
            {"type": "observation", "ts_ms": 20, "state_hash": "a", "tokens": 100, "latency_ms": 10},
            {"type": "model", "ts_ms": 40, "tokens": 50, "latency_ms": 15},
            {"type": "progress", "ts_ms": 60},
        ]
        s = summarize(events)
        self.assertEqual(s["observations"], 2)
        self.assertEqual(s["unique_states"], 1)
        self.assertEqual(s["duplicate_observations"], 1)
        self.assertAlmostEqual(s["duplicate_observation_rate"], 0.5)
        self.assertEqual(s["tokens_per_progress"], 250)
        self.assertEqual(s["model_latency_ms"], 15)
        self.assertEqual(s["tool_latency_ms"], 20)

    def test_threshold_failure_is_reported(self):
        summary = {
            "duplicate_observation_rate": 0.5,
            "observations_per_progress": 7,
            "tokens_per_progress": 100,
            "progress_events": 1,
        }
        failures = evaluate(summary, {"max_duplicate_observation_rate": 0.3, "max_observations_per_progress": 6})
        self.assertEqual(len(failures), 2)

    def test_progress_required(self):
        summary = {
            "duplicate_observation_rate": 0,
            "observations_per_progress": 0,
            "tokens_per_progress": 0,
            "progress_events": 0,
        }
        failures = evaluate(summary, {"require_progress_events": True})
        self.assertEqual(failures[0]["metric"], "progress_events")


if __name__ == "__main__":
    unittest.main()

import importlib.util
import pathlib
import unittest

MODULE_PATH = pathlib.Path(__file__).parents[1] / "scripts" / "watchdog_profiler.py"
spec = importlib.util.spec_from_file_location("watchdog_profiler", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class WatchdogProfilerTests(unittest.TestCase):
    def test_detects_boundary_timeout_that_resumes(self):
        rows = [
            {"run_id": "ok1", "phase": "model_wait", "duration_seconds": 560, "outcome": "success", "retry_count": 0, "input_tokens": 1000},
            {"run_id": "t1", "phase": "model_wait", "duration_seconds": 600, "watchdog_seconds": 600, "outcome": "timeout", "resumed_success": True, "retry_count": 1, "input_tokens": 1000},
        ]
        config = {"phase_timeout_seconds": {"model_wait": 900, "unknown": 600}, "max_retries": 1, "max_retry_token_multiplier": 3.0}
        report = mod.analyze(rows, config)
        self.assertEqual(len(report["false_abort_candidates"]), 1)

    def test_flags_healthy_tail_beyond_timeout(self):
        rows = [
            {"run_id": "a", "phase": "model_wait", "duration_seconds": 610, "outcome": "success"},
            {"run_id": "b", "phase": "model_wait", "duration_seconds": 620, "outcome": "success"},
        ]
        config = {"phase_timeout_seconds": {"model_wait": 600, "unknown": 600}, "max_retries": 1, "max_retry_token_multiplier": 2.0}
        report = mod.analyze(rows, config)
        self.assertFalse(report["ok"])
        self.assertIn("model_wait:healthy_p99_meets_or_exceeds_timeout", report["violations"])

    def test_bounded_fast_work_passes(self):
        rows = [
            {"run_id": "a", "phase": "tool", "duration_seconds": 10, "outcome": "success", "input_tokens": 100},
            {"run_id": "b", "phase": "tool", "duration_seconds": 12, "outcome": "success", "input_tokens": 100},
        ]
        config = {"phase_timeout_seconds": {"tool": 600, "unknown": 600}, "max_retries": 1, "max_retry_token_multiplier": 1.5}
        self.assertTrue(mod.analyze(rows, config)["ok"])


if __name__ == "__main__":
    unittest.main()

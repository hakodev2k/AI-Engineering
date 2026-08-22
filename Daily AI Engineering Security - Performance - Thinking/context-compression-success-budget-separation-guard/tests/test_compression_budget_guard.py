import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "compression_budget_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(guard)

POLICY = {
    "minimum_progress_ratio": 0.05,
    "max_consecutive_failures": 3,
    "max_reactive_retries_per_error": 2,
    "max_total_compression_events_per_turn": 20,
    "require_post_compression_model_success": True,
    "allow_failure_streak_reset_after_verified_success": True,
    "handoff_on_absolute_cap": True,
}


def comp(before, after, path="maintenance", status="completed", error_id=None):
    e = {"kind": "compression", "path": path, "status": status, "before_tokens": before, "after_tokens": after}
    if error_id is not None:
        e["error_id"] = error_id
    return e


class BudgetTests(unittest.TestCase):
    def test_four_verified_successes_do_not_exhaust_failure_budget(self):
        events = []
        for _ in range(4):
            events += [comp(200000, 120000), {"kind": "model_result", "status": "success"}]
        out = guard.analyze(events, POLICY)
        self.assertEqual(out["decision"], "continue")
        self.assertEqual(out["verified_successful_maintenance"], 4)
        self.assertEqual(out["consecutive_failures"], 0)

    def test_no_progress_stops_at_failure_cap(self):
        events = [comp(100000, 99000), comp(100000, 99000), comp(100000, 99000)]
        out = guard.analyze(events, POLICY)
        self.assertEqual(out["decision"], "stop")
        self.assertEqual(out["reason"], "consecutive_no_progress_failures")

    def test_reactive_retries_have_separate_bound(self):
        events = [
            comp(200000, 150000, path="reactive", error_id="overflow-1"),
            {"kind": "model_result", "status": "error"},
            comp(190000, 140000, path="reactive", error_id="overflow-1"),
            {"kind": "model_result", "status": "error"},
            comp(180000, 130000, path="reactive", error_id="overflow-1"),
        ]
        out = guard.analyze(events, POLICY)
        self.assertEqual(out["decision"], "stop")
        self.assertEqual(out["reason"], "reactive_retry_budget_exhausted")

    def test_material_reduction_requires_model_success(self):
        out = guard.analyze([comp(200000, 100000)], POLICY)
        self.assertTrue(out["pending_progress_verification"])
        self.assertEqual(out["verified_successful_maintenance"], 0)

    def test_absolute_cap_still_bounds_successful_maintenance(self):
        policy = dict(POLICY)
        policy["max_total_compression_events_per_turn"] = 2
        events = [comp(100, 50), {"kind": "model_result", "status": "success"}, comp(100, 50), {"kind": "model_result", "status": "success"}, comp(100, 50)]
        out = guard.analyze(events, policy)
        self.assertEqual(out["decision"], "handoff")
        self.assertEqual(out["reason"], "absolute_compression_cap_exceeded")


if __name__ == "__main__":
    unittest.main()

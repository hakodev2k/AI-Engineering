import unittest
from scripts.barrier_watchdog import evaluate

POLICY = {
    "wall_timeout_ms": 1000,
    "idle_progress_timeout_ms": 200,
    "minimum_successes": 2,
}


class WatchdogTests(unittest.TestCase):
    def test_release_when_quorum_completed(self):
        state = {"now_ms": 1000, "children": [
            {"id": "a", "status": "completed", "started_ms": 1, "last_progress_ms": 900},
            {"id": "b", "status": "completed", "started_ms": 1, "last_progress_ms": 950},
            {"id": "c", "status": "running", "started_ms": 900, "last_progress_ms": 950},
        ]}
        self.assertEqual(evaluate(state, POLICY)["decision"], "release")

    def test_stalled_child_does_not_block_quorum(self):
        state = {"now_ms": 2000, "children": [
            {"id": "a", "status": "completed", "started_ms": 1, "last_progress_ms": 1900},
            {"id": "b", "status": "completed", "started_ms": 1, "last_progress_ms": 1900},
            {"id": "c", "status": "running", "started_ms": 1, "last_progress_ms": 1000},
        ]}
        result = evaluate(state, POLICY)
        self.assertTrue(result["ok"])
        self.assertEqual(result["decision"], "release_degraded")

    def test_quorum_unreachable_blocks(self):
        state = {"now_ms": 2000, "children": [
            {"id": "a", "status": "completed", "started_ms": 1, "last_progress_ms": 1900},
            {"id": "b", "status": "failed", "started_ms": 1, "last_progress_ms": 500},
            {"id": "c", "status": "running", "started_ms": 1, "last_progress_ms": 1000},
        ]}
        result = evaluate(state, POLICY)
        self.assertFalse(result["ok"])
        self.assertEqual(result["decision"], "block")

    def test_recent_progress_waits_bounded(self):
        state = {"now_ms": 500, "children": [
            {"id": "a", "status": "completed", "started_ms": 1, "last_progress_ms": 450},
            {"id": "b", "status": "running", "started_ms": 100, "last_progress_ms": 450},
            {"id": "c", "status": "running", "started_ms": 100, "last_progress_ms": 450},
        ]}
        self.assertEqual(evaluate(state, POLICY)["decision"], "wait_bounded")


if __name__ == "__main__":
    unittest.main()

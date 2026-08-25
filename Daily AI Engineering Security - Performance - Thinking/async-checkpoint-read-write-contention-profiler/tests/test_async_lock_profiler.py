import unittest

from scripts.async_lock_profiler import analyze, percentile


class AsyncLockProfilerTests(unittest.TestCase):
    def test_contention_metrics(self):
        events = [
            {"ts_ms": 0, "event": "lock_acquire", "op_id": "reader"},
            {"ts_ms": 10, "event": "yield", "op_id": "reader"},
            {"ts_ms": 12, "event": "writer_wait_start", "op_id": "writer"},
            {"ts_ms": 50, "event": "lock_release", "op_id": "reader"},
            {"ts_ms": 50, "event": "writer_wait_end", "op_id": "writer"},
        ]
        result = analyze(events)
        self.assertEqual(result["max_lock_hold_ms"], 50)
        self.assertEqual(result["max_writer_wait_ms"], 38)
        self.assertEqual(result["max_yields_while_locked"], 1)
        self.assertEqual(result["locks_with_yield"], 1)
        self.assertFalse(result["errors"])

    def test_snapshot_then_yield_pattern(self):
        events = [
            {"ts_ms": 0, "event": "lock_acquire", "op_id": "reader"},
            {"ts_ms": 5, "event": "lock_release", "op_id": "reader"},
            {"ts_ms": 6, "event": "writer_wait_start", "op_id": "writer"},
            {"ts_ms": 6, "event": "writer_wait_end", "op_id": "writer"},
            {"ts_ms": 10, "event": "yield", "op_id": "reader"},
        ]
        result = analyze(events)
        self.assertEqual(result["max_yields_while_locked"], 0)
        self.assertEqual(result["max_writer_wait_ms"], 0)

    def test_unclosed_lock_is_invalid(self):
        result = analyze([{"ts_ms": 0, "event": "lock_acquire", "op_id": "reader"}])
        self.assertIn("unclosed_lock:reader", result["errors"])

    def test_percentile(self):
        self.assertEqual(percentile([1, 2, 3, 4], 50), 2.5)


if __name__ == "__main__":
    unittest.main()

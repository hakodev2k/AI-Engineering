import unittest
from scripts.tool_reuse_profiler import analyze, canonical_key

POLICY = {
    "cacheable_tools": {
        "web_fetch": {"ttl_ms": 300000, "scope": "run"},
        "read_file": {"ttl_ms": 60000, "scope": "run"},
    },
    "never_cache_tools": ["write_file", "deploy"],
    "thresholds": {
        "min_calls_for_measurement": 2,
        "duplicate_rate_warning": 0.2,
        "avoidable_latency_ms_warning": 100,
    },
}

class ToolReuseProfilerTests(unittest.TestCase):
    def test_canonical_args_ignore_order(self):
        self.assertEqual(canonical_key("x", {"a": 1, "b": 2}), canonical_key("x", {"b": 2, "a": 1}))

    def test_duplicate_same_scope_same_output_detected(self):
        rows = [
            {"timestamp_ms": 0, "tool": "web_fetch", "args": {"url": "u"}, "latency_ms": 100, "output_digest": "d", "scope_id": "r1"},
            {"timestamp_ms": 1000, "tool": "web_fetch", "args": {"url": "u"}, "latency_ms": 250, "output_digest": "d", "scope_id": "r1"},
        ]
        r = analyze(rows, POLICY)
        self.assertEqual(r["duplicate_calls"], 1)
        self.assertEqual(r["avoidable_latency_ms"], 250)
        self.assertEqual(r["status"], "warn")

    def test_different_scope_not_reused(self):
        rows = [
            {"timestamp_ms": 0, "tool": "web_fetch", "args": {"url": "u"}, "latency_ms": 100, "output_digest": "d", "scope_id": "r1"},
            {"timestamp_ms": 1000, "tool": "web_fetch", "args": {"url": "u"}, "latency_ms": 250, "output_digest": "d", "scope_id": "r2"},
        ]
        self.assertEqual(analyze(rows, POLICY)["duplicate_calls"], 0)

    def test_changed_output_not_counted_as_reusable_duplicate(self):
        rows = [
            {"timestamp_ms": 0, "tool": "read_file", "args": {"path": "a"}, "latency_ms": 20, "output_digest": "old", "scope_id": "r1"},
            {"timestamp_ms": 1000, "tool": "read_file", "args": {"path": "a"}, "latency_ms": 20, "output_digest": "new", "scope_id": "r1"},
        ]
        self.assertEqual(analyze(rows, POLICY)["duplicate_calls"], 0)

    def test_write_tool_never_counted(self):
        rows = [
            {"timestamp_ms": 0, "tool": "write_file", "args": {"path": "a"}, "latency_ms": 20, "output_digest": "d", "scope_id": "r1"},
            {"timestamp_ms": 1000, "tool": "write_file", "args": {"path": "a"}, "latency_ms": 20, "output_digest": "d", "scope_id": "r1"},
        ]
        self.assertEqual(analyze(rows, POLICY)["duplicate_calls"], 0)

if __name__ == "__main__":
    unittest.main()

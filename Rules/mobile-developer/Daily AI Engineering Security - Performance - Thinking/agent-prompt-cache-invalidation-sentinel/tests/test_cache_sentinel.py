import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("cache_sentinel", ROOT / "scripts" / "cache_sentinel.py")
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
sys.modules["cache_sentinel"] = MODULE
SPEC.loader.exec_module(MODULE)


class CacheSentinelTests(unittest.TestCase):
    def test_healthy_fixture_has_no_incident(self):
        events = MODULE.read_events(ROOT / "examples" / "healthy-events.jsonl")
        report = MODULE.analyze(events, MODULE.DEFAULT_POLICY)
        self.assertEqual("ok", report["status"])
        self.assertEqual(0, report["metrics"]["collapse_events"])

    def test_pathological_fixture_detects_repeated_collapse(self):
        events = MODULE.read_events(ROOT / "examples" / "pathological-events.jsonl")
        report = MODULE.analyze(events, MODULE.DEFAULT_POLICY)
        self.assertEqual("incident", report["status"])
        self.assertGreaterEqual(report["metrics"]["collapse_events"], 2)
        self.assertGreaterEqual(report["metrics"]["estimated_rewrite_tokens"], 200000)

    def test_nested_usage_layout_is_supported(self):
        raw = {
            "requestId": "x",
            "message": {
                "usage": {
                    "cache_read_input_tokens": 80000,
                    "cache_creation_input_tokens": 2000,
                    "input_tokens": 1000,
                },
                "diagnostics": {"cache_miss_reason": {"type": "none"}},
            },
        }
        event = MODULE.normalize(raw, 1)
        self.assertEqual(80000, event.cache_read)
        self.assertEqual(2000, event.cache_creation)
        self.assertEqual("none", event.miss_reason)

    def test_duplicate_request_ids_are_deduplicated(self):
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "events.jsonl"
            row = {"request_id": "same", "cache_read_input_tokens": 90000, "cache_creation_input_tokens": 1000}
            path.write_text(json.dumps(row) + "\n" + json.dumps(row) + "\n", encoding="utf-8")
            events = MODULE.read_events(path)
            self.assertEqual(1, len(events))

    def test_invalid_policy_key_is_rejected(self):
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "policy.json"
            path.write_text('{"unknown": 1}', encoding="utf-8")
            with self.assertRaises(ValueError):
                MODULE.load_policy(path)


if __name__ == "__main__":
    unittest.main()

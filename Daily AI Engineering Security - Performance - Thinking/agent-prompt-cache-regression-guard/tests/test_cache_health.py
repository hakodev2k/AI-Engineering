#!/usr/bin/env python3
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import cache_health  # noqa: E402


POLICY = {
    "minimum_cache_eligible_input_tokens": 1000,
    "minimum_expected_cache_read_ratio": 0.5,
    "maximum_unexplained_resets_per_100_requests": 20,
    "maximum_cache_creation_amplification": 10,
    "minimum_requests_for_gate": 3,
    "known_invalidator_window_requests": 2,
    "stable_fingerprint_fields": ["provider", "model", "system_prompt_hash", "tool_schema_hash", "mcp_topology_hash", "reasoning_effort", "prompt_cache_key", "compaction_generation"],
    "known_invalidators": ["model_switch", "mcp_connect", "compaction"]
}


def req(seq, read, create=0, model="m1"):
    return {
        "type": "request", "seq": seq, "provider": "test", "model": model,
        "input_tokens": 10000, "cache_read_tokens": read, "cache_creation_tokens": create,
        "latency_ms": 100 + seq, "system_prompt_hash": "s", "tool_schema_hash": "t",
        "mcp_topology_hash": "m", "reasoning_effort": "medium", "prompt_cache_key": "k",
        "compaction_generation": 0, "_line": seq
    }


class CacheHealthTests(unittest.TestCase):
    def test_healthy_run_passes(self):
        events = [req(1, 8000), req(2, 8500), req(3, 9000)]
        report = cache_health.analyze(events, POLICY)
        self.assertEqual("pass", report["status"])
        self.assertEqual(0, report["metrics"]["unexplained_resets"])

    def test_unexplained_reset_is_detected(self):
        events = [req(1, 8000), req(2, 1000, create=8000), req(3, 8000)]
        report = cache_health.analyze(events, POLICY)
        self.assertEqual("unexplained", report["resets"][0]["classification"])

    def test_known_invalidator_explains_reset(self):
        events = [req(1, 8000), {"type": "invalidator", "seq": 1, "kind": "compaction", "_line": 2}, req(2, 1000, create=8000), req(3, 8000)]
        report = cache_health.analyze(events, POLICY)
        self.assertEqual("explained_known_invalidator", report["resets"][0]["classification"])

    def test_fingerprint_change_explains_reset(self):
        events = [req(1, 8000), req(2, 1000, create=8000, model="m2"), req(3, 8000, model="m2")]
        report = cache_health.analyze(events, POLICY)
        self.assertEqual("explained_fingerprint_change", report["resets"][0]["classification"])
        self.assertIn("model", report["resets"][0]["changed_fingerprint_fields"])

    def test_malformed_read_tokens_rejected(self):
        events = [req(1, 12000), req(2, 8000), req(3, 8000)]
        with self.assertRaises(ValueError):
            cache_health.analyze(events, POLICY)

    def test_insufficient_data_is_explicit(self):
        events = [req(1, 8000), req(2, 8000)]
        report = cache_health.analyze(events, POLICY)
        self.assertEqual("insufficient_data", report["status"])


if __name__ == "__main__":
    unittest.main()

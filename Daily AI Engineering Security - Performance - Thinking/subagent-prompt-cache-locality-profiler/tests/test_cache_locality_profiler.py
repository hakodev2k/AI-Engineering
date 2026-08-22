#!/usr/bin/env python3
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "cache_locality_profiler.py"
THRESHOLDS = ROOT / "config" / "thresholds.json"


def invoke(records, baseline=None):
    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        cand = td / "candidate.jsonl"
        cand.write_text("\n".join(json.dumps(r) for r in records) + "\n", encoding="utf-8")
        cmd = ["python", str(SCRIPT), str(cand), "--thresholds", str(THRESHOLDS)]
        if baseline is not None:
            base = td / "baseline.jsonl"
            base.write_text("\n".join(json.dumps(r) for r in baseline) + "\n", encoding="utf-8")
            cmd += ["--baseline", str(base)]
        cp = subprocess.run(cmd, text=True, capture_output=True, check=False)
        return cp.returncode, json.loads(cp.stdout) if cp.stdout.strip() else {}


def row(rid, agent, group, create, read, uncached=100, quality=True, manifest="stable"):
    return {
        "request_id": rid,
        "agent": agent,
        "dispatch_group": group,
        "input_tokens": uncached,
        "cache_creation_tokens": create,
        "cache_read_tokens": read,
        "quality_pass": quality,
        "tool_manifest_hash": manifest,
        "latency_ms": 1000
    }


class ProfilerTests(unittest.TestCase):
    def test_good_locality_passes(self):
        records = [
            row("r1", "a", "g1", 1000, 20000),
            row("r2", "b", "g1", 1000, 20000),
        ]
        code, body = invoke(records)
        self.assertEqual(0, code)
        self.assertEqual("pass", body["status"])

    def test_high_write_share_fails(self):
        records = [
            row("r1", "a", "g1", 20000, 1000),
            row("r2", "b", "g1", 20000, 1000),
        ]
        code, body = invoke(records)
        self.assertEqual(3, code)
        metrics = {v["metric"] for v in body["violations"]}
        self.assertIn("cache_write_share", metrics)

    def test_request_id_is_deduplicated(self):
        records = [
            row("same", "a", "g1", 1000, 20000),
            row("same", "a", "g1", 1000, 20000),
            row("r2", "b", "g1", 1000, 20000),
        ]
        code, body = invoke(records)
        self.assertEqual(0, code)
        self.assertEqual(1, body["deduplicated_request_records"])
        self.assertEqual(2, body["summary"]["requests"])

    def test_quality_regression_blocks_candidate(self):
        baseline = [
            row("b1", "a", "g1", 1000, 20000, quality=True),
            row("b2", "b", "g1", 1000, 20000, quality=True),
        ]
        candidate = [
            row("c1", "a", "g1", 500, 20000, quality=True),
            row("c2", "b", "g1", 500, 20000, quality=False),
        ]
        code, body = invoke(candidate, baseline)
        self.assertEqual(3, code)
        self.assertTrue(body["comparison"]["quality_regression"])

    def test_missing_usage_field_is_invalid(self):
        records = [{"request_id":"x", "agent":"a", "dispatch_group":"g", "input_tokens":1}]
        code, _ = invoke(records)
        self.assertEqual(2, code)


if __name__ == "__main__":
    unittest.main()

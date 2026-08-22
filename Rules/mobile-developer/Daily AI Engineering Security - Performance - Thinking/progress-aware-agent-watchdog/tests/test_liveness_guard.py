#!/usr/bin/env python3
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "liveness_guard.py"
POLICY = ROOT / "config" / "watchdog-policy.json"


def run_case(data):
    with tempfile.TemporaryDirectory() as td:
        path = Path(td) / "input.json"
        path.write_text(json.dumps(data), encoding="utf-8")
        return subprocess.run(
            ["python", str(SCRIPT), "--input", str(path), "--policy", str(POLICY)],
            capture_output=True, text=True, check=False
        )


def base(**overrides):
    value = {
        "phase": "model_thinking",
        "idle_seconds": 100,
        "total_elapsed_seconds": 500,
        "attempt_number": 1,
        "tokens_used": 20000,
        "signals": {
            "transport_event": 90,
            "tool_completed": None,
            "artifact_changed": None,
            "checkpoint_advanced": None,
            "verification_advanced": None
        },
        "checkpoint_hash": "abc",
        "previous_checkpoint_hash": "abc",
        "identical_signature_count": 0
    }
    value.update(overrides)
    return value


class LivenessGuardTests(unittest.TestCase):
    def test_healthy_slow_continues(self):
        result = run_case(base(idle_seconds=500, signals={"transport_event": 100}))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn(json.loads(result.stdout)["decision"], {"continue", "wait"})

    def test_patience_expired_retries_from_checkpoint(self):
        result = run_case(base(idle_seconds=700, signals={}))
        self.assertEqual(result.returncode, 3)
        self.assertEqual(json.loads(result.stdout)["decision"], "checkpoint_retry")

    def test_no_checkpoint_stops_after_patience(self):
        result = run_case(base(idle_seconds=700, checkpoint_hash="", signals={}))
        self.assertEqual(result.returncode, 4)
        self.assertEqual(json.loads(result.stdout)["decision"], "stop")

    def test_identical_signature_breaker_stops(self):
        result = run_case(base(identical_signature_count=2))
        self.assertEqual(result.returncode, 4)

    def test_hard_timeout_stops(self):
        result = run_case(base(total_elapsed_seconds=3600))
        self.assertEqual(result.returncode, 4)

    def test_checkpoint_progress_increases_score(self):
        result = run_case(base(checkpoint_hash="new", previous_checkpoint_hash="old", signals={}))
        self.assertEqual(result.returncode, 0)
        output = json.loads(result.stdout)
        self.assertTrue(output["checkpoint_advanced"])
        self.assertGreaterEqual(output["progress_score"], 4)


if __name__ == "__main__":
    unittest.main()

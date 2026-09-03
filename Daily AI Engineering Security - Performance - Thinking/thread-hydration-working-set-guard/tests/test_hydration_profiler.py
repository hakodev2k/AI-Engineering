import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "hydration_profiler.py"


class HydrationProfilerTests(unittest.TestCase):
    def run_case(self, rows, policy):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            telemetry = td / "telemetry.jsonl"
            policy_path = td / "policy.json"
            telemetry.write_text("\n".join(json.dumps(x) for x in rows) + "\n", encoding="utf-8")
            policy_path.write_text(json.dumps(policy), encoding="utf-8")
            return subprocess.run(
                [sys.executable, str(SCRIPT), "--telemetry", str(telemetry), "--policy", str(policy_path), "--json"],
                capture_output=True,
                text=True,
                check=False,
            )

    def test_passes_bounded_hydration(self):
        rows = [
            {"event": "resume_start", "thread_id": "a"},
            {"event": "resume_end", "thread_id": "a", "resume_ms": 800, "rss_mb": 900, "loaded_items": 1200},
        ]
        policy = {"max_rss_mb": 2048, "max_resume_ms": 3000, "max_loaded_items_per_thread": 5000, "max_parallel_hydrations": 2}
        result = self.run_case(rows, policy)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)["status"], "pass")

    def test_fails_oversized_hydration(self):
        rows = [
            {"event": "resume_start", "thread_id": "big"},
            {"event": "resume_end", "thread_id": "big", "resume_ms": 9000, "rss_mb": 4096, "loaded_items": 25000},
        ]
        policy = {"max_rss_mb": 2048, "max_resume_ms": 3000, "max_loaded_items_per_thread": 5000, "max_parallel_hydrations": 2}
        result = self.run_case(rows, policy)
        self.assertEqual(result.returncode, 1)
        report = json.loads(result.stdout)
        self.assertEqual(report["status"], "fail")
        self.assertGreaterEqual(len(report["violations"]), 3)

    def test_fails_parallel_hydration_burst(self):
        rows = [
            {"event": "resume_start", "thread_id": "a"},
            {"event": "resume_start", "thread_id": "b"},
            {"event": "resume_end", "thread_id": "a", "resume_ms": 100, "rss_mb": 200, "loaded_items": 100},
            {"event": "resume_end", "thread_id": "b", "resume_ms": 100, "rss_mb": 200, "loaded_items": 100},
        ]
        policy = {"max_rss_mb": 2048, "max_resume_ms": 3000, "max_loaded_items_per_thread": 5000, "max_parallel_hydrations": 1}
        result = self.run_case(rows, policy)
        self.assertEqual(result.returncode, 1)
        self.assertTrue(any(v["metric"] == "peak_parallel_hydrations" for v in json.loads(result.stdout)["violations"]))


if __name__ == "__main__":
    unittest.main()

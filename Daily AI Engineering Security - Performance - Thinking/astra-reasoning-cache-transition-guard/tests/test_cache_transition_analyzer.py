import json
import subprocess
import sys
import tempfile
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "cache_transition_analyzer.py"


class CacheTransitionTests(unittest.TestCase):
    def run_case(self, rows):
        thresholds = {
            "minimum_baseline_turns": 3,
            "minimum_post_change_turns": 2,
            "max_cache_hit_ratio_drop": 0.10,
            "max_input_token_increase_ratio": 0.20,
            "max_latency_increase_ratio": 0.25,
            "require_configuration_update": True,
            "quality_regression_allowed": False,
        }
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "thresholds.json").write_text(json.dumps(thresholds), encoding="utf-8")
            (root / "events.jsonl").write_text("\n".join(json.dumps(r) for r in rows) + "\n", encoding="utf-8")
            return subprocess.run(
                [sys.executable, str(SCRIPT), "--events", str(root / "events.jsonl"), "--thresholds", str(root / "thresholds.json")],
                text=True,
                capture_output=True,
                check=False,
            )

    @staticmethod
    def base_rows(mode="configuration_update", cached_after=9100):
        return [
            {"turn": 1, "input_tokens": 10000, "cached_input_tokens": 9000, "latency_ms": 1000, "effective_reasoning_effort": "medium", "transition_mode": "none", "quality_pass": True},
            {"turn": 2, "input_tokens": 10200, "cached_input_tokens": 9200, "latency_ms": 1020, "effective_reasoning_effort": "medium", "transition_mode": "none", "quality_pass": True},
            {"turn": 3, "input_tokens": 10100, "cached_input_tokens": 9100, "latency_ms": 980, "effective_reasoning_effort": "medium", "transition_mode": "none", "quality_pass": True},
            {"turn": 4, "input_tokens": 10300, "cached_input_tokens": cached_after, "latency_ms": 1080, "effective_reasoning_effort": "high", "transition_mode": mode, "quality_pass": True},
            {"turn": 5, "input_tokens": 10400, "cached_input_tokens": cached_after + 100, "latency_ms": 1100, "effective_reasoning_effort": "high", "transition_mode": "none", "quality_pass": True},
        ]

    def test_verified_configuration_update(self):
        result = self.run_case(self.base_rows())
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)["status"], "verified")

    def test_request_level_change_blocks(self):
        result = self.run_case(self.base_rows(mode="request_level"))
        self.assertEqual(result.returncode, 2)

    def test_cache_regression_blocks(self):
        result = self.run_case(self.base_rows(cached_after=3000))
        self.assertEqual(result.returncode, 2)


if __name__ == "__main__":
    unittest.main()

import importlib.util
import io
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "output_backpressure.py"
spec = importlib.util.spec_from_file_location("output_backpressure", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)


def policy():
    return {
        "per_tool_soft_bytes": 64,
        "per_tool_hard_bytes": 256,
        "session_soft_bytes": 512,
        "session_hard_bytes": 1024,
        "head_preview_bytes": 16,
        "tail_preview_bytes": 16,
        "rate_window_seconds": 5,
        "rate_soft_bytes_per_second": 1000000,
        "rate_hard_bytes_per_second": 1000000,
        "max_inline_session_record_bytes": 80,
        "replace_session_payload_with_reference": True,
        "persist_oversized_output": True,
        "artifact_directory": ".artifacts-test"
    }


class GuardTests(unittest.TestCase):
    def test_small_output_passes(self):
        data, meta, used, clipped = mod.capture(io.BytesIO(b"hello"), policy(), 0)
        self.assertEqual(b"hello", data)
        self.assertFalse(clipped)
        self.assertEqual(5, used)
        self.assertIsNone(meta["reason"])

    def test_tool_hard_limit_clips(self):
        data, meta, used, clipped = mod.capture(io.BytesIO(b"x" * 1000), policy(), 0)
        self.assertTrue(clipped)
        self.assertEqual("PER_TOOL_HARD_LIMIT", meta["reason"])
        self.assertLessEqual(len(data), 256)
        self.assertLessEqual(used, 256)

    def test_session_hard_limit_clips(self):
        p = policy()
        data, meta, used, clipped = mod.capture(io.BytesIO(b"z" * 200), p, 900)
        self.assertTrue(clipped)
        self.assertEqual("SESSION_HARD_LIMIT", meta["reason"])
        self.assertLessEqual(used, 1024)

    def test_head_and_tail_preserved(self):
        p = policy()
        data, meta, _, _ = mod.capture(io.BytesIO(b"A" * 100 + b"THE-END"), p, 0)
        self.assertTrue(meta["head_preview_utf8"].startswith("A"))
        self.assertIn("THE-END", meta["tail_preview_utf8"])

    def test_policy_validation_rejects_inverted_limits(self):
        p = policy()
        p["per_tool_soft_bytes"] = 300
        with self.assertRaises(ValueError):
            mod.validate_policy(p)

    def test_content_addressed_persistence_deduplicates(self):
        with tempfile.TemporaryDirectory() as d:
            payload = b"same-payload"
            digest = __import__("hashlib").sha256(payload).hexdigest()
            first = mod.persist_artifact(Path(d), digest, payload)
            second = mod.persist_artifact(Path(d), digest, payload)
            self.assertEqual(first, second)
            self.assertEqual(payload, first.read_bytes())
            self.assertEqual(1, len(list(Path(d).glob("*.bin"))))

    def test_session_counter_round_trip(self):
        with tempfile.TemporaryDirectory() as d:
            path = Path(d) / "counter.json"
            mod.save_session_counter(path, 123)
            self.assertEqual(123, mod.load_session_counter(path))


if __name__ == "__main__":
    unittest.main()

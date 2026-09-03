import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "sse_boundary_probe.py"
spec = importlib.util.spec_from_file_location("sse_boundary_probe", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)

class ProbeTests(unittest.TestCase):
    def test_delimiter_free_payload_is_bounded(self):
        result = mod.probe_bytes(b"x" * 200, frame_limit=64, stream_limit=1024, chunk_size=16)
        self.assertEqual(result.status, "limit_exceeded")
        self.assertLessEqual(result.buffered_bytes, 64)

    def test_valid_fragmented_events_pass(self):
        payload = b"data: one\n\ndata: two\n\n"
        result = mod.probe_bytes(payload, frame_limit=64, stream_limit=1024, chunk_size=3)
        self.assertEqual(result.status, "ok")
        self.assertEqual(result.events, 2)
        self.assertEqual(result.buffered_bytes, 0)

    def test_total_stream_limit_is_enforced(self):
        result = mod.probe_bytes(b"a\n\n" * 100, frame_limit=64, stream_limit=100, chunk_size=20)
        self.assertEqual(result.status, "stream_limit_exceeded")

    def test_invalid_limits_rejected(self):
        with self.assertRaises(ValueError):
            mod.probe_bytes(b"x", frame_limit=0, stream_limit=1)

if __name__ == "__main__":
    unittest.main()

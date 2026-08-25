import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from stall_discriminator import classify

POLICY = {
    "soft_stall_seconds": 600,
    "hard_stall_seconds": 1200,
    "minimum_stale_signals": 2,
    "progress_window_seconds": 900,
    "signals": ["model_event", "tool_event", "protocol_event", "durable_progress"],
}


class StallDiscriminatorTests(unittest.TestCase):
    def test_recent_tool_activity_prevents_kill(self):
        self.assertEqual(classify([(950, "tool_event")], 1000, POLICY)["classification"], "productive_or_waiting")

    def test_slow_inference_inside_hard_boundary_is_suspected(self):
        self.assertEqual(classify([(350, "tool_event")], 1000, POLICY)["classification"], "suspected_stall")

    def test_all_signals_stale_beyond_hard_boundary_confirms(self):
        events = [(0, "tool_event"), (0, "model_event"), (0, "protocol_event"), (0, "durable_progress")]
        self.assertEqual(classify(events, 1300, POLICY)["classification"], "confirmed_stall")

    def test_human_cancel_is_not_stall(self):
        self.assertEqual(classify([(900, "human_cancel")], 1000, POLICY)["classification"], "human_cancel")


if __name__ == "__main__":
    unittest.main()

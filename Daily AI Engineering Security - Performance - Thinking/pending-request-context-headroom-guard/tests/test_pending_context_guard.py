import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "pending_context_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)

CFG = {
    "context_window": 100000,
    "reserved_output_tokens": 10000,
    "uncertainty_margin_tokens": 5000,
    "compact_at_utilization": 0.8,
}


class PendingContextGuardTests(unittest.TestCase):
    def test_send_when_projected_request_has_headroom(self):
        self.assertEqual("SEND", guard.decide(CFG, 40000, 10000, 5000)["decision"])

    def test_pending_prompt_triggers_compaction(self):
        result = guard.decide(CFG, 50000, 16000, 5000)
        self.assertEqual("COMPACT", result["decision"])

    def test_hard_capacity_blocks(self):
        result = guard.decide(CFG, 70000, 12000, 4000)
        self.assertEqual("BLOCK", result["decision"])

    def test_projection_includes_tool_tokens(self):
        a = guard.decide(CFG, 50000, 5000, 0)
        b = guard.decide(CFG, 50000, 5000, 15000)
        self.assertNotEqual(a["decision"], b["decision"])

    def test_negative_inputs_rejected(self):
        with self.assertRaises(ValueError):
            guard.decide(CFG, -1, 0, 0)


if __name__ == "__main__":
    unittest.main()

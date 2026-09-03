import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("prof", ROOT / "scripts" / "lifecycle_profiler.py")
prof = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(prof)
POLICY = {
    "required_turn_events": ["turn_started", "model_started", "model_completed", "turn_completed"],
    "required_tool_events": ["tool_started", "tool_completed"],
    "max_missing_required_events": 0,
    "max_invalid_order_events": 0,
    "minimum_completeness_ratio": 1.0,
}

class Tests(unittest.TestCase):
    def test_complete_trace(self):
        events = [
            {"timestamp_ms":0,"run_id":"r","turn_id":"t","event":"turn_started"},
            {"timestamp_ms":10,"run_id":"r","turn_id":"t","event":"model_started"},
            {"timestamp_ms":30,"run_id":"r","turn_id":"t","event":"model_completed"},
            {"timestamp_ms":40,"run_id":"r","turn_id":"t","event":"tool_started","tool_call_id":"x"},
            {"timestamp_ms":65,"run_id":"r","turn_id":"t","event":"tool_completed","tool_call_id":"x"},
            {"timestamp_ms":80,"run_id":"r","turn_id":"t","event":"turn_completed"},
        ]
        out = prof.analyze(events, POLICY)
        self.assertEqual(out["status"], "pass")
        self.assertEqual(out["turns"][0]["tools"][0]["tool_execution_ms"], 25)

    def test_missing_tool_end_blocks(self):
        events = [
            {"timestamp_ms":0,"run_id":"r","turn_id":"t","event":"turn_started"},
            {"timestamp_ms":1,"run_id":"r","turn_id":"t","event":"model_started"},
            {"timestamp_ms":2,"run_id":"r","turn_id":"t","event":"model_completed"},
            {"timestamp_ms":3,"run_id":"r","turn_id":"t","event":"tool_started","tool_call_id":"x"},
            {"timestamp_ms":4,"run_id":"r","turn_id":"t","event":"turn_completed"},
        ]
        self.assertEqual(prof.analyze(events, POLICY)["status"], "fail")

if __name__ == "__main__":
    unittest.main()

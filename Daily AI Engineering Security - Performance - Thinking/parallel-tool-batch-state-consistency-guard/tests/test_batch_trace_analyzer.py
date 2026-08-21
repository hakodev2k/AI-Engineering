import importlib.util, pathlib, unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "batch_trace_analyzer.py"
spec = importlib.util.spec_from_file_location("batch_trace_analyzer", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class BatchTraceAnalyzerTests(unittest.TestCase):
    def test_valid_batch(self):
        events = [
            (1, {"batch_id":"b1","event":"batch_created","timestamp":"1","tool_call_ids":["c1","c2"],"session_version":7}),
            (2, {"batch_id":"b1","tool_call_id":"c1","event":"started","timestamp":"2","session_version":7}),
            (3, {"batch_id":"b1","tool_call_id":"c2","event":"started","timestamp":"2","session_version":7}),
            (4, {"batch_id":"b1","tool_call_id":"c1","event":"succeeded","timestamp":"3","session_version":7}),
            (5, {"batch_id":"b1","tool_call_id":"c2","event":"rejected","timestamp":"3","session_version":7}),
        ]
        result = mod.analyze(events)
        self.assertTrue(result["ok"])

    def test_missing_sibling_terminal_blocks(self):
        events = [
            (1, {"batch_id":"b1","event":"batch_created","timestamp":"1","tool_call_ids":["c1","c2"]}),
            (2, {"batch_id":"b1","tool_call_id":"c1","event":"started","timestamp":"2"}),
            (3, {"batch_id":"b1","tool_call_id":"c2","event":"started","timestamp":"2"}),
            (4, {"batch_id":"b1","tool_call_id":"c1","event":"succeeded","timestamp":"3"}),
        ]
        result = mod.analyze(events)
        self.assertFalse(result["ok"])
        self.assertTrue(any("c2" in e and "terminal" in e for e in result["errors"]))

    def test_duplicate_start_blocks(self):
        events = [
            (1, {"batch_id":"b1","event":"batch_created","timestamp":"1","tool_call_ids":["c1"]}),
            (2, {"batch_id":"b1","tool_call_id":"c1","event":"started","timestamp":"2"}),
            (3, {"batch_id":"b1","tool_call_id":"c1","event":"started","timestamp":"2.1"}),
            (4, {"batch_id":"b1","tool_call_id":"c1","event":"succeeded","timestamp":"3"}),
        ]
        self.assertFalse(mod.analyze(events)["ok"])

if __name__ == "__main__":
    unittest.main()

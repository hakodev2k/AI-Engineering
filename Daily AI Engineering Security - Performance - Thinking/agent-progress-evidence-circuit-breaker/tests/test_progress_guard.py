import unittest
from scripts.progress_guard import evaluate

POLICY = {
    "max_consecutive_no_progress_windows": 2,
    "max_identical_tool_calls": 2,
    "terminal_task_states": ["paused", "blocked", "cancelled", "completed"],
    "accepted_progress_kinds": ["artifact_changed", "test_status_changed", "new_evidence", "unique_tool_result", "task_state_transition"],
    "commentary_counts_as_progress": False,
    "fail_closed_on_invalid_event": True,
}


class ProgressGuardTests(unittest.TestCase):
    def test_progress_allows_continuation(self):
        events = [
            {"kind": "artifact_changed", "changed": True, "task_state": "active"},
            {"kind": "continuation"},
        ]
        self.assertEqual(evaluate(events, POLICY)["decision"], "continue")

    def test_repeated_no_progress_stops(self):
        events = [{"kind": "continuation"}, {"kind": "commentary"}, {"kind": "tool_result", "changed": False}]
        result = evaluate(events, POLICY)
        self.assertEqual(result["decision"], "stop")
        self.assertEqual(result["reason"], "no_progress_limit")

    def test_identical_tool_calls_stop(self):
        call = {"kind": "tool_call", "tool": "read_file", "arguments": {"path": "a.txt"}}
        result = evaluate([call, call, call], POLICY)
        self.assertEqual(result["decision"], "stop")
        self.assertEqual(result["reason"], "identical_tool_call_limit")

    def test_paused_state_stops(self):
        result = evaluate([{"kind": "task_state_transition", "task_state": "paused", "changed": True}], POLICY)
        self.assertEqual(result["decision"], "stop")
        self.assertEqual(result["reason"], "terminal_task_state:paused")

    def test_commentary_is_not_progress(self):
        result = evaluate([{"kind": "commentary"}, {"kind": "commentary"}, {"kind": "commentary"}], POLICY)
        self.assertEqual(result["decision"], "stop")


if __name__ == "__main__":
    unittest.main()

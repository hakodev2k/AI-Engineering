import unittest

from scripts.progress_loop_guard import analyze


class ProgressLoopGuardTests(unittest.TestCase):
    def test_progressing_verification_cycle_continues(self):
        rows = [{"event": "edit", "state_id": "a"}, {"event": "verification", "state_id": "a", "fresh": True, "passed": False}, {"event": "edit", "state_id": "b"}, {"event": "verification", "state_id": "b", "fresh": True, "passed": True}]
        self.assertEqual(analyze(rows)["decision"], "continue")

    def test_stagnant_repetition_stops(self):
        rows = [{"event": "read", "state_id": "x"} for _ in range(5)]
        self.assertEqual(analyze(rows, max_identical=2)["decision"], "stop_stagnant")

    def test_terminal_state_stops(self):
        rows = [{"event": "verification", "state_id": "x", "task_status": "done"}]
        self.assertEqual(analyze(rows)["decision"], "stop_terminal")

    def test_redundant_verification_stops(self):
        rows = [{"event": "verification", "state_id": "x", "fresh": True, "passed": True} for _ in range(4)]
        result = analyze(rows, max_identical=99, max_verifications=2)
        self.assertEqual(result["decision"], "stop_redundant_verification")

    def test_missing_state_is_error(self):
        with self.assertRaises(ValueError):
            analyze([{"event": "edit"}])


if __name__ == "__main__":
    unittest.main()

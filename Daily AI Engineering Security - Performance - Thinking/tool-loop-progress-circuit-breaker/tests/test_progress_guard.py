import unittest
from scripts.progress_guard import evaluate


class ProgressGuardTests(unittest.TestCase):
    def test_allows_first_read(self):
        self.assertEqual(evaluate([], {"tool": "search", "args": {"q": "x"}, "kind": "read"})["decision"], "allow")

    def test_recovers_after_three_identical_no_progress_reads(self):
        h = [{"tool": "search", "args": {"q": "x"}, "status": "ok", "result_summary": "none", "progress": False}] * 3
        self.assertEqual(evaluate(h, {"tool": "search", "args": {"q": "x"}, "kind": "read"})["decision"], "recover")

    def test_progress_resets_same_outcome_streak(self):
        h = [
            {"tool": "search", "args": {"q": "a"}, "status": "ok", "result_summary": "none", "progress": False},
            {"tool": "search", "args": {"q": "b"}, "status": "ok", "result_summary": "new evidence", "progress": True},
        ]
        self.assertEqual(evaluate(h, {"tool": "search", "args": {"q": "c"}, "kind": "read"})["decision"], "allow")

    def test_blocks_mutating_replay_after_one_no_progress_execution(self):
        h = [{"tool": "write", "args": {"path": "a"}, "status": "ok", "result_summary": "unchanged", "progress": False}]
        self.assertEqual(evaluate(h, {"tool": "write", "args": {"path": "a"}, "kind": "mutate"})["decision"], "block")

    def test_varying_calls_same_outcome_trigger_recovery(self):
        h = [
            {"tool": "fetch", "args": {"url": "a"}, "status": "ok", "result_summary": "blocked", "progress": False},
            {"tool": "fetch", "args": {"url": "b"}, "status": "ok", "result_summary": "blocked", "progress": False},
            {"tool": "fetch", "args": {"url": "c"}, "status": "ok", "result_summary": "blocked", "progress": False},
        ]
        self.assertEqual(evaluate(h, {"tool": "fetch", "args": {"url": "d"}, "kind": "read"})["decision"], "recover")


if __name__ == "__main__":
    unittest.main()

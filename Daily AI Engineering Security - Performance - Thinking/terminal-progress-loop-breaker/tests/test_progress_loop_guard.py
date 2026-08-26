import unittest
from scripts.progress_loop_guard import evaluate, fingerprint

POLICY = {
    "warn_equivalent_failures": 2,
    "terminal_equivalent_failures": 4,
    "max_turns": 40,
    "max_tokens": 500000,
    "max_wall_seconds": 1800,
    "checkpoint_before_terminal": True,
    "volatile_argument_keys": ["request_id", "timestamp"],
}


def event(turn=1, result="timeout", markers=None, request_id="a"):
    return {
        "turn": turn,
        "tokens_used": turn * 1000,
        "wall_seconds": turn * 10,
        "tool": "search",
        "arguments": {"query": "alpha beta", "request_id": request_id},
        "result_class": result,
        "progress_markers": markers or [],
    }


class ProgressGuardTests(unittest.TestCase):
    def test_volatile_argument_does_not_change_fingerprint(self):
        self.assertEqual(
            fingerprint(event(request_id="a"), {"request_id"}),
            fingerprint(event(request_id="b"), {"request_id"}),
        )

    def test_warning_does_not_stop_early(self):
        state = {}
        state, _ = evaluate(state, event(1), POLICY)
        state, r = evaluate(state, event(2), POLICY)
        self.assertEqual(r["decision"], "continue")
        self.assertIn("equivalent_failure_warning_threshold", r["reasons"])

    def test_four_equivalent_failures_stop(self):
        state = {}
        for i in range(1, 5):
            state, r = evaluate(state, event(i, request_id=str(i)), POLICY)
        self.assertEqual(r["decision"], "checkpoint_and_stop")
        self.assertIn("equivalent_failure_terminal_threshold", r["reasons"])

    def test_new_progress_resets_terminal_effect(self):
        state = {}
        for i in range(1, 4):
            state, _ = evaluate(state, event(i), POLICY)
        state, r = evaluate(state, event(4, markers=["patch:abc123"]), POLICY)
        self.assertEqual(r["decision"], "continue")
        self.assertEqual(r["new_progress_markers"], ["patch:abc123"])

    def test_hard_token_budget_stops(self):
        e = event(1)
        e["tokens_used"] = 500000
        _, r = evaluate({}, e, POLICY)
        self.assertEqual(r["decision"], "checkpoint_and_stop")
        self.assertIn("token_budget_exhausted", r["reasons"])

    def test_success_does_not_count_as_failure_loop(self):
        _, r = evaluate({}, event(1, result="success"), POLICY)
        self.assertEqual(r["equivalent_failure_count"], 0)
        self.assertEqual(r["decision"], "continue")


if __name__ == "__main__":
    unittest.main()

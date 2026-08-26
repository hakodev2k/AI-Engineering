import unittest
from scripts.loop_budget_guard import evaluate

POLICY = {
    "max_iterations": 5,
    "max_tool_calls": 6,
    "max_total_tokens": 1000,
    "max_same_signature_without_progress": 3,
    "min_progress_delta": 1,
    "require_finite_limits": True,
}


def row(i, sig, progress=0, action="tool", inp=50, out=20):
    return {
        "iteration": i,
        "action": action,
        "signature": sig,
        "input_tokens": inp,
        "output_tokens": out,
        "progress_delta": progress,
    }


class LoopGuardTests(unittest.TestCase):
    def test_repetition_stops_early(self):
        r = evaluate([row(1, "load_skill"), row(2, "load_skill"), row(3, "load_skill")], POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("repeated_signature_without_progress", r["reasons"])
        self.assertEqual(r["stop_at_iteration"], 3)

    def test_progress_resets_repeat_counter(self):
        rows = [row(1, "load_skill"), row(2, "load_skill", progress=2), row(3, "load_skill")]
        self.assertTrue(evaluate(rows, POLICY)["ok"])

    def test_token_budget_blocks(self):
        r = evaluate([row(1, "a", progress=1, inp=600, out=500)], POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("max_total_tokens_exceeded", r["reasons"])

    def test_iteration_budget_blocks(self):
        r = evaluate([row(6, "a", progress=1)], POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("max_iterations_exceeded", r["reasons"])

    def test_invalid_unbounded_policy(self):
        bad = dict(POLICY)
        bad["max_iterations"] = None
        r = evaluate([], bad)
        self.assertFalse(r["ok"])
        self.assertEqual(r["decision"], "invalid_policy")


if __name__ == "__main__":
    unittest.main()

import unittest
from scripts.progress_guard import evaluate

POLICY = {
    "max_no_progress_streak": 3,
    "max_total_steps": 20,
    "require_durable_checkpoint_before_stop": True,
    "progress_fields": ["artifact_sha256", "workspace_sha256", "verification_sha256", "external_state_sha256"],
}


def step(arg, result="same", workspace="w1"):
    return {"tool_calls": [{"tool": "search", "args": {"q": arg}}], "tool_result": result, "workspace_sha256": workspace}


class ProgressGuardTests(unittest.TestCase):
    def test_repeated_no_progress_stops(self):
        r = evaluate([step("x"), step("x"), step("x")], POLICY)
        self.assertEqual(r["decision"], "stop")
        self.assertEqual(r["reason"], "repeated_action_without_new_evidence")

    def test_changing_result_is_progress(self):
        r = evaluate([step("x", "pending"), step("x", "done")], POLICY)
        self.assertEqual(r["decision"], "continue")
        self.assertEqual(r["reason"], "new_progress_evidence")

    def test_canonical_args_ignore_key_order(self):
        rows = [
            {"tool_calls": [{"tool": "t", "args": {"a": 1, "b": 2}}], "tool_result": "z"},
            {"tool_calls": [{"tool": "t", "args": {"b": 2, "a": 1}}], "tool_result": "z"},
            {"tool_calls": [{"tool": "t", "args": {"a": 1, "b": 2}}], "tool_result": "z"},
        ]
        self.assertEqual(evaluate(rows, POLICY)["decision"], "stop")

    def test_hard_limit_stops(self):
        p = dict(POLICY, max_total_steps=2)
        r = evaluate([step("a"), step("b")], p)
        self.assertEqual(r["reason"], "hard_step_limit")


if __name__ == "__main__":
    unittest.main()

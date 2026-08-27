import unittest
from scripts.checkpoint_guard import evaluate

POLICY = {
    "max_checkpoint_tokens": 2500,
    "max_rehydration_tokens": 12000,
    "max_raw_tail_tokens": 16000,
    "max_total_post_compaction_tokens": 36000,
    "required_checkpoint_fields": [
        "version", "epoch_id", "active_goal", "constraints", "decisions",
        "failed_or_rejected_approaches", "next_action", "active_context_keys",
        "verification_status"
    ],
    "critical_context_prefixes": ["security.", "auth.", "approval.", "task.constraint."],
    "fail_closed_on_missing_critical_context": True,
}

CHECKPOINT = {
    "version": 1,
    "epoch_id": "e2",
    "active_goal": "finish migration",
    "constraints": ["review before deploy"],
    "decisions": ["use staged rollout"],
    "failed_or_rejected_approaches": ["direct production cutover rejected"],
    "next_action": "run staging tests",
    "active_context_keys": ["task.constraint.review", "browser.profile"],
    "verification_status": "measured",
}


class CheckpointGuardTests(unittest.TestCase):
    def test_valid_rehydration_passes(self):
        before = {"epoch_id": "e1", "active_context": {"task.constraint.review": "required", "browser.profile": "p1"}}
        after = {"epoch_id": "e2", "active_context": dict(before["active_context"]), "checkpoint_tokens": 800, "rehydration_tokens": 500, "raw_tail_tokens": 4000, "total_post_compaction_tokens": 5300}
        self.assertEqual(evaluate(before, after, CHECKPOINT, POLICY)["status"], "pass")

    def test_missing_durable_context_blocks(self):
        before = {"epoch_id": "e1", "active_context": {"browser.profile": "p1"}}
        after = {"epoch_id": "e2", "active_context": {}}
        result = evaluate(before, after, CHECKPOINT, POLICY)
        self.assertEqual(result["status"], "block")
        self.assertIn("browser.profile", result["missing_active_context"])

    def test_missing_critical_context_blocks(self):
        before = {"epoch_id": "e1", "active_context": {"security.tool_approval": "human"}}
        cp = dict(CHECKPOINT)
        cp["active_context_keys"] = ["security.tool_approval"]
        after = {"epoch_id": "e2", "active_context": {}}
        result = evaluate(before, after, cp, POLICY)
        self.assertTrue(any(r.startswith("missing_critical_context") for r in result["reasons"]))

    def test_same_epoch_blocks(self):
        before = {"epoch_id": "e1", "active_context": {}}
        after = {"epoch_id": "e1", "active_context": {}}
        cp = dict(CHECKPOINT)
        cp["epoch_id"] = "e1"
        self.assertIn("epoch_not_rotated", evaluate(before, after, cp, POLICY)["reasons"])

    def test_budget_overrun_blocks(self):
        before = {"epoch_id": "e1", "active_context": {}}
        after = {"epoch_id": "e2", "active_context": {}, "checkpoint_tokens": 2600}
        result = evaluate(before, after, CHECKPOINT, POLICY)
        self.assertTrue(any(r.startswith("budget_exceeded:checkpoint_tokens") for r in result["reasons"]))


if __name__ == "__main__":
    unittest.main()

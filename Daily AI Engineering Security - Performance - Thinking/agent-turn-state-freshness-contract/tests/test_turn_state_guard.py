import json
import tempfile
import unittest
from pathlib import Path
import importlib.util

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "turn_state_guard.py"
spec = importlib.util.spec_from_file_location("turn_state_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(mod)

POLICY = {
    "required_identity_fields": ["thread_id", "turn_id"],
    "turn_scoped_terminal_fields": ["final_response", "structured_response", "completion_status", "decision", "verification_status"],
    "turn_scoped_evidence_fields": ["tool_results", "test_results", "approvals", "artifacts"],
    "require_owner_turn_id": True,
    "invalidate_terminal_fields_on_new_turn": True,
    "reject_foreign_turn_terminal_state": True,
    "reject_foreign_turn_evidence_at_finalize": True,
}


class TurnStateGuardTests(unittest.TestCase):
    def base_state(self):
        return {"thread_id": "thread-1", "turn_id": "turn-2", "active_turn_id": "turn-2"}

    def test_fresh_terminal_state_is_valid(self):
        state = self.base_state()
        state["final_response"] = {"owner_turn_id": "turn-2", "value": "new answer"}
        ok, violations = mod.validate_state(state, POLICY)
        self.assertTrue(ok)
        self.assertEqual([], violations)

    def test_prior_turn_terminal_state_is_rejected(self):
        state = self.base_state()
        state["structured_response"] = {"owner_turn_id": "turn-1", "value": {"answer": "old"}}
        ok, violations = mod.validate_state(state, POLICY)
        self.assertFalse(ok)
        self.assertIn("stale_terminal_state", {v["code"] for v in violations})

    def test_unowned_terminal_state_is_rejected(self):
        state = self.base_state()
        state["final_response"] = "legacy unversioned answer"
        ok, violations = mod.validate_state(state, POLICY)
        self.assertFalse(ok)
        self.assertIn("terminal_missing_owner", {v["code"] for v in violations})

    def test_foreign_turn_evidence_is_rejected(self):
        state = self.base_state()
        state["tool_results"] = [
            {"owner_turn_id": "turn-2", "value": "fresh"},
            {"owner_turn_id": "turn-1", "value": "stale"},
        ]
        ok, violations = mod.validate_state(state, POLICY)
        self.assertFalse(ok)
        self.assertIn("foreign_turn_evidence", {v["code"] for v in violations})

    def test_new_turn_invalidates_terminal_fields_but_keeps_memory(self):
        state = {
            "thread_id": "thread-1",
            "turn_id": "turn-1",
            "active_turn_id": "turn-1",
            "conversation_memory": {"preference": "concise"},
            "final_response": {"owner_turn_id": "turn-1", "value": "old"},
            "structured_response": {"owner_turn_id": "turn-1", "value": {"x": 1}},
        }
        result = mod.init_turn(state, POLICY, "turn-2")
        self.assertEqual("turn-2", result["active_turn_id"])
        self.assertIsNone(result["final_response"])
        self.assertIsNone(result["structured_response"])
        self.assertEqual({"preference": "concise"}, result["conversation_memory"])

    def test_missing_active_turn_is_rejected(self):
        state = {"thread_id": "thread-1"}
        ok, violations = mod.validate_state(state, POLICY)
        self.assertFalse(ok)
        self.assertEqual("missing_active_turn_id", violations[0]["code"])

    def test_stamp_adds_owner_and_revision(self):
        wrapped = mod.stamp({"status": "pass"}, "turn-9", 42)
        self.assertEqual("turn-9", wrapped["owner_turn_id"])
        self.assertEqual(42, wrapped["produced_at_revision"])


if __name__ == "__main__":
    unittest.main()

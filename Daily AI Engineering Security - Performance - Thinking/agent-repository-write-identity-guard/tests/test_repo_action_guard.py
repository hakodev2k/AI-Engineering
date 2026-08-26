import unittest
from scripts.repo_action_guard import evaluate

POLICY = {
    "protected_branches": ["main"],
    "high_risk_actions": ["push", "merge", "create_identity"],
    "forbidden_actions": ["create_identity", "force_push", "edit_audit_history"],
    "require_human_approval_for_high_risk": True,
    "require_independent_approver": True,
    "allow_agent_to_approve_self": False,
    "allow_direct_push_to_protected_branch": False,
    "require_actor_id": True,
    "require_change_reference": True,
}


class GuardTests(unittest.TestCase):
    def base(self, **overrides):
        event = {
            "action": "open_pr",
            "actor_id": "agent-1",
            "target_branch": "main",
            "change_reference": "task-123",
        }
        event.update(overrides)
        return event

    def test_low_risk_pr_allowed(self):
        self.assertTrue(evaluate(self.base(), POLICY)["ok"])

    def test_direct_push_protected_blocked(self):
        r = evaluate(self.base(action="push", human_approved=True, approver_id="human-1"), POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("direct_push_to_protected_branch", r["reasons"])

    def test_self_approval_blocked(self):
        r = evaluate(self.base(action="merge", human_approved=True, approver_id="agent-1"), POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("self_approval_forbidden", r["reasons"])

    def test_identity_creation_blocked(self):
        r = evaluate(self.base(action="create_identity", human_approved=True, approver_id="human-1"), POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("forbidden_action", r["reasons"])

    def test_history_mutation_blocked(self):
        r = evaluate(self.base(history_mutation=True), POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("audit_history_mutation_forbidden", r["reasons"])

    def test_high_risk_independent_approval(self):
        r = evaluate(self.base(action="merge", human_approved=True, approver_id="human-1"), POLICY)
        self.assertTrue(r["ok"])


if __name__ == "__main__":
    unittest.main()

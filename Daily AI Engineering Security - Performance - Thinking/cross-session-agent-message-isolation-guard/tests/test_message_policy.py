import unittest
from scripts.message_policy import decide

BASE = {
    "message_id": "m1",
    "sender_session": "s-child",
    "recipient_session": "s-peer",
    "sender_role": "workflow_child",
    "workflow_id": "wf-1",
    "parent_session": "s-parent",
    "authority": "agent",
    "same_workflow": True,
}

class PolicyTests(unittest.TestCase):
    def test_same_workflow_child_allowed(self):
        self.assertEqual(decide(BASE.copy())["decision"], "allow")

    def test_unrelated_child_denied(self):
        e = BASE | {"same_workflow": False, "human_approved": False}
        self.assertIn("cross_workflow_child_delivery_requires_human_approval", decide(e)["reasons"])

    def test_explicit_cross_workflow_approval_allowed(self):
        e = BASE | {"same_workflow": False, "human_approved": True}
        self.assertEqual(decide(e)["decision"], "allow")

    def test_agent_cannot_claim_human_authority(self):
        e = BASE | {"authority": "human"}
        self.assertIn("agent_cannot_relay_human_authority", decide(e)["reasons"])

    def test_reply_route_mismatch_denied(self):
        e = {
            "message_id": "m2", "sender_session": "wrong", "recipient_session": "s-child",
            "sender_role": "agent", "authority": "agent",
            "reply_to": {"message_id": "m1", "original_sender_session": "s-child", "original_recipient_session": "s-peer"},
        }
        self.assertIn("reply_sender_mismatch", decide(e)["reasons"])

    def test_missing_identity_denied(self):
        e = BASE.copy(); del e["recipient_session"]
        self.assertIn("missing:recipient_session", decide(e)["reasons"])

if __name__ == "__main__":
    unittest.main()

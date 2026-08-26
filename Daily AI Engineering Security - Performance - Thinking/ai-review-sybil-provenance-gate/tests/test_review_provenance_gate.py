import unittest
from scripts.review_provenance_gate import evaluate

POLICY = {
    "required_unique_controllers": 2,
    "require_human_codeowner": True,
    "allow_author_controller_approval": False,
}


class ReviewProvenanceGateTests(unittest.TestCase):
    def test_two_independent_controllers_with_human_codeowner_pass(self):
        event = {
            "author_controller_id": "author",
            "reviews": [
                {"login": "maintainer", "decision": "approved", "controller_id": "human-1", "provenance_status": "verified", "identity_type": "human", "codeowner": True},
                {"login": "review-agent", "decision": "approved", "controller_id": "org-agent-1", "provenance_status": "verified", "identity_type": "agent", "codeowner": False},
            ],
        }
        self.assertTrue(evaluate(event, POLICY)["ok"])

    def test_two_accounts_same_controller_count_once(self):
        event = {
            "author_controller_id": "author",
            "reviews": [
                {"login": "sock-1", "decision": "approved", "controller_id": "controller-x", "provenance_status": "verified", "identity_type": "agent", "codeowner": False},
                {"login": "sock-2", "decision": "approved", "controller_id": "controller-x", "provenance_status": "verified", "identity_type": "agent", "codeowner": False},
            ],
        }
        result = evaluate(event, POLICY)
        self.assertFalse(result["ok"])
        self.assertEqual(result["unique_controllers"], 1)

    def test_unknown_provenance_does_not_count(self):
        event = {
            "author_controller_id": "author",
            "reviews": [
                {"login": "unknown", "decision": "approved", "controller_id": "x", "provenance_status": "unknown", "identity_type": "human", "codeowner": True}
            ],
        }
        self.assertFalse(evaluate(event, POLICY)["ok"])

    def test_author_controlled_approval_rejected(self):
        event = {
            "author_controller_id": "same",
            "reviews": [
                {"login": "reviewer", "decision": "approved", "controller_id": "same", "provenance_status": "verified", "identity_type": "human", "codeowner": True}
            ],
        }
        result = evaluate(event, POLICY)
        self.assertFalse(result["ok"])
        self.assertEqual(result["rejected_reviews"][0]["reason"], "author_controlled_approval")

    def test_human_codeowner_required(self):
        event = {
            "author_controller_id": "author",
            "reviews": [
                {"login": "a1", "decision": "approved", "controller_id": "c1", "provenance_status": "verified", "identity_type": "agent", "codeowner": False},
                {"login": "a2", "decision": "approved", "controller_id": "c2", "provenance_status": "verified", "identity_type": "agent", "codeowner": False},
            ],
        }
        result = evaluate(event, POLICY)
        self.assertFalse(result["ok"])
        self.assertIn("trusted_human_codeowner_required", result["reasons"])


if __name__ == "__main__":
    unittest.main()

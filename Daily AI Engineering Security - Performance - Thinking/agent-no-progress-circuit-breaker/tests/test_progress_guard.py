import unittest
from scripts.progress_guard import analyze

POLICY = {
    "max_steps": 10,
    "max_no_progress_steps": 3,
    "max_same_fingerprint": 3,
    "max_total_tokens": 1000,
    "max_repeated_verifications": 3,
}


class ProgressGuardTests(unittest.TestCase):
    def test_repeated_action_opens_circuit(self):
        rows = [
            {"action": "search", "target": "same", "result": "same", "progress": False}
            for _ in range(3)
        ]
        result = analyze(rows, POLICY)
        self.assertEqual(result["decision"], "stop")
        self.assertTrue(
            {"no_progress_circuit_open", "repeated_action_circuit_open"}
            & set(result["reasons"])
        )

    def test_real_progress_allows_continuation(self):
        rows = [
            {"action": "edit", "target": "a.py", "result": "changed", "progress": True, "input_tokens": 100},
            {"action": "verify", "target": "tests", "result": "pass", "progress": True, "verification_receipt": "sha-1", "output_tokens": 20},
        ]
        self.assertEqual(analyze(rows, POLICY)["decision"], "continue")

    def test_stale_verification_receipt_stops(self):
        rows = [
            {"action": "verify", "target": "tests", "result": "pass", "progress": True, "verification_receipt": "sha-old"}
            for _ in range(3)
        ]
        result = analyze(rows, POLICY)
        self.assertIn("stale_verification_receipt_loop", result["reasons"])

    def test_token_budget_stops(self):
        rows = [
            {"action": "edit", "target": "a", "result": "1", "progress": True, "input_tokens": 700},
            {"action": "edit", "target": "b", "result": "2", "progress": True, "input_tokens": 400},
        ]
        self.assertIn("token_budget_exceeded", analyze(rows, POLICY)["reasons"])

    def test_empty_trace_fails_closed(self):
        result = analyze([], POLICY)
        self.assertEqual(result["decision"], "stop")
        self.assertEqual(result["status"], "insufficient_evidence")


if __name__ == "__main__":
    unittest.main()

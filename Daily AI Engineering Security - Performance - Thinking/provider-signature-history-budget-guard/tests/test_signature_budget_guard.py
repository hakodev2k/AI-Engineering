import unittest
from scripts.signature_budget_guard import transform


BASE_POLICY = {
    "signature_fields": ["thoughtSignature", "thought_signature", "textSignature"],
    "required_active_part_types": ["functionCall", "function_call"],
    "recent_turns": 2,
    "max_recommended_signature_bytes": 8,
    "estimated_bytes_per_token": 4.0,
    "reserved_context_tokens": 100,
    "retain_archival_hashes": True,
    "fail_if_required_signature_missing": True,
    "fail_if_required_signatures_exceed_reserved_tokens": True,
}


class SignatureBudgetGuardTests(unittest.TestCase):
    def test_preserves_required_active_signature(self):
        payload = {"turns": [{"role": "model", "active_loop": True, "parts": [{"type": "functionCall", "thoughtSignature": "abcdef"}]}]}
        result = transform(payload, BASE_POLICY)
        self.assertTrue(result["ok"])
        part = result["transformed"]["turns"][0]["parts"][0]
        self.assertEqual(part["thoughtSignature"], "abcdef")
        self.assertEqual(result["ledger"][0]["classification"], "required_active")

    def test_blocks_missing_required_active_signature(self):
        payload = {"turns": [{"role": "model", "active_loop": True, "parts": [{"type": "functionCall", "name": "lookup"}]}]}
        result = transform(payload, BASE_POLICY)
        self.assertFalse(result["ok"])
        self.assertIn("missing_required_signature:turn=0:part=0", result["errors"])

    def test_strips_archival_signature_and_keeps_hash(self):
        payload = {"turns": [
            {"role": "model", "active_loop": False, "parts": [{"type": "text", "thoughtSignature": "old-signature"}]},
            {"role": "user", "parts": [{"type": "text", "text": "a"}]},
            {"role": "user", "parts": [{"type": "text", "text": "b"}]},
        ]}
        result = transform(payload, BASE_POLICY)
        part = result["transformed"]["turns"][0]["parts"][0]
        self.assertNotIn("thoughtSignature", part)
        self.assertIn("signature_archive", part)
        self.assertGreater(result["metrics"]["signature_bytes_removed"], 0)

    def test_recent_optional_signature_obeys_budget(self):
        payload = {"turns": [
            {"role": "model", "active_loop": False, "parts": [{"type": "text", "thoughtSignature": "123456"}]},
            {"role": "model", "active_loop": False, "parts": [{"type": "text", "thoughtSignature": "abcdef"}]},
        ]}
        result = transform(payload, BASE_POLICY)
        first = result["transformed"]["turns"][0]["parts"][0]
        second = result["transformed"]["turns"][1]["parts"][0]
        self.assertIn("thoughtSignature", first)
        self.assertNotIn("thoughtSignature", second)
        self.assertEqual(result["ledger"][1]["action"], "strip_budget_exceeded")

    def test_blocks_when_required_signature_budget_exceeds_reserved_tokens(self):
        policy = dict(BASE_POLICY)
        policy["reserved_context_tokens"] = 1
        payload = {"turns": [{"role": "model", "active_loop": True, "parts": [{"type": "functionCall", "thoughtSignature": "12345678"}]}]}
        result = transform(payload, policy)
        self.assertFalse(result["ok"])
        self.assertIn("required_signature_budget_exceeds_reserved_context_tokens", result["errors"])


if __name__ == "__main__":
    unittest.main()

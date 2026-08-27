import unittest
from scripts.prefix_drift_guard import compare


def doc(contents, tokens=200000):
    return {"blocks": [{"kind": "system", "content": x} for x in contents], "estimated_input_tokens": tokens}


class PrefixDriftGuardTests(unittest.TestCase):
    def test_stable_prefix_passes(self):
        result = compare(doc(["a", "b"]), doc(["a", "b"]))
        self.assertTrue(result["ok"])
        self.assertEqual(result["decision"], "stable")

    def test_early_drift_blocks(self):
        result = compare(doc(["a", "b"]), doc(["x", "b"]))
        self.assertFalse(result["ok"])
        self.assertEqual(result["first_changed_block"], 0)
        self.assertEqual(result["estimated_recache_tokens"], 200000)

    def test_tail_drift_blocks(self):
        result = compare(doc(["a", "b"]), doc(["a", "x"]))
        self.assertFalse(result["ok"])
        self.assertEqual(result["first_changed_block"], 1)

    def test_explicit_approval_allows_known_drift(self):
        result = compare(doc(["a"]), doc(["x"]), approved=True)
        self.assertTrue(result["ok"])
        self.assertEqual(result["decision"], "approved_drift")

    def test_hash_output_does_not_echo_content(self):
        result = compare(doc(["secret-value"]), doc(["secret-value"]))
        self.assertNotIn("secret-value", str(result))


if __name__ == "__main__":
    unittest.main()

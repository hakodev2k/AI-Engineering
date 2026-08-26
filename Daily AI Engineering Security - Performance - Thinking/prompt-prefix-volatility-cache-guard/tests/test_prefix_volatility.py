import unittest
from scripts.prefix_volatility import analyze


class PrefixVolatilityTests(unittest.TestCase):
    def test_unchanged(self):
        m = [{"id": "system", "tokens": 100, "content": "stable"}]
        r = analyze(m, m, 0)
        self.assertEqual(r["status"], "unchanged")
        self.assertTrue(r["within_budget"])

    def test_early_change_has_large_blast_radius(self):
        a = [
            {"id": "system", "tokens": 100, "content": "date=1"},
            {"id": "tools", "tokens": 900, "content": "schemas"},
            {"id": "history", "tokens": 500, "content": "h"},
        ]
        b = [
            {"id": "system", "tokens": 100, "content": "date=2"},
            {"id": "tools", "tokens": 900, "content": "schemas"},
            {"id": "history", "tokens": 500, "content": "h"},
        ]
        r = analyze(a, b, 1000)
        self.assertEqual(r["blast_radius_tokens"], 1500)
        self.assertFalse(r["within_budget"])

    def test_late_change_limits_blast_radius(self):
        a = [{"id": "system", "tokens": 1000, "content": "stable"}, {"id": "runtime", "tokens": 50, "content": "cwd=a"}]
        b = [{"id": "system", "tokens": 1000, "content": "stable"}, {"id": "runtime", "tokens": 50, "content": "cwd=b"}]
        r = analyze(a, b, 100)
        self.assertEqual(r["blast_radius_tokens"], 50)
        self.assertTrue(r["within_budget"])

    def test_required_over_budget_is_measured_not_deleted(self):
        a = [{"id": "policy", "tokens": 200, "content": "a"}]
        b = [{"id": "policy", "tokens": 200, "content": "b", "required": True}]
        r = analyze(a, b, 100)
        self.assertEqual(r["recommendation"], "measure_required_exemption")
        self.assertFalse(r["within_budget"])


if __name__ == "__main__":
    unittest.main()

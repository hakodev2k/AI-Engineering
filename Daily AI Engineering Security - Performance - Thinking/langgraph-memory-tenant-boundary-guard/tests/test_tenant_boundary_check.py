import importlib.util
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "tenant_boundary_check.py"
spec = importlib.util.spec_from_file_location("tenant_boundary_check", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


class TenantBoundaryCheckTests(unittest.TestCase):
    def test_clean_records_pass(self):
        report = module.analyze([
            {"request_tenant": "a", "object_tenant": "a", "filter": {"kind": "memory"}},
            {"request_tenant": "b", "object_tenant": "b", "filter": None},
        ])
        self.assertTrue(report["ok"])
        self.assertEqual(report["violation_count"], 0)

    def test_cross_tenant_object_fails(self):
        report = module.analyze([
            {"request_tenant": "alice", "object_tenant": "alice2", "operation": "search"}
        ])
        self.assertFalse(report["ok"])
        self.assertEqual(report["violations_by_type"]["cross_tenant_object"], 1)

    def test_nested_mongodb_operator_fails(self):
        report = module.analyze([
            {
                "request_tenant": "a",
                "object_tenant": "a",
                "filter": {"metadata": {"tenant": {"$ne": "a"}}},
            }
        ])
        self.assertFalse(report["ok"])
        self.assertEqual(report["violations_by_type"]["unsafe_query_operator"], 1)

    def test_missing_identity_fails(self):
        report = module.analyze([{"filter": {"kind": "memory"}}])
        self.assertFalse(report["ok"])
        self.assertIn("missing_request_tenant", report["violations_by_type"])
        self.assertIn("missing_object_tenant", report["violations_by_type"])


if __name__ == "__main__":
    unittest.main()

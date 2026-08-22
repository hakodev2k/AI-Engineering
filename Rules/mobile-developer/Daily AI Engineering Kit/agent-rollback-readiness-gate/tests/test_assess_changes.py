import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("assess_changes", ROOT / "scripts" / "assess-changes.py")
mod = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(mod)


class AssessChangesTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.cfg = json.loads((ROOT / "config" / "rollback-readiness.json").read_text(encoding="utf-8"))

    def test_database_migration_requires_approval(self):
        result = mod.assess(["src/Migrations/20260819_AddIndex.cs"], self.cfg, tests_changed=True)
        self.assertEqual("needs-approval", result["status"])
        self.assertIn("database_migration", result["approval_required_for"])
        self.assertEqual("high", result["risk_level"] if result["risk_score"] >= self.cfg["thresholds"]["high"] else result["risk_level"])

    def test_code_without_tests_adds_test_gap(self):
        result = mod.assess(["src/service.py"], self.cfg, tests_changed=False)
        self.assertIn("test_gap", result["detected_categories"])
        self.assertEqual(3, result["risk_score"])

    def test_low_risk_documentation_change(self):
        result = mod.assess(["docs/readme.md"], self.cfg, tests_changed=False)
        self.assertEqual("ready-for-review", result["status"])
        self.assertEqual("low", result["risk_level"])
        self.assertEqual([], result["approval_required_for"])

    def test_security_change_requires_approval(self):
        result = mod.assess(["src/security/authorization-policy.cs", "tests/security-tests.cs"], self.cfg, tests_changed=True)
        self.assertEqual("needs-approval", result["status"])
        self.assertIn("security_control", result["approval_required_for"])


if __name__ == "__main__":
    unittest.main()

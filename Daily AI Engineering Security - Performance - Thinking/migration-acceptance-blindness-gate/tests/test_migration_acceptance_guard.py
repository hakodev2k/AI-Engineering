import unittest
from scripts.migration_acceptance_guard import evaluate

POLICY={
 "required_artifacts":["migration-plan","migration-audit","behavioral-tests","independent-verification"],
 "forbidden_residual_patterns":["legacy-dependency","compatibility-shim","old-runtime-entrypoint"],
 "min_behavioral_pass_rate":1.0,
 "require_independent_verifier":True
}

class MigrationAcceptanceTests(unittest.TestCase):
    def good(self):
        return {
          "artifacts":["migration-plan","migration-audit","behavioral-tests","independent-verification"],
          "expected_new_markers":["new-runtime"],
          "found_new_markers":["new-runtime"],
          "residual_legacy_markers":[],
          "behavioral_pass_rate":1.0,
          "independent_verifier_passed":True,
          "migration_attempted":True
        }
    def test_accepts_complete_migration(self):
        self.assertTrue(evaluate(self.good(), POLICY)["ok"])
    def test_rejects_green_tests_without_migration(self):
        r=self.good(); r["migration_attempted"]=False
        self.assertIn("migration_not_demonstrated", evaluate(r, POLICY)["reasons"])
    def test_rejects_residual_shim(self):
        r=self.good(); r["residual_legacy_markers"]=["compatibility-shim"]
        self.assertFalse(evaluate(r, POLICY)["ok"])
    def test_rejects_missing_marker(self):
        r=self.good(); r["found_new_markers"]=[]
        self.assertFalse(evaluate(r, POLICY)["ok"])
    def test_rejects_failed_independent_verification(self):
        r=self.good(); r["independent_verifier_passed"]=False
        self.assertFalse(evaluate(r, POLICY)["ok"])

if __name__=="__main__":
    unittest.main()

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/migration_gate.py"
POLICY = ROOT / "config/policy.json"


def run(plan):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump(plan, f)
        path = f.name
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--plan", path, "--policy", str(POLICY)],
        capture_output=True,
        text=True,
    )
    return result.returncode, json.loads(result.stdout)


def base_plan(environment="staging"):
    return {
        "environment": environment,
        "change_id": "test-change",
        "breaking_change": False,
        "expand_contract": False,
        "backup_reference": None,
        "approval_reference": None,
        "lock_timeout_seconds": 5,
        "statement_timeout_seconds": 60,
        "operations": [{"type": "add_column", "description": "safe additive column"}],
        "rollback": {"strategy": "remove after application rollback", "tested": True, "data_loss_possible": False},
        "verification": {"checks": ["column exists", "smoke test passes"]},
    }


class MigrationGateTests(unittest.TestCase):
    def test_safe_additive_change_passes(self):
        code, result = run(base_plan())
        self.assertEqual(code, 0)
        self.assertEqual(result["status"], "passed")
        self.assertFalse(result["executed"])

    def test_large_unbatched_backfill_blocks(self):
        plan = base_plan()
        plan["operations"] = [{"type": "data_backfill", "description": "backfill", "estimated_rows": 20000, "batched": False}]
        code, result = run(plan)
        self.assertEqual(code, 2)
        self.assertTrue(any(x["code"] == "UNBATCHED_LARGE_BACKFILL" for x in result["findings"]))

    def test_breaking_without_expand_contract_blocks(self):
        plan = base_plan()
        plan["breaking_change"] = True
        code, result = run(plan)
        self.assertEqual(code, 2)
        self.assertTrue(any(x["code"] == "EXPAND_CONTRACT_REQUIRED" for x in result["findings"]))

    def test_production_destructive_operation_blocks(self):
        plan = base_plan("production")
        plan["backup_reference"] = "snapshot-123"
        plan["operations"] = [{"type": "drop_column", "description": "drop obsolete column"}]
        code, result = run(plan)
        self.assertEqual(code, 2)
        self.assertTrue(any(x["code"] == "DESTRUCTIVE_PRODUCTION_OPERATION" for x in result["findings"]))

    def test_approval_required_operation_requires_reference(self):
        plan = base_plan()
        plan["operations"] = [{"type": "create_index", "description": "create index", "online": True}]
        code, result = run(plan)
        self.assertEqual(code, 4)
        self.assertEqual(result["status"], "approval_required")
        plan["approval_reference"] = "approved-change-42"
        code2, result2 = run(plan)
        self.assertEqual(code2, 0)
        self.assertEqual(result2["status"], "passed")


if __name__ == "__main__":
    unittest.main()

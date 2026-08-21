import json
import pathlib
import subprocess
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCAN = ROOT / "scripts" / "scan-migration-risk.py"
VERIFY = ROOT / "scripts" / "verify-migration-evidence.py"
EXAMPLE = ROOT / "examples" / "migration-evidence.example.json"

class MigrationScriptsTests(unittest.TestCase):
    def run_py(self, script, *args):
        return subprocess.run([sys.executable, str(script), *map(str, args)], capture_output=True, text=True)

    def test_safe_additive_sql_passes_scanner(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "safe.sql"
            path.write_text("ALTER TABLE orders ADD COLUMN status_v2 text;\n", encoding="utf-8")
            result = self.run_py(SCAN, path)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertEqual(json.loads(result.stdout)["blocking_findings"], 0)

    def test_destructive_sql_is_blocked(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "risky.sql"
            path.write_text("ALTER TABLE orders DROP COLUMN status;\n", encoding="utf-8")
            result = self.run_py(SCAN, path)
            self.assertEqual(result.returncode, 1)
            self.assertGreater(json.loads(result.stdout)["blocking_findings"], 0)

    def test_example_evidence_verifies(self):
        result = self.run_py(VERIFY, EXAMPLE)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(json.loads(result.stdout)["status"], "verified")

    def test_required_approval_without_reference_fails(self):
        data = json.loads(EXAMPLE.read_text(encoding="utf-8"))
        data["approval_required"] = True
        data["approval_reference"] = None
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "evidence.json"
            path.write_text(json.dumps(data), encoding="utf-8")
            result = self.run_py(VERIFY, path)
            self.assertEqual(result.returncode, 1)

if __name__ == "__main__":
    unittest.main()

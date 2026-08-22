import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "preflight.py"
spec = importlib.util.spec_from_file_location("preflight", SCRIPT)
preflight = importlib.util.module_from_spec(spec); spec.loader.exec_module(preflight)

class PreflightTests(unittest.TestCase):
    def test_safe_create_passes_without_approval_pattern(self):
        findings, count = preflight.scan("CREATE TABLE t (id INT);", preflight.DEFAULT)
        self.assertEqual(count, 1)
        self.assertFalse(any(f["severity"] in ("block", "approval_required") for f in findings))

    def test_drop_database_blocks(self):
        findings, _ = preflight.scan("DROP DATABASE app;", preflight.DEFAULT)
        self.assertTrue(any(f["severity"] == "block" for f in findings))

    def test_drop_column_requires_approval(self):
        findings, _ = preflight.scan("ALTER TABLE users DROP COLUMN old_name;", preflight.DEFAULT)
        self.assertTrue(any(f["severity"] == "approval_required" for f in findings))

    def test_unbounded_delete_blocks(self):
        findings, _ = preflight.scan("DELETE FROM sessions;", preflight.DEFAULT)
        self.assertTrue(any(f["rule"] == "unbounded-data-change" and f["severity"] == "block" for f in findings))

    def test_bounded_delete_not_unbounded(self):
        findings, _ = preflight.scan("DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;", preflight.DEFAULT)
        self.assertFalse(any(f["rule"] == "unbounded-data-change" for f in findings))
        self.assertTrue(any(f["severity"] == "approval_required" for f in findings))

    def test_comments_do_not_trigger(self):
        findings, _ = preflight.scan("-- DROP DATABASE nope\nSELECT 1;", preflight.DEFAULT)
        self.assertFalse(any(f["severity"] == "block" for f in findings))

if __name__ == "__main__":
    unittest.main()

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

MODULE = Path(__file__).resolve().parents[1] / "scripts" / "mcp_process_audit.py"
spec = importlib.util.spec_from_file_location("audit", MODULE)
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)

POLICY = {
    "max_active_per_identity": 1,
    "orphan_grace_seconds": 30,
    "max_orphans": 0,
    "max_duplicate_identities": 0,
    "require_owner_for_mcp": True,
    "mcp_command_markers": ["mcp"],
    "ignore_command_substrings": []
}

class AuditTests(unittest.TestCase):
    def test_clean_snapshot_passes(self):
        snapshot = {"live_owner_ids": ["s1"], "processes": [
            {"pid": 10, "command": "node my-mcp-server.js", "owner_id": "s1", "server_identity": "docs", "scope_key": "s1", "host_instance": "h", "age_seconds": 5}
        ]}
        report = audit.audit(snapshot, POLICY)
        self.assertEqual(report["status"], "pass")
        self.assertEqual(report["metrics"]["orphan_count"], 0)

    def test_duplicate_identity_fails(self):
        snapshot = {"live_owner_ids": ["s1"], "processes": [
            {"pid": 10, "command": "node mcp.js", "owner_id": "s1", "identity": "h|s1|docs", "age_seconds": 5},
            {"pid": 11, "command": "node mcp.js", "owner_id": "s1", "identity": "h|s1|docs", "age_seconds": 6}
        ]}
        report = audit.audit(snapshot, POLICY)
        self.assertEqual(report["status"], "fail")
        self.assertEqual(report["metrics"]["duplicate_identity_count"], 1)

    def test_stale_owner_is_orphan(self):
        snapshot = {"live_owner_ids": [], "processes": [
            {"pid": 12, "command": "python mcp_server.py", "owner_id": "dead", "identity": "h|dead|repo", "age_seconds": 90}
        ]}
        report = audit.audit(snapshot, POLICY)
        self.assertEqual(report["status"], "fail")
        self.assertEqual(report["metrics"]["orphan_count"], 1)

    def test_policy_validation_rejects_zero_active_limit(self):
        bad = dict(POLICY)
        bad["max_active_per_identity"] = 0
        with self.assertRaises(ValueError):
            audit.validate_policy(bad)

if __name__ == "__main__":
    unittest.main()

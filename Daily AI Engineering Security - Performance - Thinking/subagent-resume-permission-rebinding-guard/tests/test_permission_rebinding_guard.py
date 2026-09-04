import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "permission_rebinding_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)

CFG = {
    "required_fields": ["approval_policy", "sandbox_policy", "role", "policy_version"],
    "permission_order": {
        "sandbox_policy": ["read-only", "workspace-write", "full-access"],
        "approval_policy": ["always", "on-request", "never"],
    },
    "ignored_fields": ["observed_at", "transition_id"],
}

BASE = {
    "approval_policy": "on-request",
    "sandbox_policy": "workspace-write",
    "role": "builder",
    "policy_version": "v2",
    "tools": ["read", "write"],
}


class PermissionGuardTests(unittest.TestCase):
    def test_match(self):
        classification, detail = guard.classify(BASE, dict(BASE), CFG)
        self.assertEqual(classification, "match")
        self.assertEqual(detail, {})

    def test_broadening(self):
        effective = dict(BASE, sandbox_policy="full-access", approval_policy="never")
        classification, _ = guard.classify(BASE, effective, CFG)
        self.assertEqual(classification, "broadening")

    def test_restrictive_reset(self):
        effective = dict(BASE, sandbox_policy="read-only", approval_policy="always")
        classification, _ = guard.classify(BASE, effective, CFG)
        self.assertEqual(classification, "restrictive_drift")

    def test_stale_role_policy(self):
        effective = dict(BASE, role="researcher", policy_version="v1")
        classification, detail = guard.classify(BASE, effective, CFG)
        self.assertEqual(classification, "stale_role_policy")
        self.assertIn("diffs", detail)

    def test_missing_required_field(self):
        effective = dict(BASE)
        del effective["policy_version"]
        classification, detail = guard.classify(BASE, effective, CFG)
        self.assertEqual(classification, "missing_provenance")
        self.assertIn("policy_version", detail["missing_effective"])

    def test_ignored_observation_metadata(self):
        expected = dict(BASE, observed_at="2026-09-04T09:00:00Z")
        effective = dict(BASE, observed_at="2026-09-04T09:00:01Z")
        classification, _ = guard.classify(expected, effective, CFG)
        self.assertEqual(classification, "match")


if __name__ == "__main__":
    unittest.main()

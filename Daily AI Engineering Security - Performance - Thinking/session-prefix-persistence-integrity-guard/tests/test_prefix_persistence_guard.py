import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "prefix_persistence_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)

CFG = {
    "required_runtime_identity_fields": ["provider", "model", "toolset_hash", "renderer_version"],
    "require_nonempty_prefix": True,
    "require_segment_order_match": True,
    "same_runtime_requires_exact_bytes": True,
    "changed_runtime_requires_rebaseline": True,
}
IDENTITY = {"provider": "example", "model": "m1", "toolset_hash": "tools-v1", "renderer_version": "r1"}
BASE = {
    "runtime_identity": IDENTITY,
    "prefix_segments": [
        {"name": "system", "content": "stable system"},
        {"name": "history-1", "content": "hello"},
    ],
}


class PrefixPersistenceGuardTests(unittest.TestCase):
    def test_exact_match(self):
        code, result = guard.analyze(BASE, {"runtime_identity": dict(IDENTITY), "prefix_segments": [dict(s) for s in BASE["prefix_segments"]]}, CFG)
        self.assertEqual(code, 0)
        self.assertEqual(result["classification"], "exact_match")

    def test_byte_drift(self):
        resumed = {"runtime_identity": dict(IDENTITY), "prefix_segments": [dict(s) for s in BASE["prefix_segments"]]}
        resumed["prefix_segments"][1]["content"] = "Hello"
        code, result = guard.analyze(BASE, resumed, CFG)
        self.assertEqual(code, 2)
        self.assertEqual(result["classification"], "prefix_byte_drift")
        self.assertIsInstance(result["first_diff_byte"], int)

    def test_segment_reordering(self):
        resumed = {"runtime_identity": dict(IDENTITY), "prefix_segments": list(reversed([dict(s) for s in BASE["prefix_segments"]]))}
        code, result = guard.analyze(BASE, resumed, CFG)
        self.assertEqual(code, 2)
        self.assertEqual(result["classification"], "segment_order_or_membership_drift")

    def test_runtime_change_requires_rebaseline(self):
        changed = dict(IDENTITY, model="m2")
        resumed = {"runtime_identity": changed, "prefix_segments": [dict(s) for s in BASE["prefix_segments"]]}
        code, result = guard.analyze(BASE, resumed, CFG)
        self.assertEqual(code, 2)
        self.assertEqual(result["classification"], "rebaseline_required")

    def test_missing_prefix_rejected(self):
        resumed = {"runtime_identity": dict(IDENTITY), "prefix_segments": []}
        with self.assertRaises(ValueError):
            guard.analyze(BASE, resumed, CFG)

    def test_missing_runtime_identity_field_rejected(self):
        bad_identity = dict(IDENTITY)
        del bad_identity["renderer_version"]
        resumed = {"runtime_identity": bad_identity, "prefix_segments": [dict(s) for s in BASE["prefix_segments"]]}
        with self.assertRaises(ValueError):
            guard.analyze(BASE, resumed, CFG)


if __name__ == "__main__":
    unittest.main()

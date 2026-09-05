import importlib.util
import pathlib
import unittest

P = pathlib.Path(__file__).parents[1] / "scripts" / "scope_gate.py"
spec = importlib.util.spec_from_file_location("gate", P)
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)

POLICY = {"destructive_operations": ["delete"], "human_required": ["delete"], "protected_roots": ["production"]}
BASE = {
    "operation": "delete",
    "targets": ["tmp/a"],
    "target_fingerprints": {"tmp/a": "h"},
    "approved_by_type": "human",
    "expires_at": 200,
    "nonce": "12345678"
}

class ScopeGateTests(unittest.TestCase):
    def test_pass(self):
        plan = {"operation": "delete", "targets": ["tmp/a"], "target_fingerprints": {"tmp/a": "h"}}
        self.assertEqual([], gate.validate(POLICY, BASE, plan, 100))

    def test_broadened_target_blocks(self):
        plan = {"operation": "delete", "targets": ["tmp/a", "tmp/b"], "target_fingerprints": {"tmp/a": "h", "tmp/b": "x"}}
        self.assertTrue(gate.validate(POLICY, BASE, plan, 100))

    def test_stale_state_blocks(self):
        plan = {"operation": "delete", "targets": ["tmp/a"], "target_fingerprints": {"tmp/a": "changed"}}
        self.assertTrue(gate.validate(POLICY, BASE, plan, 100))

    def test_human_required(self):
        approval = dict(BASE, approved_by_type="agent")
        plan = {"operation": "delete", "targets": ["tmp/a"], "target_fingerprints": {"tmp/a": "h"}}
        self.assertTrue(gate.validate(POLICY, approval, plan, 100))

    def test_protected_root_requires_override(self):
        approval = dict(BASE, targets=["production/db"], target_fingerprints={"production/db": "x"})
        plan = {"operation": "delete", "targets": ["production/db"], "target_fingerprints": {"production/db": "x"}}
        self.assertTrue(any("protected" in x for x in gate.validate(POLICY, approval, plan, 100)))

    def test_protected_root_explicit_override(self):
        approval = dict(BASE, targets=["production/db"], target_fingerprints={"production/db": "x"}, protected_override=True)
        plan = {"operation": "delete", "targets": ["production/db"], "target_fingerprints": {"production/db": "x"}}
        self.assertEqual([], gate.validate(POLICY, approval, plan, 100))

if __name__ == "__main__":
    unittest.main()

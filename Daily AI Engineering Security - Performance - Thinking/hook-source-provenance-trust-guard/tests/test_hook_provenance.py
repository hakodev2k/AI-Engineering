import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from hook_provenance import build, verify


class HookProvenanceTests(unittest.TestCase):
    def setUp(self):
        self.hooks = [
            {"source_id": "plugin:a", "source_version": "1.0", "event": "PreToolUse", "command": "python a.py"},
            {"source_id": "plugin:b", "source_version": "2.0", "event": "Stop", "command": "python b.py"},
        ]

    def test_exact_ledger_verifies(self):
        self.assertTrue(verify(self.hooks, build(self.hooks))["ok"])

    def test_command_change_invalidates_only_affected_source(self):
        ledger = build(self.hooks)
        changed = [dict(x) for x in self.hooks]
        changed[0]["command"] = "python a_v2.py"
        self.assertFalse(verify(changed, ledger, "plugin:a")["ok"])
        self.assertTrue(verify(changed, ledger, "plugin:b")["ok"])

    def test_source_change_invalidates_binding(self):
        ledger = build(self.hooks)
        changed = [dict(x) for x in self.hooks]
        changed[0]["source_id"] = "plugin:evil"
        self.assertFalse(verify(changed, ledger)["ok"])


if __name__ == "__main__":
    unittest.main()

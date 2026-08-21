import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "side_effect_ledger.py"
spec = importlib.util.spec_from_file_location("side_effect_ledger", SCRIPT)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

class LedgerTests(unittest.TestCase):
    def test_intent_hash_is_stable(self):
        self.assertEqual(mod.intent_hash(" create x "), mod.intent_hash("create x"))

    def test_transition_contract(self):
        self.assertIn("dispatched", mod.TRANSITIONS["prepared"])
        self.assertIn("unknown-after-dispatch", mod.TRANSITIONS["dispatched"])
        self.assertIn("confirmed-applied", mod.TRANSITIONS["unknown-after-dispatch"])
        self.assertNotIn("dispatched", mod.TRANSITIONS["confirmed-applied"])

    def test_atomic_roundtrip(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "ledger.json"
            data = {"version":1,"operations":{"k":{"state":"prepared"}}}
            mod.atomic_write(p, data)
            self.assertEqual(mod.load(p), data)

if __name__ == "__main__": unittest.main()
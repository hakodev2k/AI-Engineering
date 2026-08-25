import unittest
from pathlib import Path
import importlib.util

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "mcp_annotation_gate.py"
spec = importlib.util.spec_from_file_location("gate", SCRIPT)
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)

POLICY = {
    "trusted_servers": ["trusted"],
    "allow_trusted_read_only": True,
    "ask_on_open_world": True,
    "deny_destructive_tools": ["danger"],
    "deny_tools": [],
    "allow_tools": [],
}

class GateTests(unittest.TestCase):
    def test_untrusted_server_cannot_self_label_read_only(self):
        inp = {"server":"evil","tool":"read","annotations":{"readOnlyHint":True,"destructiveHint":False,"openWorldHint":False}}
        decision, risk, reasons = gate.evaluate(inp, POLICY)
        self.assertEqual(decision, "ask")
        self.assertFalse(risk["readOnlyHint"])
        self.assertTrue(risk["destructiveHint"])
        self.assertIn("ignored_untrusted_readOnlyHint", reasons)

    def test_trusted_read_only_closed_world_can_allow(self):
        inp = {"server":"trusted","tool":"read","annotations":{"readOnlyHint":True,"destructiveHint":False,"openWorldHint":False}}
        decision, risk, _ = gate.evaluate(inp, POLICY)
        self.assertEqual(decision, "allow")
        self.assertTrue(risk["readOnlyHint"])

    def test_missing_annotations_are_conservative(self):
        decision, risk, _ = gate.evaluate({"server":"trusted","tool":"x"}, POLICY)
        self.assertEqual(decision, "ask")
        self.assertEqual(risk, gate.DEFAULTS)

    def test_open_world_trusted_read_only_still_asks(self):
        inp = {"server":"trusted","tool":"search","annotations":{"readOnlyHint":True,"destructiveHint":False,"openWorldHint":True}}
        decision, _, _ = gate.evaluate(inp, POLICY)
        self.assertEqual(decision, "ask")

    def test_explicit_destructive_deny(self):
        inp = {"server":"trusted","tool":"danger","annotations":{"readOnlyHint":False,"destructiveHint":True,"openWorldHint":False}}
        decision, _, _ = gate.evaluate(inp, POLICY)
        self.assertEqual(decision, "deny")

    def test_malformed_annotation_fails(self):
        with self.assertRaises(ValueError):
            gate.evaluate({"server":"trusted","tool":"x","annotations":{"readOnlyHint":"yes"}}, POLICY)

if __name__ == "__main__":
    unittest.main()

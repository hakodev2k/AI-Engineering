import importlib.util
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "approval_context_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)

class GuardTests(unittest.TestCase):
    def base(self):
        args = {"path": "/repo/a.txt", "content": "safe"}
        return {"risk": "write", "source": {"toolCallId": "c1", "toolName": "write_file", "rawInput": args, "rawInputParseStatus": "ok"}, "display": {"toolName": "write_file", "rawInput": args}}

    def test_matching_sensitive_payload_allows(self):
        self.assertEqual(guard.evaluate(self.base())["verdict"], "allow")

    def test_missing_display_blocks(self):
        d = self.base(); d["display"].pop("rawInput")
        r = guard.evaluate(d)
        self.assertEqual(r["verdict"], "block")
        self.assertIn("display_input_missing", r["reasons"])

    def test_defaulted_source_blocks(self):
        d = self.base(); d["source"]["rawInputParseStatus"] = "defaulted"
        self.assertIn("source_input_defaulted", guard.evaluate(d)["reasons"])

    def test_payload_mismatch_blocks(self):
        d = self.base(); d["display"]["rawInput"] = {"path": "/repo/b.txt", "content": "safe"}
        self.assertIn("source_display_payload_mismatch", guard.evaluate(d)["reasons"])

    def test_hash_binding(self):
        d = self.base(); d["decision"] = {"actionSha256": guard.sha(d["source"]["rawInput"])}
        self.assertEqual(guard.evaluate(d)["verdict"], "allow")
        d["decision"]["actionSha256"] = "0" * 64
        self.assertIn("approval_hash_mismatch", guard.evaluate(d)["reasons"])

if __name__ == "__main__":
    unittest.main()

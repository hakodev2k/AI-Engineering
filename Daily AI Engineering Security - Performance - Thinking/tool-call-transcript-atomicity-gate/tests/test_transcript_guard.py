import importlib.util
import json
import pathlib
import tempfile
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "transcript_guard.py"
spec = importlib.util.spec_from_file_location("transcript_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(mod)


class TranscriptGuardTests(unittest.TestCase):
    def test_valid_call_result(self):
        report = mod.analyze([
            {"type": "call", "call_id": "a"},
            {"type": "result", "call_id": "a"},
        ])
        self.assertTrue(report.valid)

    def test_unresolved_detected(self):
        report = mod.analyze([{"type": "call", "call_id": "a"}])
        self.assertFalse(report.valid)
        self.assertEqual(1, len(report.unresolved))

    def test_orphan_terminal_detected(self):
        report = mod.analyze([{"type": "result", "call_id": "a"}])
        self.assertTrue(report.orphan_terminals)

    def test_duplicate_call_id_detected(self):
        report = mod.analyze([
            {"type": "call", "call_id": "a"},
            {"type": "call", "call_id": "a"},
        ])
        self.assertTrue(report.duplicates)

    def test_cancel_is_terminal(self):
        report = mod.analyze([
            {"type": "call", "call_id": "a"},
            {"type": "cancel", "call_id": "a"},
        ])
        self.assertTrue(report.valid)

    def test_repair_closes_only_unresolved(self):
        events = [{"type": "call", "call_id": "a"}]
        with tempfile.TemporaryDirectory() as td:
            out = pathlib.Path(td) / "out.jsonl"
            mod.write_repaired(events, out)
            repaired = mod.read_events(out)
            self.assertTrue(mod.analyze(repaired).valid)
            self.assertEqual("cancel", repaired[-1]["type"])
            self.assertEqual("a", repaired[-1]["call_id"])

    def test_repair_does_not_create_result(self):
        events = [{"type": "call", "call_id": "a"}]
        with tempfile.TemporaryDirectory() as td:
            out = pathlib.Path(td) / "out.jsonl"
            mod.write_repaired(events, out)
            rows = [json.loads(x) for x in out.read_text().splitlines()]
            self.assertFalse(any(x.get("type") == "result" for x in rows))


if __name__ == "__main__":
    unittest.main()

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "subagent_status_guard.py"
spec = importlib.util.spec_from_file_location("subagent_status_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def base(**kw):
    e = {"child_id":"c1","task_id":"t1","dispatch_generation":3,"current_dispatch_generation":3,"status":"success","terminal_state":"completed","terminal_reason":"completed","result_present":True,"result_id":"sha256:abc","unresolved_tool_calls":0,"live_descendants":0}
    e.update(kw)
    return e


def run(events):
    with tempfile.TemporaryDirectory() as td:
        p = Path(td) / "events.jsonl"
        p.write_text("\n".join(json.dumps(e) for e in events), encoding="utf-8")
        return mod.validate_file(p)


class StatusGuardTests(unittest.TestCase):
    def codes(self, e):
        return {v["code"] for v in run([e])["violations"]}

    def test_valid_completion_passes(self):
        self.assertTrue(run([base()])["verified"])

    def test_tool_deferred_success_blocks(self):
        self.assertIn("success_noncompleted_terminal", self.codes(base(terminal_state="tool_deferred", terminal_reason="tool_deferred", result_present=False, result_id="")))

    def test_limit_success_blocks(self):
        codes = self.codes(base(terminal_state="limit", terminal_reason="MAX_TURNS"))
        self.assertIn("success_noncompleted_terminal", codes)
        self.assertIn("success_adverse_terminal_reason", codes)

    def test_missing_deliverable_blocks(self):
        self.assertIn("success_missing_deliverable", self.codes(base(result_present=False, result_id="")))

    def test_unresolved_tool_blocks(self):
        self.assertIn("success_with_unresolved_tools", self.codes(base(unresolved_tool_calls=1)))

    def test_live_descendant_blocks(self):
        self.assertIn("success_with_live_descendants", self.codes(base(live_descendants=2)))

    def test_stale_generation_blocks(self):
        self.assertIn("stale_dispatch_generation", self.codes(base(current_dispatch_generation=4)))


if __name__ == "__main__":
    unittest.main()

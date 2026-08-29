import importlib.util, pathlib, unittest
SCRIPT=pathlib.Path(__file__).parents[1]/"scripts"/"validate_response_trace.py"
spec=importlib.util.spec_from_file_location("trace_validator",SCRIPT); mod=importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(mod)

class TraceTests(unittest.TestCase):
    def policy(self): return dict(mod.DEFAULT)
    def test_visible(self): self.assertEqual("visible",mod.classify({"finish_reason":"stop","content":"done"},self.policy()))
    def test_tool_without_text(self): self.assertEqual("tool",mod.classify({"finish_reason":"stop","content":"","tool_calls":[{"name":"x"}]},self.policy()))
    def test_structured(self): self.assertEqual("structured",mod.classify({"finish_reason":"stop","structured_output":{"ok":True}},self.policy()))
    def test_explicit_no_reply(self): self.assertEqual("no_reply",mod.classify({"finish_reason":"stop","explicit_no_reply":True},self.policy()))
    def test_empty_stop_is_invalid(self): self.assertEqual("invalid_empty_terminal",mod.classify({"finish_reason":"stop","content":"","reasoning_content":"present"},self.policy()))
    def test_placeholder_not_visible(self): self.assertEqual("invalid_empty_terminal",mod.classify({"finish_reason":"stop","content":"(No response generated)"},self.policy()))
    def test_truncation_never_complete(self):
        r=mod.validate([{"finish_reason":"length","content":"","marked_complete":True}],self.policy()); self.assertFalse(r["ok"]); self.assertTrue(any("truncation_marked_complete" in x for x in r["violations"]))
    def test_retry_budget_blocks(self):
        r=mod.validate([{"finish_reason":"stop","content":"","retry_index":2}],self.policy()); self.assertFalse(r["ok"]); self.assertTrue(any("retry_budget_exhausted" in x for x in r["violations"]))
    def test_recoverable_before_cap(self):
        r=mod.validate([{"finish_reason":"stop","content":"","retry_index":1}],self.policy()); self.assertTrue(r["ok"]); self.assertEqual(1,r["recoverable_empty_terminals"])
    def test_invalid_delivery_is_blocked(self):
        r=mod.validate([{"finish_reason":"stop","content":"","delivered_as_success":True}],self.policy()); self.assertFalse(r["ok"])

if __name__=="__main__": unittest.main()

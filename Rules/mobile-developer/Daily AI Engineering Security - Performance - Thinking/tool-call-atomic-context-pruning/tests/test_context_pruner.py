#!/usr/bin/env python3
"""Unit tests for atomic context pruning."""
import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("context_pruner", ROOT / "scripts" / "context_pruner.py")
mod = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(mod)

BASE_CFG = {
    "max_estimated_tokens": 1000,
    "reserved_output_tokens": 100,
    "preserve_system_messages": True,
    "preserve_latest_user_message": True,
    "min_recent_units": 2,
    "chars_per_token_estimate": 4.0,
    "fail_on_invalid_input_history": True,
}

class PrunerTests(unittest.TestCase):
    def test_valid_tool_transaction(self):
        msgs=[
            {"role":"user","content":"weather"},
            {"role":"assistant","content":"","tool_calls":[{"id":"c1","name":"weather"}]},
            {"role":"tool","tool_call_id":"c1","content":"sunny"},
            {"role":"assistant","content":"It is sunny"},
        ]
        self.assertEqual(mod.validate(msgs), [])
        units=mod.atomic_units(msgs)
        self.assertEqual(len(units),3)
        self.assertEqual(len(units[1]),2)

    def test_orphan_tool_is_invalid(self):
        msgs=[{"role":"user","content":"x"},{"role":"tool","tool_call_id":"c1","content":"y"}]
        self.assertTrue(any("orphan tool" in x for x in mod.validate(msgs)))
        with self.assertRaises(ValueError):
            mod.prune(msgs, BASE_CFG)

    def test_missing_tool_result_is_invalid(self):
        msgs=[{"role":"user","content":"x"},{"role":"assistant","content":"","tool_calls":[{"id":"c1"}]},{"role":"assistant","content":"next"}]
        self.assertTrue(any("expects" in x for x in mod.validate(msgs)))

    def test_pruning_never_splits_tool_group(self):
        large="x"*800
        msgs=[
            {"role":"system","content":"policy"},
            {"role":"user","content":"old"+large},
            {"role":"assistant","content":"","tool_calls":[{"id":"c1"}]},
            {"role":"tool","tool_call_id":"c1","content":large},
            {"role":"user","content":"current"},
            {"role":"assistant","content":"working"},
        ]
        cfg=dict(BASE_CFG); cfg["max_estimated_tokens"]=350; cfg["reserved_output_tokens"]=50; cfg["min_recent_units"]=2
        result, code=mod.prune(msgs,cfg)
        self.assertIn(code,(0,4))
        self.assertEqual(mod.validate(result["messages"]),[])
        ids=[m.get("tool_call_id") for m in result["messages"] if m.get("role")=="tool"]
        assistant_ids=[c["id"] for m in result["messages"] if m.get("role")=="assistant" for c in m.get("tool_calls",[])]
        self.assertEqual(sorted(ids),sorted(assistant_ids))

    def test_budget_unmet_does_not_drop_protected_latest_context(self):
        msgs=[{"role":"system","content":"s"*1000},{"role":"user","content":"u"*1000}]
        cfg=dict(BASE_CFG); cfg["max_estimated_tokens"]=100; cfg["reserved_output_tokens"]=10
        result, code=mod.prune(msgs,cfg)
        self.assertEqual(code,4)
        self.assertEqual(len(result["messages"]),2)
        self.assertEqual(result["decision"],"budget_unmet_without_dropping_protected_context")

if __name__ == "__main__":
    unittest.main()

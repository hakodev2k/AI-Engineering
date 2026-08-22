#!/usr/bin/env python3
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "context_fit_gate.py"
spec = importlib.util.spec_from_file_location("context_fit_gate", SCRIPT)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)

POLICY = {
    "default_context_limit": 200000,
    "minimum_output_reserve": 12000,
    "minimum_headroom_tokens": 8000,
    "max_utilization_ratio": 0.9,
    "allow_optional_context_reduction": True,
    "allow_model_reroute": True,
    "approved_reroute_models": {"large": True},
    "required_components": ["system", "required_context", "user_input"],
    "optional_reduction_order": ["duplicate_history", "optional_tool_schemas"],
    "fail_closed_on_unknown_limit": True,
}


class ContextFitGateTests(unittest.TestCase):
    def test_allows_safe_envelope(self):
        data = {
            "model": "small",
            "context_limit": 200000,
            "components": {"system": 20000, "required_context": 30000, "user_input": 5000, "tool_schemas": 10000},
            "required_components": ["system", "required_context", "user_input"],
            "output_reserve": 12000,
        }
        result, code = module.evaluate(data, POLICY)
        self.assertEqual(code, module.ALLOW)
        self.assertEqual(result["decision"], "allow")

    def test_blocks_fixed_required_overflow(self):
        data = {
            "model": "small",
            "context_limit": 200000,
            "components": {"system": 175000, "required_context": 10000, "user_input": 1000},
            "required_components": ["system", "required_context", "user_input"],
            "output_reserve": 12000,
        }
        result, code = module.evaluate(data, POLICY)
        self.assertEqual(code, module.BLOCK)
        self.assertIn("required envelope", result["reason"])

    def test_requests_optional_reduction(self):
        data = {
            "model": "small",
            "context_limit": 200000,
            "components": {
                "system": 70000,
                "required_context": 60000,
                "user_input": 5000,
                "duplicate_history": 25000,
                "optional_tool_schemas": 10000,
            },
            "required_components": ["system", "required_context", "user_input"],
            "output_reserve": 12000,
        }
        result, code = module.evaluate(data, POLICY)
        self.assertEqual(code, module.REDUCE)
        self.assertEqual(result["decision"], "reduce_optional")
        self.assertTrue(result["reduction_plan"])

    def test_reroutes_required_envelope_when_approved_model_fits(self):
        data = {
            "model": "small",
            "context_limit": 200000,
            "components": {"system": 150000, "required_context": 30000, "user_input": 5000},
            "required_components": ["system", "required_context", "user_input"],
            "output_reserve": 12000,
            "reroute_candidates": {"large": 400000},
        }
        result, code = module.evaluate(data, POLICY)
        self.assertEqual(code, module.REROUTE)
        self.assertEqual(result["viable_reroutes"][0]["model"], "large")

    def test_unknown_limit_fails_closed(self):
        data = {
            "model": "unknown",
            "components": {"system": 1000, "required_context": 1000, "user_input": 1000},
            "required_components": ["system", "required_context", "user_input"],
            "output_reserve": 12000,
        }
        result, code = module.evaluate(data, POLICY)
        self.assertEqual(code, module.BLOCK)
        self.assertEqual(result["decision"], "block")


if __name__ == "__main__":
    unittest.main()

import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "fixed_overhead_sentinel.py"
spec = importlib.util.spec_from_file_location("fixed_overhead_sentinel", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

POLICY = {
    "max_fixed_tokens": 60000,
    "max_context_utilization_pct": 30.0,
    "max_absolute_increase_tokens": 10000,
    "max_relative_increase_pct": 20.0,
    "max_component_relative_increase_pct": 30.0,
    "require_component_breakdown": True,
}

BASE = {
    "profile": "p", "model": "m", "context_limit_tokens": 200000, "fixed_tokens": 30000,
    "components": {"system":7000,"tools":9000,"rules":2000,"skills":4000,"mcp":3000,"subagents":2000,"memory_attachments":2000,"other":1000}
}


class FixedOverheadSentinelTests(unittest.TestCase):
    def test_equal_candidate_passes(self):
        result = mod.compare(POLICY, dict(BASE), dict(BASE))
        self.assertEqual(result["status"], "ok")

    def test_total_regression_blocked(self):
        candidate = dict(BASE)
        candidate["fixed_tokens"] = 47000
        candidate["components"] = {"system":7000,"tools":19000,"rules":2000,"skills":9000,"mcp":3000,"subagents":4000,"memory_attachments":2000,"other":1000}
        result = mod.compare(POLICY, BASE, candidate)
        codes = {v["code"] for v in result["violations"]}
        self.assertIn("max_absolute_increase_tokens", codes)
        self.assertIn("max_relative_increase_pct", codes)

    def test_context_fit_failure_blocked(self):
        candidate = dict(BASE)
        candidate["context_limit_tokens"] = 20000
        result = mod.compare(POLICY, BASE, candidate)
        codes = {v["code"] for v in result["violations"]}
        self.assertIn("does_not_fit_context", codes)

    def test_component_sum_must_match_total(self):
        candidate = dict(BASE)
        candidate["fixed_tokens"] = 31000
        with self.assertRaises(ValueError):
            mod.compare(POLICY, BASE, candidate)

    def test_component_regression_blocked(self):
        candidate = dict(BASE)
        candidate["fixed_tokens"] = 32000
        candidate["components"] = dict(BASE["components"])
        candidate["components"]["tools"] = 11000
        result = mod.compare(POLICY, BASE, candidate)
        self.assertEqual(result["status"], "ok")
        candidate["components"]["tools"] = 13000
        candidate["fixed_tokens"] = 34000
        result = mod.compare(POLICY, BASE, candidate)
        codes = {v["code"] for v in result["violations"]}
        self.assertIn("component_relative_increase", codes)


if __name__ == "__main__":
    unittest.main()

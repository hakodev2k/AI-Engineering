#!/usr/bin/env python3
import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "readiness_gate.py"
spec = importlib.util.spec_from_file_location("readiness_gate", SCRIPT)
rg = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(rg)


def policy():
    return {
        "core_ready_slo_ms": 2000,
        "core_ready_regression_percent": 10,
        "max_parallel_initializers": 4,
        "default_required_timeout_ms": 5000,
        "default_background_timeout_ms": 8000,
        "default_on_demand_timeout_ms": 10000,
        "max_retries_per_server": 1,
        "retry_backoff_ms": 1000,
        "failure_cooldown_ms": 60000,
        "optional_servers_may_block_core_ready": False,
        "servers": {
            "required": {"class": "required", "timeout_ms": 5000, "capabilities": ["a"]},
            "optional": {"class": "background", "timeout_ms": 8000, "capabilities": ["b"]},
        },
    }


def bench(p95=1000, blocks=0, peak=2, runs=7, valid=7, timeouts=0, scenario="normal"):
    return {
        "scenario": scenario,
        "summary": {
            "core_ready_p95_ms": p95,
            "optional_block_count": blocks,
            "peak_initializers": peak,
            "run_count": runs,
            "valid_core_ready_count": valid,
            "timeouts": timeouts,
        },
    }


class PolicyTests(unittest.TestCase):
    def test_valid_policy(self):
        self.assertEqual([], rg.validate_policy(policy()))

    def test_optional_blocking_cannot_be_enabled(self):
        p = policy(); p["optional_servers_may_block_core_ready"] = True
        self.assertTrue(any("must be false" in x for x in rg.validate_policy(p)))

    def test_unknown_server_class_fails(self):
        p = policy(); p["servers"]["optional"]["class"] = "eager"
        self.assertTrue(any("invalid class" in x for x in rg.validate_policy(p)))

    def test_enabled_server_requires_timeout(self):
        p = policy(); p["servers"]["required"]["timeout_ms"] = 0
        self.assertTrue(any("positive timeout" in x for x in rg.validate_policy(p)))


class CompareTests(unittest.TestCase):
    def test_candidate_passes(self):
        failures, result = rg.compare(policy(), bench(1000), bench(900))
        self.assertEqual([], failures); self.assertTrue(result["pass"])

    def test_slo_regression_fails(self):
        failures, _ = rg.compare(policy(), bench(1000), bench(2100))
        self.assertTrue(any("exceeds SLO" in x for x in failures))

    def test_baseline_relative_regression_fails(self):
        failures, _ = rg.compare(policy(), bench(1000), bench(1200))
        self.assertTrue(any("baseline regression limit" in x for x in failures))

    def test_optional_block_fails(self):
        failures, _ = rg.compare(policy(), bench(), bench(blocks=1))
        self.assertTrue(any("optional_block_count" in x for x in failures))

    def test_parallel_initializer_bound_fails(self):
        failures, _ = rg.compare(policy(), bench(), bench(peak=5))
        self.assertTrue(any("peak_initializers" in x for x in failures))

    def test_invalid_samples_fail(self):
        failures, _ = rg.compare(policy(), bench(), bench(runs=7, valid=6))
        self.assertTrue(any("fully valid" in x for x in failures))

    def test_normal_timeout_fails(self):
        failures, _ = rg.compare(policy(), bench(), bench(timeouts=1))
        self.assertTrue(any("timeouts" in x for x in failures))

    def test_fault_scenario_may_timeout_but_not_regress_core(self):
        failures, _ = rg.compare(policy(), bench(), bench(p95=900, timeouts=1, scenario="slow-optional"))
        self.assertEqual([], failures)


if __name__ == "__main__":
    unittest.main(verbosity=2)

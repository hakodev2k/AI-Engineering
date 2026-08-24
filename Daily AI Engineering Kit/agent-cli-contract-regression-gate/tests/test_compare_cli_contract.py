from __future__ import annotations

import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("compare_cli_contract", ROOT / "scripts/compare_cli_contract.py")
assert SPEC and SPEC.loader
MOD = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MOD)
POLICY = MOD.validate_policy(json.loads((ROOT / "config/policy.json").read_text(encoding="utf-8")))


def contract(options=None, positionals=None, exit_codes=None):
    return MOD.validate_contract({
        "version": 1,
        "commands": [{
            "name": "deploy",
            "options": options or [],
            "positionals": positionals or [],
            "exit_codes": exit_codes or [0],
        }],
    }, "test")


class CliContractTests(unittest.TestCase):
    def test_adding_option_is_compatible(self):
        base = contract()
        cand = contract(options=[{"name": "--verbose", "required": False, "default": False, "choices": []}])
        report = MOD.compare(base, cand, POLICY)
        self.assertEqual("compatible", report["status"])

    def test_removing_option_is_breaking(self):
        option = {"name": "--verbose", "required": False, "default": False, "choices": []}
        report = MOD.compare(contract(options=[option]), contract(), POLICY)
        self.assertEqual(1, report["breaking_count"])
        self.assertEqual("removed-option", report["findings"][0]["kind"])

    def test_optional_to_required_is_breaking(self):
        before = {"name": "--environment", "required": False, "default": "staging", "choices": []}
        after = {"name": "--environment", "required": True, "default": "staging", "choices": []}
        report = MOD.compare(contract(options=[before]), contract(options=[after]), POLICY)
        self.assertTrue(any(f["kind"] == "requiredness" for f in report["findings"]))

    def test_choice_narrowing_is_breaking(self):
        before = {"name": "--environment", "required": False, "default": "staging", "choices": ["staging", "production"]}
        after = {"name": "--environment", "required": False, "default": "staging", "choices": ["production"]}
        report = MOD.compare(contract(options=[before]), contract(options=[after]), POLICY)
        self.assertTrue(any(f["kind"] == "choice-narrowing" for f in report["findings"]))

    def test_default_change_can_be_policy_allowed(self):
        before = {"name": "--environment", "required": False, "default": "staging", "choices": []}
        after = {"name": "--environment", "required": False, "default": "production", "choices": []}
        policy = dict(POLICY)
        policy["allowed_default_changes"] = ["deploy:--environment"]
        report = MOD.compare(contract(options=[before]), contract(options=[after]), policy)
        self.assertEqual("compatible", report["status"])

    def test_removed_exit_code_is_breaking(self):
        report = MOD.compare(contract(exit_codes=[0, 2]), contract(exit_codes=[0]), POLICY)
        self.assertTrue(any(f["kind"] == "removed-exit-code" for f in report["findings"]))


if __name__ == "__main__":
    unittest.main()

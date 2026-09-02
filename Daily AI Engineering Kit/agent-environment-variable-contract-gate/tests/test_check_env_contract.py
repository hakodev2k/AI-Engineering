from __future__ import annotations

import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("checker", ROOT / "scripts/check_env_contract.py")
assert SPEC and SPEC.loader
CHECKER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(CHECKER)
CONTRACT = CHECKER.validate_contract(json.loads((ROOT / "config/env-contract.json").read_text(encoding="utf-8")))


class EnvContractTests(unittest.TestCase):
    def test_development_example_passes(self):
        values = CHECKER.parse_env_file(ROOT / "examples/.env.example")
        result = CHECKER.evaluate(CONTRACT, values, "development", True)
        self.assertEqual("pass", result["status"])

    def test_missing_production_database_url_fails(self):
        values = {"APP_ENV": "production", "APP_PORT": "8080", "LOG_LEVEL": "info"}
        result = CHECKER.evaluate(CONTRACT, values, "production", False)
        self.assertEqual("fail", result["status"])
        self.assertIn("missing_required", {v["code"] for v in result["violations"]})

    def test_undocumented_variable_fails(self):
        values = {"APP_ENV": "test", "UNDECLARED_FLAG": "1"}
        result = CHECKER.evaluate(CONTRACT, values, "test", False)
        self.assertIn("undocumented", {v["code"] for v in result["violations"]})

    def test_invalid_allowed_value_fails(self):
        values = {"APP_ENV": "qa"}
        result = CHECKER.evaluate(CONTRACT, values, "test", False)
        self.assertIn("not_allowed", {v["code"] for v in result["violations"]})

    def test_real_looking_secret_in_sample_fails(self):
        values = {"APP_ENV": "production", "APP_PORT": "8080", "DATABASE_URL": "postgres://user:SuperSecret123456789@db/prod"}
        result = CHECKER.evaluate(CONTRACT, values, "production", True)
        self.assertIn("secret_in_sample", {v["code"] for v in result["violations"]})

    def test_secret_placeholder_in_sample_passes_pattern_check(self):
        values = {"APP_ENV": "production", "APP_PORT": "8080", "DATABASE_URL": "<secret>", "LOG_LEVEL": "info"}
        result = CHECKER.evaluate(CONTRACT, values, "production", True)
        self.assertEqual("pass", result["status"])


if __name__ == "__main__":
    unittest.main()

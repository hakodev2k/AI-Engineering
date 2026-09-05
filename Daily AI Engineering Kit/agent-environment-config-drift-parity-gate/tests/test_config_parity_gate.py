from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("gate", ROOT / "scripts/config_parity_gate.py")
assert SPEC and SPEC.loader
GATE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(GATE)

POLICY = {
    "required_environments": ["dev", "staging", "production"],
    "ignore_keys": [],
    "must_match_values": ["VERSION"],
    "secret_name_patterns": ["SECRET", "TOKEN", "API_KEY"],
    "allowed_secret_placeholders": ["<redacted>", ""]
}


def manifest(env, values):
    return {"environment": env, "values": values}


class ConfigParityTests(unittest.TestCase):
    def test_equal_contract_passes(self):
        values = {"VERSION": {"type": "string", "required": True, "value": "1"}}
        report = GATE.compare([manifest("dev", values), manifest("staging", values), manifest("production", values)], POLICY)
        self.assertEqual("pass", report["status"])

    def test_missing_required_key_fails(self):
        spec = {"A": {"type": "string", "required": True, "value": "x"}}
        report = GATE.compare([manifest("dev", spec), manifest("staging", spec), manifest("production", {})], POLICY)
        self.assertEqual("fail", report["status"])
        self.assertTrue(any(f["kind"] == "missing_required_key" for f in report["findings"]))

    def test_type_mismatch_fails(self):
        a = {"A": {"type": "string", "required": True, "value": "1"}}
        b = {"A": {"type": "integer", "required": True, "value": 1}}
        report = GATE.compare([manifest("dev", a), manifest("staging", a), manifest("production", b)], POLICY)
        self.assertTrue(any(f["kind"] == "type_mismatch" for f in report["findings"]))

    def test_must_match_value_fails(self):
        a = {"VERSION": {"type": "string", "required": True, "value": "1"}}
        b = {"VERSION": {"type": "string", "required": True, "value": "2"}}
        report = GATE.compare([manifest("dev", a), manifest("staging", a), manifest("production", b)], POLICY)
        self.assertTrue(any(f["kind"] == "value_mismatch" for f in report["findings"]))

    def test_secret_value_fails(self):
        safe = {"SERVICE_API_KEY": {"type": "secret", "required": True, "value": "<redacted>"}}
        unsafe = {"SERVICE_API_KEY": {"type": "secret", "required": True, "value": "abc123"}}
        report = GATE.compare([manifest("dev", safe), manifest("staging", safe), manifest("production", unsafe)], POLICY)
        self.assertTrue(any(f["kind"] == "secret_value_committed" for f in report["findings"]))


if __name__ == "__main__":
    unittest.main()

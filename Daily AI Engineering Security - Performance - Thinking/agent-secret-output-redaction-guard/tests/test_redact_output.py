import importlib.util
import os
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPT = Path(__file__).parents[1] / "scripts" / "redact_output.py"
SPEC = importlib.util.spec_from_file_location("redact_output", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

POLICY = {
    "version": 1,
    "replacement": "[REDACTED]",
    "minimum_secret_length": 8,
    "secret_environment_variables": ["SYNTHETIC_TOKEN"],
    "blocked_command_patterns": [r"(^|[;&|]\s*)(env|printenv)(\s|$)"],
}


class RedactionTests(unittest.TestCase):
    def test_registered_value_is_masked(self):
        secret = "synthetic-value-that-authenticates-nowhere"
        with patch.dict(os.environ, {"SYNTHETIC_TOKEN": secret}, clear=False):
            output, count = MODULE.redact("token=" + secret, POLICY)
        self.assertNotIn(secret, output)
        self.assertGreaterEqual(count, 1)

    def test_assignment_and_bearer_are_masked(self):
        output, count = MODULE.redact("password=hunter123 Authorization: Bearer abcdefghijklmnop", POLICY)
        self.assertNotIn("hunter123", output)
        self.assertNotIn("abcdefghijklmnop", output)
        self.assertGreaterEqual(count, 2)

    def test_environment_dump_is_blocked(self):
        self.assertTrue(MODULE.command_is_blocked("printenv", POLICY))
        self.assertFalse(MODULE.command_is_blocked("git status --short", POLICY))


if __name__ == "__main__":
    unittest.main()

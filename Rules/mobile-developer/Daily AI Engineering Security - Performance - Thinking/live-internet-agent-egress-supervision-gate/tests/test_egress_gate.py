#!/usr/bin/env python3
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("egress_gate", ROOT / "scripts" / "egress_gate.py")
MOD = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MOD)


class GateTests(unittest.TestCase):
    def test_host_match_exact_and_wildcard(self):
        self.assertTrue(MOD.host_matches("api.example.com", "api.example.com"))
        self.assertTrue(MOD.host_matches("a.example.com", "*.example.com"))
        self.assertFalse(MOD.host_matches("example.com", "*.example.com"))
        self.assertFalse(MOD.host_matches("evil-example.com", "*.example.com"))

    def test_private_detection(self):
        self.assertTrue(MOD.is_private_or_special("127.0.0.1"))
        self.assertTrue(MOD.is_private_or_special("169.254.169.254"))
        self.assertTrue(MOD.is_private_or_special("localhost"))
        self.assertFalse(MOD.is_private_or_special("8.8.8.8"))

    def test_normalization(self):
        self.assertEqual(MOD.normalized_target("HTTPS://Example.COM/path", None), ("example.com", "https"))


if __name__ == "__main__":
    unittest.main()

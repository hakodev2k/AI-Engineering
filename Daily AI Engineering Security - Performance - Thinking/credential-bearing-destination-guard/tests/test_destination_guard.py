#!/usr/bin/env python3
"""Unit tests for destination_guard without live DNS dependencies."""
import importlib.util
import pathlib
import unittest
from unittest.mock import patch

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("destination_guard", ROOT / "scripts" / "destination_guard.py")
mod = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(mod)

POLICY = {
    "allowed_schemes": ["https"],
    "allowed_hosts": ["broker.example.com"],
    "allowed_host_suffixes": [".mq.example.com"],
    "allowed_ports": [443],
    "require_global_ip": True,
    "reject_userinfo": True,
    "redirects_allowed": False,
    "credential_classes_requiring_guard": ["oauth"],
    "require_approval_when_host_not_exact": True,
}

class GuardTests(unittest.TestCase):
    @patch.object(mod, "resolve", return_value=["93.184.216.34"])
    def test_exact_host_allowed(self, _):
        result, code = mod.evaluate({"url":"https://broker.example.com/api","credential_class":"oauth","operation":"connect"}, POLICY)
        self.assertEqual(code, 0)
        self.assertEqual(result["decision"], "allow")

    @patch.object(mod, "resolve", return_value=["93.184.216.34"])
    def test_suffix_requires_bound_approval(self, _):
        data={"url":"https://a.mq.example.com/x","credential_class":"oauth","operation":"connect"}
        result, code = mod.evaluate(data, POLICY)
        self.assertEqual(code, 4)
        destination=result["normalized_destination"]
        data["approval"]={"granted":True,"destination":destination,"credential_class":"oauth","operation":"connect"}
        result, code = mod.evaluate(data, POLICY)
        self.assertEqual(code, 0)

    def test_attacker_host_denied_without_dns(self):
        result, code = mod.evaluate({"url":"https://evil.example/x","credential_class":"oauth"}, POLICY)
        self.assertEqual(code, 5)
        self.assertIn("host is not allowlisted", result["findings"])

    @patch.object(mod, "resolve", return_value=["127.0.0.1"])
    def test_loopback_denied(self, _):
        result, code = mod.evaluate({"url":"https://broker.example.com/x","credential_class":"oauth"}, POLICY)
        self.assertEqual(code, 5)
        self.assertTrue(any("non-global" in x for x in result["findings"]))

    def test_userinfo_denied(self):
        result, code = mod.evaluate({"url":"https://user:pass@broker.example.com/x","credential_class":"oauth"}, POLICY)
        self.assertEqual(code, 5)
        self.assertIn("userinfo is forbidden", result["findings"])

    def test_bad_port_denied(self):
        result, code = mod.evaluate({"url":"https://broker.example.com:8443/x","credential_class":"oauth"}, POLICY)
        self.assertEqual(code, 5)
        self.assertIn("port is not allowed", result["findings"])

if __name__ == "__main__":
    unittest.main()

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "mcp_boundary_probe.py"
spec = importlib.util.spec_from_file_location("probe", MODULE_PATH)
probe = importlib.util.module_from_spec(spec)
spec.loader.exec_module(probe)


class BoundaryProbeTests(unittest.TestCase):
    def setUp(self):
        self.policy = probe.validate_policy({
            "allowed_hosts": ["localhost", "127.0.0.1", "[::1]"],
            "allowed_origins": ["http://localhost", "http://127.0.0.1", "http://[::1]"],
            "allow_missing_origin": True,
            "require_authentication": True,
            "allowed_bind_modes": ["loopback", "authenticated-private"],
            "forbid_wildcard_origin": True,
        })

    def test_valid_loopback_allowed(self):
        allowed, reason = probe.evaluate(self.policy, {
            "host": "localhost", "origin": "http://localhost",
            "bind_mode": "loopback", "authenticated": True,
        })
        self.assertTrue(allowed)
        self.assertEqual(reason, "allowed")

    def test_foreign_host_rejected(self):
        allowed, reason = probe.evaluate(self.policy, {
            "host": "attacker.example", "origin": "http://localhost",
            "bind_mode": "loopback", "authenticated": True,
        })
        self.assertFalse(allowed)
        self.assertEqual(reason, "host_not_allowed")

    def test_foreign_origin_rejected(self):
        allowed, reason = probe.evaluate(self.policy, {
            "host": "localhost", "origin": "https://attacker.example",
            "bind_mode": "loopback", "authenticated": True,
        })
        self.assertFalse(allowed)
        self.assertEqual(reason, "origin_not_allowed")

    def test_wildcard_policy_rejected(self):
        with self.assertRaises(ValueError):
            probe.validate_policy({
                "allowed_hosts": ["localhost"],
                "allowed_origins": ["*"],
                "allowed_bind_modes": ["loopback"],
                "forbid_wildcard_origin": True,
            })

    def test_authentication_required(self):
        allowed, reason = probe.evaluate(self.policy, {
            "host": "localhost", "origin": "http://localhost",
            "bind_mode": "loopback", "authenticated": False,
        })
        self.assertFalse(allowed)
        self.assertEqual(reason, "authentication_required")

    def test_origin_port_is_exact(self):
        allowed, reason = probe.evaluate(self.policy, {
            "host": "localhost", "origin": "http://localhost:8080",
            "bind_mode": "loopback", "authenticated": True,
        })
        self.assertFalse(allowed)
        self.assertEqual(reason, "origin_not_allowed")


if __name__ == "__main__":
    unittest.main()

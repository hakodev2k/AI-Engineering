import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "origin_host_gate.py"
spec = importlib.util.spec_from_file_location("origin_host_gate", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(mod)

POLICY = {
    "allowed_hosts": ["127.0.0.1:8000", "localhost:8000"],
    "allowed_origins": ["http://localhost:3000"],
    "allow_missing_origin": True,
    "allowed_bind_addresses": ["127.0.0.1"],
    "trust_forwarded_headers": False,
    "trusted_proxy_ips": [],
}

class GateTests(unittest.TestCase):
    def test_native_client_allowed(self):
        ok, reason = mod.evaluate(POLICY, {"host":"127.0.0.1:8000","bind_address":"127.0.0.1"})
        self.assertTrue(ok); self.assertEqual(reason, "allowed")

    def test_foreign_origin_denied(self):
        ok, reason = mod.evaluate(POLICY, {"host":"127.0.0.1:8000","origin":"https://evil.example","bind_address":"127.0.0.1"})
        self.assertFalse(ok); self.assertEqual(reason, "origin_not_allowed")

    def test_rebound_host_denied(self):
        ok, reason = mod.evaluate(POLICY, {"host":"evil.example","origin":"https://evil.example","bind_address":"127.0.0.1"})
        self.assertFalse(ok); self.assertEqual(reason, "host_not_allowed")

    def test_untrusted_forwarded_host_denied(self):
        ok, reason = mod.evaluate(POLICY, {"host":"localhost:8000","bind_address":"127.0.0.1","forwarded_host":"localhost:8000","remote_ip":"127.0.0.1"})
        self.assertFalse(ok); self.assertEqual(reason, "untrusted_forwarded_host")

    def test_non_loopback_bind_denied(self):
        ok, reason = mod.evaluate(POLICY, {"host":"localhost:8000","bind_address":"0.0.0.0"})
        self.assertFalse(ok); self.assertEqual(reason, "bind_address_not_allowed")

if __name__ == "__main__":
    unittest.main()

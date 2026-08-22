#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "attest_mcp_http.py"
spec = importlib.util.spec_from_file_location("attest_mcp_http", SCRIPT)
assert spec and spec.loader
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class AttestorTests(unittest.TestCase):
    def write_policy(self, value):
        tmp = tempfile.NamedTemporaryFile("w", encoding="utf-8", delete=False)
        json.dump(value, tmp)
        tmp.close()
        return Path(tmp.name)

    def valid_policy(self):
        return {
            "allowed_hosts": ["localhost"],
            "foreign_host_probes": ["attacker.invalid"],
            "foreign_origin_probes": ["https://attacker.invalid"],
            "request_timeout_seconds": 3,
        }

    def test_valid_policy_loads(self):
        path = self.write_policy(self.valid_policy())
        try:
            loaded = mod.load_policy(path)
            self.assertEqual(loaded["allowed_hosts"], ["localhost"])
        finally:
            path.unlink(missing_ok=True)

    def test_empty_foreign_probe_list_is_rejected(self):
        p = self.valid_policy()
        p["foreign_host_probes"] = []
        path = self.write_policy(p)
        try:
            with self.assertRaises(ValueError):
                mod.load_policy(path)
        finally:
            path.unlink(missing_ok=True)

    def test_401_and_403_are_security_rejections(self):
        self.assertTrue(mod.rejected({"status": 401}))
        self.assertTrue(mod.rejected({"status": 403}))
        self.assertFalse(mod.rejected({"status": 200}))
        self.assertFalse(mod.rejected({"status": 400}))

    def test_initialize_request_never_calls_tools(self):
        payload = json.loads(mod.initialize_body().decode("utf-8"))
        self.assertEqual(payload["method"], "initialize")
        self.assertNotEqual(payload["method"], "tools/call")
        self.assertEqual(payload["jsonrpc"], "2.0")

    def test_timeout_bounds_are_enforced(self):
        p = self.valid_policy()
        p["request_timeout_seconds"] = 0
        path = self.write_policy(p)
        try:
            with self.assertRaises(ValueError):
                mod.load_policy(path)
        finally:
            path.unlink(missing_ok=True)


if __name__ == "__main__":
    unittest.main()

#!/usr/bin/env python3
"""Standard-library tests for verify_mcp_auth_boundary.py."""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "verify_mcp_auth_boundary.py"


def run_case(payload: dict) -> tuple[int, dict]:
    with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8", delete=False) as fh:
        json.dump(payload, fh)
        path = fh.name
    proc = subprocess.run([sys.executable, str(SCRIPT), path], capture_output=True, text=True, check=False)
    Path(path).unlink(missing_ok=True)
    return proc.returncode, json.loads(proc.stdout)


class BoundaryTests(unittest.TestCase):
    def test_blocks_unauthenticated_privileged_listener(self) -> None:
        code, result = run_case({
            "bind_address": "0.0.0.0",
            "external_reachable": True,
            "inbound_auth_mode": "none",
            "caller_identities": [],
            "read_only": False,
            "backend_credential": {"present": True, "scope": ["apps:write"]},
            "tools": [{
                "name": "sync_application",
                "class": "write",
                "authorized_callers": [],
                "required_backend_scope": ["apps:write"]
            }]
        })
        self.assertEqual(code, 2)
        self.assertEqual(result["status"], "block")
        codes = {f["code"] for f in result["findings"]}
        self.assertIn("UNAUTHENTICATED_BACKEND_AUTHORITY", codes)
        self.assertIn("PRIVILEGED_TOOL_WITHOUT_CALLER_POLICY", codes)

    def test_passes_scoped_per_caller_policy(self) -> None:
        code, result = run_case({
            "bind_address": "127.0.0.1",
            "external_reachable": False,
            "inbound_auth_mode": "per-caller",
            "caller_identities": ["deploy-bot"],
            "read_only": False,
            "backend_credential": {"present": True, "scope": ["apps:write"]},
            "tools": [{
                "name": "sync_application",
                "class": "write",
                "authorized_callers": ["deploy-bot"],
                "required_backend_scope": ["apps:write"]
            }]
        })
        self.assertEqual(code, 0)
        self.assertEqual(result["status"], "pass")
        self.assertEqual(result["findings"], [])

    def test_blocks_unused_backend_scope(self) -> None:
        code, result = run_case({
            "bind_address": "127.0.0.1",
            "external_reachable": False,
            "inbound_auth_mode": "per-caller",
            "caller_identities": ["reader"],
            "read_only": True,
            "backend_credential": {"present": True, "scope": ["apps:read", "clusters:admin"]},
            "tools": [{
                "name": "list_applications",
                "class": "read",
                "authorized_callers": ["reader"],
                "required_backend_scope": ["apps:read"]
            }]
        })
        self.assertEqual(code, 2)
        codes = {f["code"] for f in result["findings"]}
        self.assertIn("BACKEND_SCOPE_EXCEEDS_DECLARED_TOOL_NEED", codes)


if __name__ == "__main__":
    unittest.main()

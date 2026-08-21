#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "tool_policy_gate.py"
CONFIG = ROOT / "config" / "policy.json"


def run_case(payload: dict):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump(payload, f)
        name = f.name
    try:
        return subprocess.run(
            [sys.executable, str(SCRIPT), name, "--config", str(CONFIG)],
            text=True,
            capture_output=True,
            check=False,
        )
    finally:
        Path(name).unlink(missing_ok=True)


class ToolPolicyGateTests(unittest.TestCase):
    def base(self):
        return {
            "mode": "interactive",
            "allowlist_present": True,
            "allowlist": ["read_file"],
            "denylist": [],
            "known_tools": ["read_file", "write_file", "terminal"],
            "provider_visible_tools": ["read_file"],
            "runtime_executable_tools": ["read_file"],
        }

    def test_compliant_policy_passes(self):
        result = run_case(self.base())
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_explicit_empty_cannot_expand(self):
        p = self.base()
        p.update({"allowlist": [], "provider_visible_tools": ["terminal"], "runtime_executable_tools": ["terminal"]})
        result = run_case(p)
        self.assertEqual(result.returncode, 3)
        self.assertIn("forbidden", result.stdout)

    def test_ignored_allowlist_is_detected(self):
        p = self.base()
        p["provider_visible_tools"] = ["read_file", "write_file"]
        p["runtime_executable_tools"] = ["read_file", "write_file"]
        self.assertEqual(run_case(p).returncode, 3)

    def test_denylist_is_enforced(self):
        p = self.base()
        p.update({"allowlist_present": False, "allowlist": [], "denylist": ["terminal"], "provider_visible_tools": ["read_file", "terminal"], "runtime_executable_tools": ["read_file", "terminal"]})
        self.assertEqual(run_case(p).returncode, 3)

    def test_runtime_provider_mismatch_is_detected(self):
        p = self.base()
        p["runtime_executable_tools"] = ["read_file", "terminal"]
        self.assertEqual(run_case(p).returncode, 3)


if __name__ == "__main__":
    unittest.main()

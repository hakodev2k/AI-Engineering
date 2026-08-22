import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "cache_coherence_guard.py"
POLICY = ROOT / "config" / "policy.json"
BASE = {
    "provider": "anthropic",
    "model": "claude-fable-5",
    "client_version": "2.1.231",
    "entrypoint": "vscode",
    "system_hash": "s1",
    "hook_context_hash": "h1",
    "tool_schema_hash": "t1",
    "cache_policy": "1h"
}


def run(payload):
    with tempfile.TemporaryDirectory() as td:
        p = Path(td) / "input.json"
        p.write_text(json.dumps(payload), encoding="utf-8")
        return subprocess.run([sys.executable, str(SCRIPT), str(p), "--policy", str(POLICY)], capture_output=True, text=True)


class GuardTests(unittest.TestCase):
    def test_matching_runtime_allows(self):
        r = run({"previous": BASE, "current": dict(BASE), "estimated_context_tokens": 800000})
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(json.loads(r.stdout)["decision"], "allow")

    def test_large_critical_mismatch_blocks_without_reason(self):
        current = dict(BASE, client_version="2.1.207", entrypoint="sdk-cli")
        r = run({"previous": BASE, "current": current, "estimated_context_tokens": 760000})
        self.assertEqual(r.returncode, 4)
        self.assertEqual(json.loads(r.stdout)["decision"], "block")

    def test_reason_allows_one_rebaseline_decision(self):
        current = dict(BASE, client_version="2.1.232")
        r = run({"previous": BASE, "current": current, "estimated_context_tokens": 760000, "rebaseline_reason": "intentional client migration"})
        self.assertEqual(r.returncode, 3)
        self.assertEqual(json.loads(r.stdout)["decision"], "rebaseline_required")

    def test_missing_field_is_invalid(self):
        current = dict(BASE)
        del current["tool_schema_hash"]
        r = run({"previous": BASE, "current": current, "estimated_context_tokens": 10})
        self.assertEqual(r.returncode, 2)


if __name__ == "__main__":
    unittest.main()

import json
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GUARD = ROOT / "scripts" / "credential_lease_guard.py"


def run_guard(*args):
    return subprocess.run([sys.executable, str(GUARD), *map(str, args)], text=True, capture_output=True)


def write_json(path: Path, value):
    path.write_text(json.dumps(value), encoding="utf-8")


class CredentialLeaseGuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.state = self.root / "state.json"
        write_json(self.state, {
            "generation": 7,
            "expires_at": time.time() + 3600,
            "scopes": ["read", "write"],
            "updated_at": time.time(),
        })

    def tearDown(self):
        self.tmp.cleanup()

    def test_only_one_owner_acquires_live_lease(self):
        first = run_guard("acquire", "--root", self.root / "guard", "--credential", "cred-1", "--owner", "worker-a", "--ttl", "30")
        second = run_guard("acquire", "--root", self.root / "guard", "--credential", "cred-1", "--owner", "worker-b", "--ttl", "30")
        self.assertEqual(first.returncode, 0, first.stderr)
        self.assertEqual(second.returncode, 4, second.stderr)
        self.assertIn('"status": "busy"', second.stdout)

    def test_wrong_owner_cannot_release(self):
        acquired = run_guard("acquire", "--root", self.root / "guard", "--credential", "cred-1", "--owner", "worker-a")
        self.assertEqual(acquired.returncode, 0)
        release = run_guard("release", "--root", self.root / "guard", "--credential", "cred-1", "--owner", "worker-b")
        self.assertEqual(release.returncode, 5)

    def test_generation_conflict_fails(self):
        result = run_guard("check-generation", "--state", self.state, "--expected", "6")
        self.assertEqual(result.returncode, 6)
        self.assertIn("generation_conflict", result.stdout)

    def test_commit_requires_next_generation(self):
        new_state = self.root / "new.json"
        write_json(new_state, {
            "generation": 9,
            "expires_at": time.time() + 7200,
            "scopes": ["read"],
            "updated_at": time.time(),
        })
        result = run_guard("commit-metadata", "--state", self.state, "--new-metadata", new_state, "--expected", "7")
        self.assertEqual(result.returncode, 2)

    def test_commit_rejects_scope_expansion(self):
        new_state = self.root / "new.json"
        write_json(new_state, {
            "generation": 8,
            "expires_at": time.time() + 7200,
            "scopes": ["read", "write", "admin"],
            "updated_at": time.time(),
        })
        result = run_guard("commit-metadata", "--state", self.state, "--new-metadata", new_state, "--expected", "7")
        self.assertEqual(result.returncode, 2)
        self.assertIn("scope expansion", result.stderr)

    def test_commit_updates_generation_atomically(self):
        new_state = self.root / "new.json"
        write_json(new_state, {
            "generation": 8,
            "expires_at": time.time() + 7200,
            "scopes": ["read", "write"],
            "updated_at": time.time(),
        })
        result = run_guard("commit-metadata", "--state", self.state, "--new-metadata", new_state, "--expected", "7")
        self.assertEqual(result.returncode, 0, result.stderr)
        current = json.loads(self.state.read_text(encoding="utf-8"))
        self.assertEqual(current["generation"], 8)

    def test_secret_fields_are_rejected(self):
        bad = json.loads(self.state.read_text(encoding="utf-8"))
        bad["access_token"] = "do-not-log"
        write_json(self.state, bad)
        result = run_guard("inspect", "--state", self.state)
        self.assertEqual(result.returncode, 2)
        self.assertIn("forbidden secret-like fields", result.stderr)
        self.assertNotIn("do-not-log", result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()

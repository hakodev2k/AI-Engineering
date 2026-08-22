import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "protected_path_guard.py"

class GuardTests(unittest.TestCase):
    def run_guard(self, workspace: Path, target: str):
        policy = workspace / "policy.json"
        policy.write_text(json.dumps({"protected_paths": [".git", ".codex", ".agents"]}), encoding="utf-8")
        return subprocess.run([sys.executable, str(SCRIPT), "--policy", str(policy), "--workspace", str(workspace), "--target", target, "--operation", "write"], capture_output=True, text=True)

    def test_absent_protected_path_is_denied(self):
        with tempfile.TemporaryDirectory() as td:
            ws = Path(td)
            self.assertFalse((ws / ".git").exists())
            r = self.run_guard(ws, ".git/hooks/pre-commit")
            self.assertEqual(r.returncode, 4, r.stdout + r.stderr)
            self.assertFalse((ws / ".git").exists(), "guard must not materialize protected path")

    def test_present_protected_path_is_denied(self):
        with tempfile.TemporaryDirectory() as td:
            ws = Path(td); (ws / ".codex").mkdir()
            r = self.run_guard(ws, ".codex/config.toml")
            self.assertEqual(r.returncode, 4)

    def test_allowed_path_passes(self):
        with tempfile.TemporaryDirectory() as td:
            ws = Path(td)
            r = self.run_guard(ws, "src/app.py")
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)

    def test_escape_is_invalid_and_blocking(self):
        with tempfile.TemporaryDirectory() as td:
            ws = Path(td)
            r = self.run_guard(ws, "../outside.txt")
            self.assertEqual(r.returncode, 2)

if __name__ == "__main__":
    unittest.main()

import json
import subprocess
import sys
import tempfile
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "attest_read_boundary.py"


class BoundaryTests(unittest.TestCase):
    def run_case(self, observations):
        policy = {
            "required_allowed_probes": [r"C:\CodexProjects\ok.txt"],
            "required_denied_probes": [r"C:\SensitiveData\secret.txt"],
            "require_canonical_paths": True,
        }
        with tempfile.TemporaryDirectory() as td:
            p = Path(td)
            (p / "policy.json").write_text(json.dumps(policy), encoding="utf-8")
            (p / "obs.json").write_text(json.dumps(observations), encoding="utf-8")
            return subprocess.run(
                [sys.executable, str(SCRIPT), "--policy", str(p / "policy.json"), "--observations", str(p / "obs.json")],
                text=True,
                capture_output=True,
                check=False,
            )

    def test_verified(self):
        result = self.run_case({
            "sandbox_healthy": True,
            "probes": [
                {"path": r"C:\CodexProjects\ok.txt", "canonical_path": r"C:\CodexProjects\ok.txt", "result": "allowed"},
                {"path": r"C:\SensitiveData\secret.txt", "canonical_path": r"C:\SensitiveData\secret.txt", "result": "denied"},
            ],
        })
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)["status"], "verified")

    def test_forbidden_read_blocks(self):
        result = self.run_case({
            "sandbox_healthy": True,
            "probes": [
                {"path": r"C:\CodexProjects\ok.txt", "canonical_path": r"C:\CodexProjects\ok.txt", "result": "allowed"},
                {"path": r"C:\SensitiveData\secret.txt", "canonical_path": r"C:\SensitiveData\secret.txt", "result": "allowed"},
            ],
        })
        self.assertEqual(result.returncode, 2)

    def test_ambiguous_error_is_not_success(self):
        result = self.run_case({
            "sandbox_healthy": True,
            "probes": [
                {"path": r"C:\CodexProjects\ok.txt", "canonical_path": r"C:\CodexProjects\ok.txt", "result": "allowed"},
                {"path": r"C:\SensitiveData\secret.txt", "canonical_path": r"C:\SensitiveData\secret.txt", "result": "error"},
            ],
        })
        self.assertEqual(result.returncode, 3)


if __name__ == "__main__":
    unittest.main()

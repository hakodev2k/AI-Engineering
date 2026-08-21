#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "permission_consistency_verifier.py"
MATRIX = ROOT / "config" / "policy-matrix.example.json"
PASSING = ROOT / "tests" / "observations.example.jsonl"


class PermissionConsistencyVerifierTests(unittest.TestCase):
    def run_verifier(self, observations: Path, require_all: bool = True) -> subprocess.CompletedProcess[str]:
        cmd = [sys.executable, str(SCRIPT), "--matrix", str(MATRIX), "--observations", str(observations)]
        if require_all:
            cmd.append("--require-all")
        return subprocess.run(cmd, text=True, capture_output=True, check=False)

    def test_example_observations_pass(self) -> None:
        result = self.run_verifier(PASSING)
        self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
        report = json.loads(result.stdout)
        self.assertEqual(report["status"], "PASS")
        self.assertEqual(report["mismatch_count"], 0)

    def test_unexpected_allow_is_security_failure(self) -> None:
        lines = PASSING.read_text(encoding="utf-8").splitlines()
        rows = [json.loads(line) for line in lines if line.strip()]
        for row in rows:
            if row["scenario_id"] == "deny-destructive-home-delete":
                row["observed_decision"] = "allow"
                row["observed_reason_class"] = "policy-allow"
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "bad.jsonl"
            path.write_text("\n".join(json.dumps(r) for r in rows) + "\n", encoding="utf-8")
            result = self.run_verifier(path)
        self.assertEqual(result.returncode, 2)
        report = json.loads(result.stdout)
        self.assertEqual(report["status"], "FAIL")
        self.assertGreaterEqual(report["security_mismatch_count"], 1)

    def test_missing_critical_scenario_fails(self) -> None:
        rows = [
            json.loads(line)
            for line in PASSING.read_text(encoding="utf-8").splitlines()
            if line.strip()
        ]
        rows = [r for r in rows if r["scenario_id"] != "deny-subagent-secret-read"]
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "missing.jsonl"
            path.write_text("\n".join(json.dumps(r) for r in rows) + "\n", encoding="utf-8")
            result = self.run_verifier(path, require_all=False)
        self.assertEqual(result.returncode, 2)
        report = json.loads(result.stdout)
        self.assertIn("deny-subagent-secret-read", report["missing_required_scenarios"])


if __name__ == "__main__":
    unittest.main()

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "security_scan.py"


class SecurityScanTests(unittest.TestCase):
    def run_scan(self, target: Path, *arguments: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(SCRIPT), str(target), *arguments],
            check=False,
            capture_output=True,
            text=True,
        )

    def test_safe_example_passes(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory)
            (target / "settings.env").write_text("API_KEY=${API_KEY}\nVERIFY_TLS=true\n", encoding="utf-8")
            result = self.run_scan(target, "--format", "json")
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(result.stdout)["findings"], [])

    def test_hardcoded_secret_fails_and_value_is_redacted(self) -> None:
        test_value = "sensitive-test-value-12345"
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory)
            (target / "settings.env").write_text(f"API_KEY={test_value}\n", encoding="utf-8")
            result = self.run_scan(target, "--format", "json", "--fail-on", "high")
            self.assertEqual(result.returncode, 1, result.stderr)
            self.assertNotIn(test_value, result.stdout)
            payload = json.loads(result.stdout)
            self.assertEqual(payload["findings"][0]["rule"], "hardcoded-secret-assignment")
            self.assertEqual(payload["findings"][0]["evidence"], "[REDACTED]")

    def test_excluded_directory_is_not_scanned(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory)
            ignored = target / "generated"
            ignored.mkdir()
            (ignored / "settings.env").write_text("PASSWORD=not-for-output-12345\n", encoding="utf-8")
            result = self.run_scan(target, "--exclude", "generated", "--format", "json")
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(result.stdout)["scanned_files"], 0)


if __name__ == "__main__":
    unittest.main()

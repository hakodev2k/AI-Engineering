import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "residual_guard.py"


class ResidualGuardTests(unittest.TestCase):
    def run_capture(self, data: bytes, max_bytes: int):
        td = tempfile.TemporaryDirectory()
        self.addCleanup(td.cleanup)
        root = Path(td.name)
        source = root / "source.bin"
        result = root / "result.json"
        artifacts = root / "artifacts"
        source.write_bytes(data)
        proc = subprocess.run(
            [
                sys.executable,
                str(SCRIPT),
                "capture",
                "--input",
                str(source),
                "--artifact-dir",
                str(artifacts),
                "--max-model-bytes",
                str(max_bytes),
                "--result-file",
                str(result),
            ],
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(proc.returncode, 0, proc.stderr)
        return root, result, json.loads(result.read_text(encoding="utf-8"))

    def test_small_output_is_complete(self):
        data = b"ok\n" * 100
        _, result, doc = self.run_capture(data, 1024)
        r = doc["residual"]
        self.assertFalse(r["truncated"])
        self.assertEqual(r["produced_bytes"], len(data))
        self.assertEqual(r["retained_bytes"], len(data))
        self.assertEqual(r["omitted_bytes"], 0)
        verify = subprocess.run(
            [sys.executable, str(SCRIPT), "verify", "--result", str(result)],
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(verify.returncode, 0, verify.stderr)

    def test_oversized_output_has_exact_residual(self):
        data = (b"HEAD\n" * 400) + (b"MIDDLE\n" * 3000) + (b"TAIL\n" * 400)
        _, result, doc = self.run_capture(data, 2048)
        r = doc["residual"]
        self.assertTrue(r["truncated"])
        self.assertEqual(r["produced_bytes"], len(data))
        self.assertEqual(r["produced_bytes"], r["retained_bytes"] + r["omitted_bytes"])
        self.assertGreater(r["omitted_bytes"], 0)
        self.assertLessEqual(r["retained_bytes"], 2048)
        self.assertIn("OUTPUT RESIDUAL: TRUNCATED", doc["model_view"])
        verify = subprocess.run(
            [sys.executable, str(SCRIPT), "verify", "--result", str(result)],
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(verify.returncode, 0, verify.stderr)

    def test_different_true_sizes_report_different_produced_counts(self):
        _, _, a = self.run_capture(b"x" * 5000, 1024)
        _, _, b = self.run_capture(b"x" * 9000, 1024)
        self.assertNotEqual(a["residual"]["produced_bytes"], b["residual"]["produced_bytes"])
        self.assertNotEqual(a["residual"]["omitted_bytes"], b["residual"]["omitted_bytes"])

    def test_corrupted_artifact_fails_closed(self):
        _, result, doc = self.run_capture(b"important evidence\n" * 500, 1024)
        artifact = Path(doc["residual"]["artifact_path"])
        artifact.chmod(0o644)
        artifact.write_bytes(b"corrupted")
        verify = subprocess.run(
            [sys.executable, str(SCRIPT), "verify", "--result", str(result)],
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(verify.returncode, 2)


if __name__ == "__main__":
    unittest.main()

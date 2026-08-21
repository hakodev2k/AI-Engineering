import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "residualize_output.py"


class ResidualTests(unittest.TestCase):
    def run_script(self, *args):
        return subprocess.run([sys.executable, str(SCRIPT), *args], capture_output=True)

    def test_capture_verify_and_range(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td); source = root / "out.txt"; residual = root / "residual.json"
            payload = ("alpha\n" + "x" * 10000 + "\nomega\n").encode()
            source.write_bytes(payload)
            p = self.run_script("capture", "--input", str(source), "--artifact-dir", str(root / "artifacts"),
                                "--residual", str(residual), "--tool", "test", "--invocation-id", "1",
                                "--inline-budget", "256", "--completed", "--exit-code", "0")
            self.assertEqual(p.returncode, 0, p.stderr.decode())
            meta = json.loads(residual.read_text())
            self.assertTrue(meta["truncated"]); self.assertTrue(meta["completed"])
            self.assertEqual(self.run_script("verify", "--residual", str(residual)).returncode, 0)
            q = self.run_script("read-range", "--residual", str(residual), "--start", "0", "--end", "5")
            self.assertEqual(q.returncode, 0); self.assertEqual(q.stdout, b"alpha")

    def test_tamper_detected(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td); source = root / "out"; residual = root / "r.json"
            source.write_bytes(b"original")
            self.assertEqual(self.run_script("capture", "--input", str(source), "--artifact-dir", str(root / "a"),
                                             "--residual", str(residual), "--tool", "t", "--invocation-id", "2").returncode, 0)
            meta = json.loads(residual.read_text()); Path(meta["artifact"]).write_bytes(b"tampered")
            self.assertEqual(self.run_script("verify", "--residual", str(residual)).returncode, 2)


if __name__ == "__main__": unittest.main()

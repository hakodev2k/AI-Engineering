import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "sanitize_mcp_error.py"

class SanitizerTests(unittest.TestCase):
    def run_case(self, raw, secrets=None):
        with tempfile.TemporaryDirectory() as d:
            d = Path(d); inp = d / "in.json"; out = d / "out.json"; sec = d / "sec.json"
            inp.write_text(json.dumps(raw), encoding="utf-8")
            cmd = [sys.executable, str(SCRIPT), "--input", str(inp), "--output", str(out)]
            if secrets is not None:
                sec.write_text(json.dumps(secrets), encoding="utf-8"); cmd += ["--secrets-file", str(sec)]
            p = subprocess.run(cmd, capture_output=True, text=True)
            envelope = json.loads(out.read_text(encoding="utf-8")) if out.exists() else None
            return p.returncode, envelope

    def test_safe_envelope(self):
        code, env = self.run_case({"public_code":"timeout","safe_message":"Dependency timed out","retryable":True,"correlation_id":"c1"})
        self.assertEqual(code, 0); self.assertEqual(env["code"], "timeout"); self.assertTrue(env["retryable"])

    def test_registered_secret_blocks_raw_input(self):
        code, env = self.run_case({"raw_exception":"failed token=supersecret","safe_message":"Request failed"}, {"api":"supersecret"})
        self.assertEqual(code, 3); self.assertNotIn("supersecret", json.dumps(env))

    def test_traceback_blocks_raw_input(self):
        code, env = self.run_case({"raw_exception":"Traceback (most recent call last):\n  File \"/srv/app.py\", line 2\nBoom","safe_message":"Internal failure"})
        self.assertEqual(code, 3); self.assertNotIn("/srv/app.py", json.dumps(env))

if __name__ == "__main__": unittest.main()

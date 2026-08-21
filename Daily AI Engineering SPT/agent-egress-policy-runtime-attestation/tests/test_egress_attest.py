import json
import subprocess
import sys
import tempfile
import threading
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "egress_attest.py"


class Handler(BaseHTTPRequestHandler):
    def do_HEAD(self):
        self.send_response(204)
        self.end_headers()

    def log_message(self, fmt, *args):
        pass


class AttestorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = HTTPServer(("127.0.0.1", 0), Handler)
        cls.port = cls.server.server_address[1]
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.thread.join(timeout=2)

    def run_policy(self, policy):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "policy.json"
            p.write_text(json.dumps(policy), encoding="utf-8")
            return subprocess.run(
                [sys.executable, str(SCRIPT), str(p)],
                text=True,
                capture_output=True,
                timeout=10,
            )

    def base(self):
        return {"version": 1, "timeout_seconds": 1, "max_probes": 5}

    def test_allow_reachable_passes(self):
        p = self.base()
        p["allow"] = [{"name": "local", "url": f"http://127.0.0.1:{self.port}/"}]
        p["deny"] = []
        r = self.run_policy(p)
        self.assertEqual(0, r.returncode, r.stderr)
        self.assertEqual("pass", json.loads(r.stdout)["status"])

    def test_deny_reachable_fails_over_permissive(self):
        p = self.base()
        p["allow"] = []
        p["deny"] = [{"name": "should-block", "url": f"http://127.0.0.1:{self.port}/"}]
        r = self.run_policy(p)
        self.assertEqual(2, r.returncode)
        report = json.loads(r.stdout)
        self.assertEqual(["should-block"], report["over_permissive"])

    def test_unreachable_allow_fails_over_restrictive(self):
        p = self.base()
        p["allow"] = [{"name": "required", "url": "http://127.0.0.1:1/"}]
        p["deny"] = []
        r = self.run_policy(p)
        self.assertEqual(2, r.returncode)
        self.assertEqual(["required"], json.loads(r.stdout)["over_restrictive"])

    def test_credentials_in_url_rejected(self):
        p = self.base()
        p["allow"] = [{"name": "bad", "url": "https://user:secret@example.com/"}]
        p["deny"] = []
        r = self.run_policy(p)
        self.assertEqual(3, r.returncode)

    def test_probe_budget_enforced(self):
        p = self.base()
        p["max_probes"] = 1
        p["allow"] = [
            {"name": "a", "url": "https://example.com/"},
            {"name": "b", "url": "https://example.org/"},
        ]
        p["deny"] = []
        r = self.run_policy(p)
        self.assertEqual(3, r.returncode)


if __name__ == "__main__":
    unittest.main()

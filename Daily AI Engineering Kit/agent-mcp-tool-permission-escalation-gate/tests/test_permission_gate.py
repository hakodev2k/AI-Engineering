import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT=Path(__file__).resolve().parents[1]/"scripts"/"permission_gate.py"

def run_gate(payload, *args):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump(payload, f); path=f.name
    return subprocess.run([sys.executable, str(SCRIPT), path, *args], capture_output=True, text=True)

class GateTests(unittest.TestCase):
    def test_read_is_allowed_without_approval(self):
        p={"request_id":"1","tool":"repo.read","action":"read","risk":"low","resources":["src/a.cs"],"reason":"inspect"}
        r=run_gate(p)
        self.assertEqual(r.returncode,0,r.stderr+r.stdout)
        self.assertEqual(json.loads(r.stdout)["status"],"allowed")

    def test_external_write_requires_approval(self):
        p={"request_id":"2","tool":"github.write","action":"write_external","risk":"high","resources":["o/r:file"],"reason":"fix","requested_minutes":10}
        r=run_gate(p)
        self.assertEqual(r.returncode,3)
        self.assertIn("approval", json.loads(r.stdout)["reason"])

    def test_external_write_allowed_with_approval(self):
        p={"request_id":"3","tool":"github.write","action":"write_external","risk":"high","resources":["o/r:file"],"reason":"fix","requested_minutes":10}
        r=run_gate(p,"--approved","--approval-id","APR-123")
        self.assertEqual(r.returncode,0,r.stderr+r.stdout)
        self.assertEqual(json.loads(r.stdout)["approval_id"],"APR-123")

    def test_wildcard_scope_denied(self):
        p={"request_id":"4","tool":"repo.read","action":"read","risk":"low","resources":["*"],"reason":"inspect"}
        r=run_gate(p)
        self.assertEqual(r.returncode,3)

if __name__=="__main__": unittest.main()

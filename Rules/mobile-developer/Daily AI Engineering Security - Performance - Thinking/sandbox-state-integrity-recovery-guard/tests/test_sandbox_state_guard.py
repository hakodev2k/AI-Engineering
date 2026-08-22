import hashlib, json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "sandbox_state_guard.py"

class GuardTests(unittest.TestCase):
    def run_guard(self, *args):
        return subprocess.run([sys.executable, str(SCRIPT), *args], text=True, capture_output=True)

    def test_valid_json(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "state.json"
            p.write_text(json.dumps({"schema_version":5,"runtime_owner":"desktop"}), encoding="utf-8")
            r = self.run_guard("inspect","--path",str(p),"--classification","rebuildable-cache","--schema-version","5","--runtime-owner","desktop")
            self.assertEqual(r.returncode, 0, r.stderr)
            self.assertEqual(json.loads(r.stdout)["status"], "valid")

    def test_corrupt_json_is_blocked(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "state.json"
            p.write_bytes(b"\x00" * 22)
            r = self.run_guard("inspect","--path",str(p),"--classification","rebuildable-cache")
            self.assertEqual(r.returncode, 2)
            self.assertEqual(json.loads(r.stdout)["reason"], "unparseable")

    def test_schema_mismatch_is_blocked(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "state.json"
            p.write_text('{"schema_version":4}', encoding="utf-8")
            r = self.run_guard("inspect","--path",str(p),"--classification","rebuildable-cache","--schema-version","5")
            self.assertEqual(r.returncode, 2)
            self.assertEqual(json.loads(r.stdout)["status"], "incompatible")

    def test_authoritative_state_cannot_be_quarantined(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "state.json"
            p.write_text('{}', encoding="utf-8")
            r = self.run_guard("quarantine","--path",str(p),"--classification","authoritative")
            self.assertEqual(r.returncode, 3)
            self.assertTrue(p.exists())

    def test_quarantine_preserves_hash_in_name(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "state.json"
            data = b'{"x":1}'
            p.write_bytes(data)
            expected = hashlib.sha256(data).hexdigest()[:12]
            r = self.run_guard("quarantine","--path",str(p),"--classification","rebuildable-cache")
            self.assertEqual(r.returncode, 0, r.stderr)
            out = json.loads(r.stdout)
            self.assertIn(expected, out["quarantine"])
            self.assertFalse(p.exists())
            self.assertTrue(Path(out["quarantine"]).exists())

if __name__ == "__main__":
    unittest.main()

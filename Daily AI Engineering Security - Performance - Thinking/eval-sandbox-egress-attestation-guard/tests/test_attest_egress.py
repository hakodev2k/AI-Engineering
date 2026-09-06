import importlib.util, json, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "attest_egress.py"
spec = importlib.util.spec_from_file_location("attest_egress", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class AttestTests(unittest.TestCase):
    def setUp(self):
        self.policy = {
            "policy_version": "1",
            "require_events": True,
            "approved_destinations": ["localhost", "*.sandbox.internal", "10.0.0.0/8"],
            "forbidden_destinations": ["0.0.0.0/0", "::/0", "blocked.example"]
        }

    def test_approved_internal(self):
        self.assertEqual(mod.classify("cache.sandbox.internal", self.policy), "approved")
        self.assertEqual(mod.classify("10.2.3.4", self.policy), "approved")

    def test_public_ip_is_forbidden_by_default_cidr(self):
        self.assertEqual(mod.classify("8.8.8.8", self.policy), "forbidden")

    def test_named_forbidden_wins(self):
        p = dict(self.policy)
        p["approved_destinations"] = ["*.example"]
        self.assertEqual(mod.classify("blocked.example", p), "forbidden")

    def test_unknown_hostname_blocks(self):
        self.assertEqual(mod.classify("example.com", self.policy), "unknown")

    def test_event_validation(self):
        with tempfile.TemporaryDirectory() as d:
            path = Path(d) / "events.jsonl"
            path.write_text(json.dumps({"source": "proxy"}) + "\n", encoding="utf-8")
            with self.assertRaises(ValueError):
                mod.load_events(path)

if __name__ == "__main__":
    unittest.main()

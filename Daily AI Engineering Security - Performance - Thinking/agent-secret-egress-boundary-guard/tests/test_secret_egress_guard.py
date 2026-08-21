import importlib.util
import pathlib
import tempfile
import unittest

MODULE_PATH = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "secret_egress_guard.py"
spec = importlib.util.spec_from_file_location("secret_egress_guard", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(mod)


class SecretEgressGuardTests(unittest.TestCase):
    def setUp(self):
        self.secrets = {
            "API_KEY": "canary-secret-123456",
            "DATABASE_URL": "postgres://user:canary-password@db/test",
        }

    def test_findings_detect_exact_values(self):
        text = "key=canary-secret-123456"
        hits = mod.findings(text, self.secrets)
        self.assertEqual(1, len(hits))
        self.assertEqual("API_KEY", hits[0]["label"])
        self.assertNotIn(self.secrets["API_KEY"], str(hits))

    def test_redact_removes_all_registered_values(self):
        text = f"{self.secrets['API_KEY']} {self.secrets['DATABASE_URL']}"
        sanitized = mod.redact(text, self.secrets)
        self.assertEqual([], mod.findings(sanitized, self.secrets))
        self.assertIn("[REDACTED:API_KEY]", sanitized)

    def test_clean_text_passes(self):
        self.assertEqual([], mod.findings("ordinary diagnostic output", self.secrets))

    def test_load_rejects_short_values(self):
        with tempfile.TemporaryDirectory() as d:
            p = pathlib.Path(d) / "s.json"
            p.write_text('{"BAD":"123"}', encoding="utf-8")
            with self.assertRaises(ValueError):
                mod.load_secrets(str(p))


if __name__ == "__main__":
    unittest.main()

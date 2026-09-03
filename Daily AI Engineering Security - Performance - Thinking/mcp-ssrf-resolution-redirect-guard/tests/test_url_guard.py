import importlib.util
import json
import pathlib
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("url_guard", ROOT / "scripts" / "url_guard.py")
url_guard = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(url_guard)

POLICY = {
    "allowed_schemes": ["http", "https"],
    "reject_address_classes": ["loopback", "private", "link_local", "multicast", "reserved", "unspecified"],
}


class UrlGuardTests(unittest.TestCase):
    def test_allows_public_ipv4(self):
        result = url_guard.evaluate("https://example.com/a", ["93.184.216.34"], POLICY)
        self.assertTrue(result["allowed"])

    def test_rejects_loopback(self):
        result = url_guard.evaluate("http://example.test", ["127.0.0.1"], POLICY)
        self.assertFalse(result["allowed"])
        self.assertIn("loopback", result["blocked_classes"])

    def test_rejects_private(self):
        result = url_guard.evaluate("http://example.test", ["10.2.3.4"], POLICY)
        self.assertFalse(result["allowed"])

    def test_rejects_link_local_metadata_range(self):
        result = url_guard.evaluate("http://metadata.test", ["169.254.169.254"], POLICY)
        self.assertFalse(result["allowed"])
        self.assertIn("link_local", result["blocked_classes"])

    def test_rejects_ipv4_mapped_ipv6_loopback(self):
        result = url_guard.evaluate("http://example.test", ["::ffff:7f00:1"], POLICY)
        self.assertFalse(result["allowed"])
        self.assertEqual(result["evaluated"][0]["normalized"], "127.0.0.1")

    def test_rejects_mixed_public_and_private_resolution(self):
        result = url_guard.evaluate("https://example.test", ["93.184.216.34", "192.168.1.5"], POLICY)
        self.assertFalse(result["allowed"])

    def test_rejects_unsupported_scheme(self):
        result = url_guard.evaluate("file:///etc/passwd", ["93.184.216.34"], POLICY)
        self.assertFalse(result["allowed"])

    def test_requires_resolution_evidence(self):
        result = url_guard.evaluate("https://example.com", [], POLICY)
        self.assertFalse(result["allowed"])
        self.assertEqual(result["reason"], "no_resolution_evidence")

    def test_policy_loader(self):
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as handle:
            json.dump(POLICY, handle)
            path = handle.name
        loaded = url_guard.load_policy(path)
        self.assertEqual(loaded["allowed_schemes"], ["http", "https"])


if __name__ == "__main__":
    unittest.main()

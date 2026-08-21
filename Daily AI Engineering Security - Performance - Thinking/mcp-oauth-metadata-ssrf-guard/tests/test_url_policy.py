import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("url_policy", ROOT / "scripts" / "url_policy.py")
url_policy = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(url_policy)


class UrlPolicyTests(unittest.TestCase):
    def setUp(self):
        self.policy = json.loads((ROOT / "config" / "policy.json").read_text(encoding="utf-8"))
        self.tmp = tempfile.TemporaryDirectory()
        self.dns_path = Path(self.tmp.name) / "dns.json"
        self.dns_path.write_text(json.dumps({
            "public.example": ["93.184.216.34"],
            "private.example": ["10.1.2.3"],
            "loopback.example": ["127.0.0.1"],
            "linklocal.example": ["169.254.169.254"],
            "mixed.example": ["93.184.216.34", "10.0.0.9"],
            "ipv6-private.example": ["fd00::1"]
        }), encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def decide(self, url, kind="fetch"):
        return url_policy.decide(url, self.policy, kind, str(self.dns_path))

    def test_public_https_allowed(self):
        self.assertEqual(self.decide("https://public.example/.well-known/oauth-protected-resource")["decision"], "ALLOW")

    def test_private_blocked(self):
        r = self.decide("https://private.example/meta")
        self.assertEqual(r["decision"], "DENY_POLICY")
        self.assertEqual(r["reason"], "non_global_destination")

    def test_loopback_blocked(self):
        self.assertNotEqual(self.decide("https://loopback.example/meta")["decision"], "ALLOW")

    def test_link_local_cloud_metadata_blocked(self):
        self.assertNotEqual(self.decide("https://linklocal.example/latest/meta-data/")["decision"], "ALLOW")

    def test_mixed_dns_answers_fail_closed(self):
        self.assertNotEqual(self.decide("https://mixed.example/meta")["decision"], "ALLOW")

    def test_ipv6_private_blocked(self):
        self.assertNotEqual(self.decide("https://ipv6-private.example/meta")["decision"], "ALLOW")

    def test_ip_literal_private_blocked(self):
        r = url_policy.decide("https://127.0.0.1/meta", self.policy, "fetch", None)
        self.assertNotEqual(r["decision"], "ALLOW")

    def test_http_blocked_in_production(self):
        self.assertNotEqual(self.decide("http://public.example/meta")["decision"], "ALLOW")

    def test_embedded_credentials_blocked(self):
        self.assertNotEqual(self.decide("https://user:pass@public.example/meta")["decision"], "ALLOW")

    def test_browser_file_scheme_blocked(self):
        r = url_policy.decide("file:///tmp/x", self.policy, "browser", str(self.dns_path))
        self.assertNotEqual(r["decision"], "ALLOW")

    def test_browser_https_public_allowed(self):
        self.assertEqual(self.decide("https://public.example/oauth/authorize", "browser")["decision"], "ALLOW")

    def test_dns_failure_fails_closed(self):
        self.assertEqual(self.decide("https://missing.example/meta")["decision"], "DENY_DNS")


if __name__ == "__main__":
    unittest.main()

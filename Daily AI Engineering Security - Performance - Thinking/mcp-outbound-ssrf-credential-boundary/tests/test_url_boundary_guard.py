import unittest
from scripts.url_boundary_guard import evaluate

P={"allowed_schemes":["https"],"allowed_domains":["api.example.com"],"allowed_ports":[443],"deny_private":True,"deny_loopback":True,"deny_link_local":True,"deny_multicast":True,"require_resolved_ip":True}
class Tests(unittest.TestCase):
    def test_allowed(self):
        self.assertTrue(evaluate("https://api.example.com/x",P,"8.8.8.8")["ok"])
    def test_metadata_ip_blocked(self):
        r=evaluate("https://api.example.com/x",P,"169.254.169.254"); self.assertFalse(r["ok"]); self.assertIn("link_local_ip_blocked",r["reasons"])
    def test_private_blocked(self):
        self.assertFalse(evaluate("https://api.example.com/x",P,"10.0.0.1")["ok"])
    def test_domain_blocked(self):
        self.assertFalse(evaluate("https://evil.example/x",P,"8.8.8.8")["ok"])
    def test_http_blocked(self):
        self.assertFalse(evaluate("http://api.example.com/x",P,"8.8.8.8")["ok"])
    def test_resolution_required(self):
        self.assertIn("resolved_ip_required",evaluate("https://api.example.com/x",P)["reasons"])
if __name__=="__main__": unittest.main()

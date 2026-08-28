import unittest
from scripts.ingress_guard import evaluate

POLICY={
 "bind_host":"127.0.0.1",
 "allowed_hosts":["127.0.0.1","localhost"],
 "allowed_origins":["http://localhost","http://127.0.0.1"],
 "require_request_auth":True,
 "consequential_tools":["shell","pipeline_run"],
 "deny_wildcard_origin":True,
 "deny_public_bind":True,
}

class GuardTests(unittest.TestCase):
    def test_local_authenticated_allowed(self):
        r=evaluate({"host":"localhost:3000","origin":"http://localhost","authenticated":True,"requested_tools":["shell"]}, POLICY)
        self.assertTrue(r["ok"])
    def test_attacker_host_blocked(self):
        r=evaluate({"host":"evil.example","origin":"https://evil.example","authenticated":True}, POLICY)
        self.assertFalse(r["ok"]); self.assertIn("host_not_allowed",r["reasons"])
    def test_attacker_origin_blocked(self):
        r=evaluate({"host":"localhost","origin":"https://evil.example","authenticated":True}, POLICY)
        self.assertFalse(r["ok"]); self.assertIn("origin_not_allowed",r["reasons"])
    def test_public_bind_blocked(self):
        r=evaluate({"bind_host":"0.0.0.0","host":"localhost","origin":"http://localhost","authenticated":True}, POLICY)
        self.assertFalse(r["ok"]); self.assertIn("public_bind_forbidden",r["reasons"])
    def test_consequential_requires_auth(self):
        r=evaluate({"host":"localhost","origin":"http://localhost","requested_tools":["pipeline_run"]}, POLICY)
        self.assertFalse(r["ok"]); self.assertIn("consequential_tool_requires_auth",r["reasons"])
    def test_non_browser_origin_absent_can_pass_for_nonconsequential(self):
        r=evaluate({"host":"127.0.0.1","requested_tools":["read_status"]}, POLICY)
        self.assertTrue(r["ok"])

if __name__=="__main__": unittest.main()

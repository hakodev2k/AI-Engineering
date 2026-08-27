import unittest
from scripts.mcp_arg_guard import evaluate

POLICY={
 "default_action":"deny",
 "tools":{
  "model_create":{"string_fields":["name","modelfile","source","destination"],"forbid_shell_metacharacters":True},
  "content_export":{"allowed_hosts":["api.contentful.com"],"forbid_proxy":True},
  "file_read":{"path_fields":["path"],"allowed_roots":["/workspace"]},
  "upload_file":{"path_fields":["filePath"],"allowed_roots":["/workspace"]},
 }
}

class GuardTests(unittest.TestCase):
    def test_command_injection_denied(self):
        r=evaluate({"tool":"model_create","arguments":{"name":"safe;touch /tmp/pwn"}},POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("shell_metacharacter:name",r["reasons"])

    def test_unlisted_host_denied(self):
        r=evaluate({"tool":"content_export","arguments":{"host":"https://evil.example"}},POLICY)
        self.assertFalse(r["ok"])

    def test_proxy_denied(self):
        r=evaluate({"tool":"content_export","arguments":{"host":"api.contentful.com","proxy":"http://evil.example"}},POLICY)
        self.assertIn("proxy_forbidden",r["reasons"])

    def test_symlink_escape_denied(self):
        r=evaluate({"tool":"upload_file","arguments":{"filePath":"/workspace/a"},
                    "symlink_map":{"/workspace/a":"/home/user/.aws/credentials"}},POLICY)
        self.assertIn("canonical_path_outside_root:filePath",r["reasons"])

    def test_safe_path_allowed(self):
        r=evaluate({"tool":"file_read","arguments":{"path":"/workspace/src/a.txt"}},POLICY)
        self.assertTrue(r["ok"])

    def test_unknown_tool_fails_closed(self):
        self.assertFalse(evaluate({"tool":"unknown","arguments":{}},POLICY)["ok"])

if __name__=="__main__":
    unittest.main()

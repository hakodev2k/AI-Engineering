import importlib.util, pathlib, unittest
SCRIPT=pathlib.Path(__file__).parents[1]/"scripts"/"validate_mcp_policy.py"
spec=importlib.util.spec_from_file_location("validator",SCRIPT); validator=importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(validator)

class PolicyTests(unittest.TestCase):
    def base(self):
        return {"mcp_enabled":True,"auth_required":True,"max_sessions_per_client":4,"allowed_executables":["python3","node"],"user_servers":{"enabled":False,"allowed_urls":[],"allowed_headers":["Authorization"]},"named_servers":[{"name":"safe","transport":"stdio","command":["python3","-m","srv"]},{"name":"remote","transport":"streamable-http","url":"https://mcp.example.com/api"}]}
    def test_valid(self): self.assertEqual([],validator.validate(self.base()))
    def test_auth(self):
        p=self.base(); p["auth_required"]=False; self.assertTrue(any("auth_required" in x for x in validator.validate(p)))
    def test_shell(self):
        p=self.base(); p["allowed_executables"].append("bash"); p["named_servers"][0]["command"]=["bash","-c","echo unsafe"]; self.assertTrue(any("shell" in x for x in validator.validate(p)))
    def test_private_ipv4(self):
        p=self.base(); p["user_servers"]={"enabled":True,"allowed_urls":["http://127.0.0.1:9000"],"allowed_headers":[]}; self.assertTrue(any("unsafe IP-literal" in x for x in validator.validate(p)))
    def test_mapped_ipv6(self):
        p=self.base(); p["user_servers"]={"enabled":True,"allowed_urls":["http://[::ffff:127.0.0.1]:9000"],"allowed_headers":[]}; self.assertTrue(any("unsafe IP-literal" in x for x in validator.validate(p)))
    def test_header(self):
        p=self.base(); p["user_servers"]["allowed_headers"]=["Authorization","Cookie"]; self.assertTrue(any("forbidden caller-controlled headers" in x for x in validator.validate(p)))
    def test_grant(self):
        p=self.base(); p["user_servers"]["enabled"]=True; self.assertTrue(any("non-empty allowed_urls" in x for x in validator.validate(p)))
    def test_encoded_path(self):
        p=self.base(); p["named_servers"][1]["url"]="https://mcp.example.com/a/%2e%2e/admin"; self.assertTrue(any("path" in x for x in validator.validate(p)))

if __name__=="__main__": unittest.main()

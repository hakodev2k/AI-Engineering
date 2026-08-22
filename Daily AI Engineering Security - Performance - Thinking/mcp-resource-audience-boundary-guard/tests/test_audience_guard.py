import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"audience_guard.py"
spec=importlib.util.spec_from_file_location("guard",P); g=importlib.util.module_from_spec(spec); spec.loader.exec_module(g)
POL={"resource":"https://mcp.example/mcp","trusted_issuers":["https://issuer.example"],"required_scopes":["tools.read"],"allow_token_passthrough":False,"require_subject":True}

class GuardTests(unittest.TestCase):
    def good(self): return {"iss":"https://issuer.example","aud":"https://mcp.example/mcp","scope":"tools.read other","sub":"u1","downstream_mode":"separate"}
    def test_valid(self): self.assertEqual(g.decide(self.good(),POL)[1],0)
    def test_wrong_audience(self):
        x=self.good(); x["aud"]="https://other.example/api"; self.assertEqual(g.decide(x,POL)[1],3)
    def test_passthrough(self):
        x=self.good(); x["downstream_mode"]="passthrough"; self.assertEqual(g.decide(x,POL)[1],3)
    def test_scope(self):
        x=self.good(); x["scope"]="other"; self.assertEqual(g.decide(x,POL)[1],3)
    def test_fragment_canonicalization(self):
        x=self.good(); x["aud"]="https://mcp.example/mcp#fragment"; self.assertEqual(g.decide(x,POL)[1],0)
    def test_raw_token_rejected(self):
        x=self.good(); x["access_token"]="secret"; self.assertEqual(g.decide(x,POL)[1],3)

if __name__=="__main__": unittest.main()

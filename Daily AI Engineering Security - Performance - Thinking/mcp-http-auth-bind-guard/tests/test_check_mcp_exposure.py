import importlib.util, pathlib, unittest
SCRIPT=pathlib.Path(__file__).parents[1]/"scripts"/"check_mcp_exposure.py"
spec=importlib.util.spec_from_file_location("guard",SCRIPT); guard=importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)
class GuardTests(unittest.TestCase):
 def test_blocks_wildcard_no_auth(self): self.assertTrue(any("wildcard" in x for x in guard.inspect_listener({"name":"x","host":"::","auth_required":False,"directly_reachable":True,"capabilities":[]},0)))
 def test_blocks_dangerous_no_auth_even_loopback(self): self.assertTrue(any("dangerous" in x for x in guard.inspect_listener({"name":"x","host":"127.0.0.1","auth_required":False,"directly_reachable":True,"capabilities":["command-exec"]},0)))
 def test_allows_authenticated_sensitive_listener(self): self.assertEqual([],guard.inspect_listener({"name":"x","host":"10.0.0.2","auth_required":True,"directly_reachable":True,"capabilities":["repo-write"]},0))
 def test_blocks_proxy_bypass(self): self.assertTrue(any("proxy auth" in x for x in guard.inspect_listener({"name":"x","host":"127.0.0.1","auth_required":False,"directly_reachable":True,"proxy_auth":True,"capabilities":[]},0)))
if __name__=="__main__": unittest.main()

import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/'scripts'/'mcp_oauth_guard.py'
spec=importlib.util.spec_from_file_location('guard',P); guard=importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)
BASE={'resource':'https://mcp.example/a','expected_resource':'https://mcp.example/a','audience':'https://mcp.example/a','expected_audience':'https://mcp.example/a','issuer':'https://idp.example','expected_issuer':'https://idp.example','scopes':['read'],'allowed_scopes':['read','write'],'token_passthrough':False}
class GuardTests(unittest.TestCase):
 def test_valid(self): self.assertEqual([],guard.validate(dict(BASE)))
 def test_wrong_audience(self):
  p=dict(BASE); p['audience']='https://mcp.example/b'; self.assertIn('audience_mismatch',guard.validate(p))
 def test_wrong_resource(self):
  p=dict(BASE); p['resource']='https://mcp.example/b'; self.assertIn('resource_mismatch',guard.validate(p))
 def test_passthrough(self):
  p=dict(BASE); p['token_passthrough']=True; self.assertIn('token_passthrough_forbidden',guard.validate(p))
 def test_excess_scope(self):
  p=dict(BASE); p['scopes']=['admin']; self.assertTrue(any(x.startswith('excessive_scopes:') for x in guard.validate(p)))
if __name__=='__main__': unittest.main()

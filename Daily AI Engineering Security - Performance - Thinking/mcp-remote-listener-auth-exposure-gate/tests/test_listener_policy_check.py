import importlib.util, pathlib, unittest
P = pathlib.Path(__file__).parents[1] / 'scripts' / 'listener_policy_check.py'
spec = importlib.util.spec_from_file_location('checker', P); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
BASE = dict(transport='streamable-http', bind_host='127.0.0.1', auth_enabled=False, authorization_enabled=False, origin_validation_enabled=True, behind_authenticated_proxy=False, backend_directly_reachable=False, server_side_credentials=True, write_capable_tools=True)
class TestPolicy(unittest.TestCase):
    def test_loopback_is_allowed_without_remote_auth(self): self.assertEqual(m.evaluate(BASE), [])
    def test_remote_unauthenticated_is_blocked(self):
        p=BASE|{'bind_host':'0.0.0.0'}; self.assertTrue(any('authentication' in x for x in m.evaluate(p)))
    def test_remote_authenticated_authorized_passes(self):
        p=BASE|{'bind_host':'0.0.0.0','auth_enabled':True,'authorization_enabled':True}; self.assertEqual(m.evaluate(p), [])
    def test_proxy_bypass_is_blocked(self):
        p=BASE|{'bind_host':'0.0.0.0','authorization_enabled':True,'behind_authenticated_proxy':True,'backend_directly_reachable':True}; self.assertTrue(m.evaluate(p))
    def test_origin_required_for_remote_http(self):
        p=BASE|{'bind_host':'0.0.0.0','auth_enabled':True,'authorization_enabled':True,'origin_validation_enabled':False}; self.assertTrue(any('Origin' in x for x in m.evaluate(p)))
if __name__ == '__main__': unittest.main()

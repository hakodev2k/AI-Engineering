import unittest
from pathlib import Path
import importlib.util

P=Path(__file__).parents[1]/'scripts'/'redirect_gate.py'
spec=importlib.util.spec_from_file_location('gate',P); gate=importlib.util.module_from_spec(spec); spec.loader.exec_module(gate)
POL={'max_redirect_hops':5,'block_private_destinations':True,'allowed_redirect_hosts':[],'allowed_redirect_suffixes':[]}

class RedirectGateTests(unittest.TestCase):
    def test_same_host_redirect_passes(self):
        c={'hops':[{'url':'https://api.example.com/a','headers':{'Authorization':'Bearer x'}},{'url':'https://api.example.com/b','headers':{'Authorization':'Bearer x'}}]}
        self.assertEqual([],gate.analyze(c,POL))
    def test_cross_host_credential_is_critical(self):
        c={'hops':[{'url':'https://api.example.com/a','headers':{}},{'url':'https://evil.test/b','headers':{'Authorization':'Bearer x'}}]}
        codes={x['code'] for x in gate.analyze(c,POL)}
        self.assertIn('credential-forwarded-cross-host',codes)
        self.assertIn('unapproved-cross-site-redirect',codes)
    def test_https_downgrade_blocked(self):
        c={'hops':[{'url':'https://api.example.com/a','headers':{}},{'url':'http://api.example.com/b','headers':{}}]}
        self.assertIn('https-downgrade',{x['code'] for x in gate.analyze(c,POL)})
    def test_private_redirect_blocked(self):
        c={'hops':[{'url':'https://api.example.com/a','headers':{}},{'url':'http://127.0.0.1/admin','headers':{}}]}
        self.assertIn('private-network-redirect',{x['code'] for x in gate.analyze(c,POL)})
    def test_explicit_host_allowlist_only_relaxes_destination_rule(self):
        p=dict(POL); p['allowed_redirect_hosts']=['login.example.net']
        c={'hops':[{'url':'https://api.example.com/a','headers':{}},{'url':'https://login.example.net/auth','headers':{}}]}
        self.assertEqual([],gate.analyze(c,p))

if __name__=='__main__': unittest.main()

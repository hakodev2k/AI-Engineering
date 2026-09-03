import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/'scripts'/'containment_guard.py'
spec=importlib.util.spec_from_file_location('guard',P); g=importlib.util.module_from_spec(spec); spec.loader.exec_module(g)
POL={'required_attestations':['sandbox_enabled','monitor_external'],'forbidden_event_types':['sandbox_bypass'],'allowed_network_hosts':['api.example.com'],'fail_closed':True}
class T(unittest.TestCase):
    def test_preflight_pass(self):
        self.assertEqual(g.preflight(POL,{'sandbox_enabled':True,'monitor_external':True})[0],0)
    def test_preflight_missing_blocks(self):
        self.assertEqual(g.preflight(POL,{'sandbox_enabled':True})[1]['decision'],'block')
    def test_tripwire_stops(self):
        self.assertEqual(g.event(POL,{'type':'sandbox_bypass'})[1]['decision'],'stop')
    def test_unknown_host_stops(self):
        self.assertEqual(g.event(POL,{'type':'network','network_host':'evil.example'})[0],2)
    def test_approved_event_passes(self):
        self.assertEqual(g.event(POL,{'type':'network','network_host':'api.example.com'})[0],0)
if __name__=='__main__': unittest.main()

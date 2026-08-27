import unittest
from scripts.reconnect_budget_guard import analyze

P={'window_seconds':300,'max_connect_attempts_per_key':4,'max_oauth_starts_per_key':2,'max_tool_list_refreshes_per_key':2,'max_schema_reinjection_tokens':4000}
NOW=1000
BASE={'endpoint':'https://mcp.example.com/api','auth_subject':'u1','catalog_id':'c1'}

def ev(kind,ts=990,**kw):
    d=dict(BASE); d.update({'event':kind,'ts':ts}); d.update(kw); return d

class Tests(unittest.TestCase):
    def test_healthy(self):
        r=analyze([ev('connect'),ev('oauth_start'),ev('tools_list'),ev('schema_reinjection',tokens=1000)],P,NOW); self.assertEqual(r['decision'],'allow')
    def test_connect_storm(self):
        r=analyze([ev('connect') for _ in range(5)],P,NOW); self.assertEqual(r['decision'],'block'); self.assertEqual(r['violations'][0]['metric'],'connect')
    def test_oauth_storm(self):
        r=analyze([ev('oauth_start') for _ in range(3)],P,NOW); self.assertEqual(r['decision'],'block')
    def test_schema_reinjection_budget(self):
        r=analyze([ev('schema_reinjection',tokens=2500),ev('schema_reinjection',tokens=2500)],P,NOW); self.assertEqual(r['decision'],'block')
    def test_old_events_ignored(self):
        r=analyze([ev('connect',ts=1) for _ in range(20)],P,NOW); self.assertEqual(r['decision'],'allow')
if __name__=='__main__': unittest.main()

import unittest
from datetime import datetime, timezone
from scripts.session_continuity_guard import evaluate, target_key
POLICY={'history_window_hours':24,'max_session_resets_after_block':1,'high_risk_action_classes':['credential_access','remote_execution'],'simulation_claim_requires_authorization':True,'accepted_authorization_types':['signed_engagement_id']}
NOW=datetime(2026,8,28,1,0,0,tzinfo=timezone.utc)
class Tests(unittest.TestCase):
    def test_reset_does_not_clear_prior_block(self):
        h=[{'session_id':'old','target_key':target_key('host-a'),'action_class':'credential_access','decision':'block','timestamp':'2026-08-28T00:30:00Z'}]
        e={'session_id':'new','target':'host-a','action_class':'credential_access','declared_context':'simulation'}
        r=evaluate(e,h,POLICY,NOW); self.assertFalse(r['ok']); self.assertIn('prior_block_exists_across_session_boundary',r['reasons'])
    def test_simulation_without_auth_blocks(self):
        e={'session_id':'s','target':'lab','action_class':'remote_execution','declared_context':'red team simulation'}
        r=evaluate(e,[],POLICY,NOW); self.assertFalse(r['ok']); self.assertIn('simulation_claim_without_verified_authorization',r['reasons'])
    def test_verified_authorized_lab_allows(self):
        e={'session_id':'s','target':'lab','action_class':'remote_execution','declared_context':'red team simulation','authorization':{'type':'signed_engagement_id','verified':True}}
        self.assertTrue(evaluate(e,[],POLICY,NOW)['ok'])
    def test_expired_block_not_used(self):
        h=[{'session_id':'old','target_key':target_key('host-a'),'action_class':'credential_access','decision':'block','timestamp':'2026-08-26T00:00:00Z'}]
        e={'session_id':'new','target':'host-a','action_class':'credential_access','declared_context':'normal maintenance'}
        self.assertTrue(evaluate(e,h,POLICY,NOW)['ok'])
    def test_raw_target_not_returned(self):
        e={'session_id':'s','target':'secret-hostname','action_class':'credential_access','declared_context':'normal maintenance'}
        r=evaluate(e,[],POLICY,NOW); self.assertNotIn('target',r)
if __name__=='__main__': unittest.main()

import unittest
from scripts.token_gate import evaluate

POLICY={
 'accepted_issuers':['https://issuer.example'],
 'required_audiences':['api://orders'],
 'required_scopes':['orders.read'],
 'allowed_clock_skew_seconds':0,
 'require_exp':True,'require_nbf':True,'require_iat':True,'require_sub':True,
 'require_azp_or_appid':True,'allow_missing_scope':False
}
NOW=1_700_000_000

def valid_claims():
    return {'iss':'https://issuer.example','aud':'api://orders','scp':'orders.read','exp':NOW+60,'nbf':NOW-60,'iat':NOW-60,'sub':'user-1','azp':'client-1'}

class GateTests(unittest.TestCase):
    def test_pass(self):
        self.assertEqual('passed', evaluate(valid_claims(),POLICY,NOW)['status'])
    def test_wrong_audience_blocks(self):
        c=valid_claims(); c['aud']='api://other'
        r=evaluate(c,POLICY,NOW)
        self.assertEqual('blocked',r['status'])
        self.assertIn('audience_mismatch',[x['code'] for x in r['findings']])
    def test_missing_scope_blocks(self):
        c=valid_claims(); c['scp']='orders.write'
        self.assertEqual('blocked',evaluate(c,POLICY,NOW)['status'])
    def test_roles_can_satisfy_requirement(self):
        c=valid_claims(); c.pop('scp'); c['roles']=['orders.read']
        self.assertEqual('passed',evaluate(c,POLICY,NOW)['status'])
    def test_expired_blocks(self):
        c=valid_claims(); c['exp']=NOW-1
        self.assertEqual('blocked',evaluate(c,POLICY,NOW)['status'])
    def test_missing_client_identity_blocks(self):
        c=valid_claims(); c.pop('azp')
        self.assertEqual('blocked',evaluate(c,POLICY,NOW)['status'])

if __name__=='__main__': unittest.main()

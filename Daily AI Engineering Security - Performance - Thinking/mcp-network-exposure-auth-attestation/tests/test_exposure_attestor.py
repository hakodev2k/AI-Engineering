import unittest
from scripts.exposure_attestor import evaluate

POLICY={
 "allowed_public_auth_modes":["oauth2","mtls"],
 "require_tls_for_non_loopback":True,
 "forbid_wildcard_without_auth":True,
 "high_risk_capabilities":["shell","file_read","file_write","credential_read","admin"],
 "exfiltration_capabilities":["outbound_network"],
 "require_auth_for_high_risk_non_loopback":True,
 "forbid_credential_plus_outbound_without_mtls":True,
}
class T(unittest.TestCase):
 def test_loopback_dev_allowed(self):
  s={"listeners":[{"host":"127.0.0.1","port":3000,"tls":False,"auth_mode":"none","auth_enforced":False}],"capabilities":["file_read"]}
  self.assertTrue(evaluate(s,POLICY)["ok"])
 def test_wildcard_no_auth_blocked(self):
  s={"listeners":[{"host":"0.0.0.0","port":3000,"tls":False,"auth_mode":"none","auth_enforced":False}],"capabilities":["shell"]}
  self.assertFalse(evaluate(s,POLICY)["ok"])
 def test_public_oauth_tls_allowed(self):
  s={"listeners":[{"host":"10.0.0.5","port":443,"tls":True,"auth_mode":"oauth2","auth_enforced":True}],"capabilities":["file_read"]}
  self.assertTrue(evaluate(s,POLICY)["ok"])
 def test_credential_outbound_requires_mtls(self):
  s={"listeners":[{"host":"10.0.0.5","port":443,"tls":True,"auth_mode":"oauth2","auth_enforced":True}],"capabilities":["credential_read","outbound_network"]}
  self.assertFalse(evaluate(s,POLICY)["ok"])
if __name__=="__main__": unittest.main()

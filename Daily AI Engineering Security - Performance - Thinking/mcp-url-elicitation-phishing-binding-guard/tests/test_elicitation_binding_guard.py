import importlib.util,pathlib,unittest
from datetime import datetime,timezone
P=pathlib.Path(__file__).parents[1]/"scripts"/"elicitation_binding_guard.py"; s=importlib.util.spec_from_file_location("g",P); g=importlib.util.module_from_spec(s); s.loader.exec_module(g)
NOW=datetime(2026,8,25,5,0,tzinfo=timezone.utc)
def rec(): return {"principal":"u1","server_origin":"https://mcp.example.com","request_id":"r1","target_url":"https://login.example.com/start","nonce":"n-strong-123","issued_at":"2026-08-25T04:59:00Z","expires_at":"2026-08-25T05:10:00Z"}
class T(unittest.TestCase):
 def test_valid_once(self):
  r=rec(); r.update(expected_digest=g.issue(r,NOW)["binding_digest"],completion_principal="u1"); self.assertTrue(g.complete(r,NOW)["consume_nonce"])
 def test_cross_user(self):
  r=rec(); r.update(expected_digest=g.issue(r,NOW)["binding_digest"],completion_principal="u2"); self.assertRaisesRegex(ValueError,"principal_mismatch",g.complete,r,NOW)
 def test_replay(self):
  r=rec(); r.update(expected_digest=g.issue(r,NOW)["binding_digest"],completion_principal="u1",nonce_consumed=True); self.assertRaisesRegex(ValueError,"replay_detected",g.complete,r,NOW)
 def test_origin_drift(self):
  r=rec(); r.update(expected_digest=g.issue(r,NOW)["binding_digest"],completion_principal="u1",completion_target_url="https://evil.example.net/x"); self.assertRaisesRegex(ValueError,"origin_drift",g.complete,r,NOW)
 def test_unsafe_url(self):
  for u in ("http://login.example.com/x","https://user:pass@login.example.com/x"):
   r=rec(); r["target_url"]=u; self.assertRaises(ValueError,g.issue,r,NOW)
 def test_expired(self):
  r=rec(); r["expires_at"]="2026-08-25T04:59:30Z"; self.assertRaisesRegex(ValueError,"binding_expired",g.issue,r,NOW)
if __name__=="__main__": unittest.main()

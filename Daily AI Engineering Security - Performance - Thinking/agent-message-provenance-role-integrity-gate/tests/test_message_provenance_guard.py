import unittest
from scripts.message_provenance_guard import evaluate

P={"trusted_user_sources":["authenticated-ui"],"forbidden_user_sources":["assistant","tool","subagent","peer-session","framework-control"],"required_fields":["id","role","source_type","source_id","original_role","transport_hops"],"privileged_tools":["shell"],"max_transport_hops":4,"require_human_approval_for_privileged":True}

def m(**kw):
    x={"id":"1","role":"user","source_type":"authenticated-ui","source_id":"u","original_role":"user","transport_hops":[]}; x.update(kw); return x

class T(unittest.TestCase):
    def test_real_user(self): self.assertTrue(evaluate(m(),P)["ok"])
    def test_assistant_promoted(self): self.assertFalse(evaluate(m(source_type="assistant",source_id="a"),P)["ok"])
    def test_peer_promoted(self): self.assertFalse(evaluate(m(source_type="peer-session",source_id="s"),P)["ok"])
    def test_privileged_needs_approval(self): self.assertFalse(evaluate(m(requested_tools=["shell"]),P)["ok"])
    def test_privileged_approved(self): self.assertTrue(evaluate(m(requested_tools=["shell"],human_approved=True),P)["ok"])

if __name__=="__main__": unittest.main()

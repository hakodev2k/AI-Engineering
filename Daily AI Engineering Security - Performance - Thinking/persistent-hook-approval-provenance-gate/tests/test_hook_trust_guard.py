import unittest
from scripts.hook_trust_guard import evaluate
P={'allowed_human_origins':['trusted-ui','managed-policy'],'require_authoritative_cwd_trust':True,'require_reapproval_on_hash_change':True,'protected_scopes':['global','persistent'],'lifecycle_events':['SessionStart','SessionEnd','TurnStart','TurnEnd']}
def ev(**x):
 d={'hook_key':'k','current_hash':'abc','approved_hash':'abc','hook_scope':'persistent','event':'SessionStart','session_cwd':'/workspace/repo','authoritative_trusted_roots':['/workspace'],'approval_input_origin':'trusted-ui','initiator':'user','is_modified':False}; d.update(x); return d
class T(unittest.TestCase):
 def test_human_trusted_allowed(self): self.assertTrue(evaluate(ev(),P)['ok'])
 def test_agent_pty_cannot_approve(self): self.assertFalse(evaluate(ev(approval_input_origin='agent-pty',initiator='agent'),P)['ok'])
 def test_session_end_untrusted_cwd_blocked(self): self.assertFalse(evaluate(ev(event='SessionEnd',session_cwd='/tmp/evil'),P)['ok'])
 def test_modified_hash_requires_review(self): self.assertFalse(evaluate(ev(is_modified=True,current_hash='new'),P)['ok'])
 def test_server_tool_arbitrary_workspace_blocked(self): self.assertFalse(evaluate(ev(initiator='server-tool',approval_input_origin='model-tool',session_cwd='/attacker'),P)['ok'])
if __name__=='__main__': unittest.main()

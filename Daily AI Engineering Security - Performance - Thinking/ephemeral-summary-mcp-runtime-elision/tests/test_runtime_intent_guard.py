import unittest
from scripts.runtime_intent_guard import evaluate
P={'max_effective_mcp_for_tool_free_ephemeral':0,'allowed_completion_actions':['remove_shutdown'],'unsubscribe_only_actions':['unsubscribe','thread_unsubscribe']}
def ev(**overrides):
    value={'feature':'thread_summary','ephemeral':True,'tools_required':False,'effective_mcp_count':0,'completion_action':'remove_shutdown','pending_tool_calls':0}; value.update(overrides); return value
class RuntimeIntentGuardTests(unittest.TestCase):
    def test_tool_free_summary_passes_without_mcp(self): self.assertTrue(evaluate(ev(),P)['ok'])
    def test_inherited_mcp_is_blocked(self): self.assertFalse(evaluate(ev(effective_mcp_count=4),P)['ok'])
    def test_unsubscribe_only_is_blocked(self): self.assertFalse(evaluate(ev(completion_action='thread_unsubscribe'),P)['ok'])
    def test_tool_enabled_ephemeral_can_use_mcp_and_shutdown(self): self.assertTrue(evaluate(ev(tools_required=True,effective_mcp_count=2),P)['ok'])
    def test_pending_tool_call_blocks_disposal(self): self.assertFalse(evaluate(ev(tools_required=True,effective_mcp_count=1,pending_tool_calls=1),P)['ok'])
if __name__=='__main__': unittest.main()

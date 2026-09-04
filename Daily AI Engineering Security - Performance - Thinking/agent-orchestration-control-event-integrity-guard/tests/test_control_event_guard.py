import importlib.util, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'control_event_guard.py'
spec=importlib.util.spec_from_file_location('guard',SCRIPT); guard=importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)
POLICY={
 'allowed_event_kinds':['subagent_started','subagent_completed','status_request','wait_request','interrupted','resumed','auto_continue'],
 'terminal_states':['completed','failed','cancelled'],
 'control_event_roles':['runtime','scheduler','tool','ui'],
 'forbid_synthetic_user_role':True,
 'require_causal_id':True,
 'require_result_ref_on_completion':True,
 'routing_classes':{'status_request':['collaboration','lifecycle'],'wait_request':['collaboration','lifecycle'],'subagent_completed':['lifecycle'],'subagent_started':['lifecycle'],'interrupted':['lifecycle'],'resumed':['lifecycle'],'auto_continue':['lifecycle']}
}

def event(**kw):
    base={'event_id':'e1','kind':'status_request','source_role':'runtime','synthetic':True,'causal_id':'run1','state':'running','routing_class':'collaboration'}
    base.update(kw); return base

class Tests(unittest.TestCase):
    def test_valid_status(self): self.assertEqual([],guard.validate_event(event(),POLICY,{'run1'},'running'))
    def test_shell_route_blocked(self): self.assertTrue(any(x['reason']=='wrong_routing_class' for x in guard.validate_event(event(routing_class='shell'),POLICY,{'run1'},'running')))
    def test_completion_requires_result(self): self.assertTrue(any(x['reason']=='completion_missing_result_ref' for x in guard.validate_event(event(kind='subagent_completed',state='completed',routing_class='lifecycle'),POLICY,{'run1'},'running')))
    def test_terminal_regression_blocked(self): self.assertTrue(any(x['reason']=='terminal_state_regression' for x in guard.validate_event(event(),POLICY,{'run1'},'completed')))
    def test_unknown_causal_blocked(self): self.assertTrue(any(x['reason']=='unknown_causal_target' for x in guard.validate_event(event(causal_id='missing'),POLICY,{'run1'},'running')))
if __name__=='__main__': unittest.main()

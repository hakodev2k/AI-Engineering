from __future__ import annotations
import importlib.util,json,tempfile,unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
S=importlib.util.spec_from_file_location('gate',R/'scripts/resume_integrity_gate.py');G=importlib.util.module_from_spec(S);S.loader.exec_module(G)
class T(unittest.TestCase):
    def base(self):
        return {'task_id':'T','scope_hash':'a'*64,'repo_head':'1'*40,'working_tree_clean':True,'diff_hash':'b'*64,'stage':'impl','next_action':'test','created_at':'2026-09-05T09:00:00Z','approvals':[]}
    def current(self):
        return {'task_id':'T','scope_hash':'a'*64,'repo_head':'1'*40,'working_tree_clean':True,'diff_hash':'b'*64}
    def run_gate(self,c,cur,policy,now='2026-09-05T10:00:00Z'):
        with tempfile.TemporaryDirectory() as d:
            d=Path(d);(d/'c.json').write_text(json.dumps(c));(d/'u.json').write_text(json.dumps(cur));(d/'p.json').write_text(json.dumps(policy));out=d/'o.json'
            import sys
            old=sys.argv;sys.argv=['gate','--checkpoint',str(d/'c.json'),'--current',str(d/'u.json'),'--policy',str(d/'p.json'),'--output',str(out),'--now',now]
            try:rc=G.main()
            finally:sys.argv=old
            return rc,json.loads(out.read_text()) if out.exists() else None
    def policy(self):return {'max_checkpoint_age_minutes':240,'require_same_head':True,'require_clean_state_match':True,'require_diff_hash_match':True,'require_scope_hash_match':True,'require_unexpired_approvals':True}
    def test_matching_state_passes(self):
        rc,r=self.run_gate(self.base(),self.current(),self.policy());self.assertEqual(0,rc);self.assertEqual('pass',r['status'])
    def test_head_drift_blocks(self):
        cur=self.current();cur['repo_head']='2'*40;rc,r=self.run_gate(self.base(),cur,self.policy());self.assertEqual(1,rc);self.assertTrue(any(x['name']=='repo_head' and x['status']=='fail' for x in r['checks']))
    def test_scope_drift_blocks(self):
        cur=self.current();cur['scope_hash']='c'*64;rc,r=self.run_gate(self.base(),cur,self.policy());self.assertEqual(1,rc)
    def test_expired_approval_blocks(self):
        c=self.base();c['approvals']=[{'action':'deploy','approved_by':'x','expires_at':'2026-09-05T09:30:00Z'}];rc,r=self.run_gate(c,self.current(),self.policy());self.assertEqual(1,rc)
    def test_old_checkpoint_blocks(self):
        rc,r=self.run_gate(self.base(),self.current(),self.policy(),'2026-09-05T20:00:00Z');self.assertEqual(1,rc)
if __name__=='__main__':unittest.main()

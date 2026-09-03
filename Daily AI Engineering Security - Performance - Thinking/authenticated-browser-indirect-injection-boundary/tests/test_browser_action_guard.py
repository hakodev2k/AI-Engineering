import json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; SCRIPT=ROOT/'scripts'/'browser_action_guard.py'; POLICY=ROOT/'config'/'browser-boundary-policy.json'

class GuardTests(unittest.TestCase):
    def run_event(self,event):
        with tempfile.NamedTemporaryFile('w',suffix='.json',delete=False) as f:
            json.dump(event,f); name=f.name
        try: return subprocess.run([sys.executable,str(SCRIPT),'--policy',str(POLICY),'--event',name],capture_output=True,text=True)
        finally: Path(name).unlink(missing_ok=True)
    def base(self):
        return {'source_origin':'https://example.internal/a','target_origin':'https://example.internal/b','authenticated':True,'action':'send_message','derived_from_untrusted_content':False,'human_approved':True}
    def test_approved_same_origin_sensitive_action_allowed(self):
        self.assertEqual(self.run_event(self.base()).returncode,0)
    def test_authenticated_sensitive_without_approval_blocks(self):
        e=self.base(); e['human_approved']=False
        r=self.run_event(e); self.assertEqual(r.returncode,2); self.assertIn('requires_approval',r.stdout)
    def test_untrusted_cross_origin_sensitive_blocks_even_with_approval(self):
        e=self.base(); e['derived_from_untrusted_content']=True; e['target_origin']='https://mail.example.com'
        r=self.run_event(e); self.assertEqual(r.returncode,2); self.assertIn('untrusted_cross_origin',r.stdout)
    def test_unknown_action_blocks(self):
        e=self.base(); e['action']='magic_admin_action'
        self.assertEqual(self.run_event(e).returncode,2)

if __name__=='__main__': unittest.main()

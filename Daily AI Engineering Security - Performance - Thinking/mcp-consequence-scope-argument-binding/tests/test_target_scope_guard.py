import os, tempfile, unittest
from scripts.target_scope_guard import evaluate

class GuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(); self.root=self.tmp.name
        self.policy={'repositories':['org/repo'],'branches':['main'],'filesystem_roots':[self.root],'network_hosts':['api.example.com'],'high_consequence_tools':['push_files','write_file','connect'],'require_human_approval':True}
    def tearDown(self): self.tmp.cleanup()
    def test_allowed_exact_scope_with_approval(self):
        r=evaluate({'tool':'push_files','repository':'ORG/repo.git','branch':'main','human_approved':True},self.policy); self.assertEqual(r['decision'],'allow')
    def test_repo_escape_blocked(self):
        r=evaluate({'tool':'push_files','repository':'attacker/repo','branch':'main','human_approved':True},self.policy); self.assertIn('repository_out_of_scope',r['reasons'])
    def test_path_escape_blocked(self):
        outside=os.path.dirname(self.root)
        r=evaluate({'tool':'write_file','path':os.path.join(outside,'secret.txt'),'human_approved':True},self.policy); self.assertIn('filesystem_path_out_of_scope',r['reasons'])
    def test_host_confusion_blocked(self):
        r=evaluate({'tool':'connect','endpoint':'https://api.example.com.evil.test/x','human_approved':True},self.policy); self.assertIn('network_host_out_of_scope',r['reasons'])
    def test_high_consequence_requires_approval(self):
        r=evaluate({'tool':'push_files','repository':'org/repo','branch':'main'},self.policy); self.assertIn('human_approval_required',r['reasons'])
if __name__=='__main__': unittest.main()

import importlib.util, tempfile, unittest
from pathlib import Path
P=Path(__file__).parents[1]/"scripts"/"scope_firewall.py"
s=importlib.util.spec_from_file_location("fw",P); m=importlib.util.module_from_spec(s); s.loader.exec_module(m)
class Tests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(); root=Path(self.tmp.name)/"workspace"; root.mkdir(); self.root=str(root)
        self.policy={"tools":{"gh.write":{"operations":["write"],"repos":["acme/app"],"branches":["feature/*"],"require_approval":True},"fs.read":{"operations":["read"],"roots":[self.root],"require_approval":False},"http.fetch":{"operations":["read"],"hosts":["api.example.com"],"require_approval":False}}}
    def tearDown(self): self.tmp.cleanup()
    def test_cross_repo_denied(self):
        _,c=m.decide({"tool":"gh.write","operation":"write","target":{"repo":"acme/other","branch":"feature/x"},"approval":True},self.policy); self.assertEqual(c,m.DENY)
    def test_write_requires_approval(self):
        _,c=m.decide({"tool":"gh.write","operation":"write","target":{"repo":"acme/app","branch":"feature/x"},"approval":False},self.policy); self.assertEqual(c,m.APPROVAL)
    def test_approved_write_allowed(self):
        _,c=m.decide({"tool":"gh.write","operation":"write","target":{"repo":"acme/app","branch":"feature/x"},"approval":True},self.policy); self.assertEqual(c,m.ALLOW)
    def test_traversal_denied(self):
        outside=str(Path(self.root)/".."/"secret.txt"); _,c=m.decide({"tool":"fs.read","operation":"read","target":{"path":outside}},self.policy); self.assertEqual(c,m.DENY)
    def test_in_root_allowed(self):
        inside=str(Path(self.root)/"a.txt"); _,c=m.decide({"tool":"fs.read","operation":"read","target":{"path":inside}},self.policy); self.assertEqual(c,m.ALLOW)
    def test_bad_host_denied(self):
        _,c=m.decide({"tool":"http.fetch","operation":"read","target":{"url":"https://evil.example/x"}},self.policy); self.assertEqual(c,m.DENY)
    def test_unknown_tool_denied(self):
        _,c=m.decide({"tool":"unknown","operation":"read","target":{}},self.policy); self.assertEqual(c,m.DENY)
if __name__=="__main__": unittest.main()

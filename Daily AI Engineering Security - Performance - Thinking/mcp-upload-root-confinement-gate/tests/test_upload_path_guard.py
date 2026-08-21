import importlib.util, pathlib, tempfile, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("guard",ROOT/"scripts"/"upload_path_guard.py"); guard=importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)
class Tests(unittest.TestCase):
    def setUp(self):
        self.t=tempfile.TemporaryDirectory(); self.base=pathlib.Path(self.t.name); self.safe=self.base/"safe"; self.safe.mkdir(); self.out=self.base/"secret.txt"; self.out.write_text("synthetic"); self.good=self.safe/"report.txt"; self.good.write_text("ok")
        self.policy={"allowed_roots":[str(self.safe)],"reject_symlinks":True,"max_file_bytes":100,"require_approval_for_outside_root":False}
    def tearDown(self): self.t.cleanup()
    def test_valid(self): self.assertEqual(guard.evaluate(self.good,self.policy)[0],0)
    def test_outside_denied(self): self.assertEqual(guard.evaluate(self.out,self.policy)[0],5)
    def test_traversal_resolves_outside(self): self.assertEqual(guard.evaluate(self.safe/".."/"secret.txt",self.policy)[0],5)
    def test_sibling_prefix_denied(self):
        sibling=self.base/"safe-evil"; sibling.mkdir(); f=sibling/"x"; f.write_text("x"); self.assertEqual(guard.evaluate(f,self.policy)[0],5)
    def test_oversize_denied(self):
        f=self.safe/"large"; f.write_bytes(b"x"*101); self.assertEqual(guard.evaluate(f,self.policy)[0],5)
    def test_symlink_denied_if_supported(self):
        link=self.safe/"link"
        try: link.symlink_to(self.out)
        except (OSError,NotImplementedError): self.skipTest("symlink unavailable")
        self.assertEqual(guard.evaluate(link,self.policy)[0],5)
if __name__=="__main__": unittest.main()

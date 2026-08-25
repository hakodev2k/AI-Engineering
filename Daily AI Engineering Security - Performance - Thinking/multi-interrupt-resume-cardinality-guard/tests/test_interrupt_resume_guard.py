import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"interrupt_resume_guard.py"
s=importlib.util.spec_from_file_location("g",P); g=importlib.util.module_from_spec(s); s.loader.exec_module(g)

class TestGuard(unittest.TestCase):
    def test_exact_multi_passes(self):
        ok,r=g.validate({"pending_interrupts":[{"id":"a"},{"id":"b"}],"resume":{"responses":[{"id":"a","status":"approved"},{"id":"b","status":"rejected"}]}}); self.assertTrue(ok)
    def test_scalar_multi_blocks(self):
        ok,r=g.validate({"pending_interrupts":[{"id":"a"},{"id":"b"}],"resume":{"scalar":"yes"}}); self.assertFalse(ok); self.assertEqual(r["reason"],"scalar_resume_requires_singleton")
    def test_nested_interrupts_are_counted(self):
        ok,r=g.validate({"pending_interrupts":[{"task":"p","children":[{"id":"a"},{"id":"b"}]}],"resume":{"scalar":"x"}}); self.assertFalse(ok); self.assertEqual(r["pending_count"],2)
    def test_missing_blocks(self):
        ok,r=g.validate({"pending_interrupts":[{"id":"a"},{"id":"b"}],"resume":{"responses":[{"id":"a","status":"approved"}]}}); self.assertFalse(ok); self.assertEqual(r["missing"],["b"])
    def test_unknown_blocks(self):
        ok,r=g.validate({"pending_interrupts":[{"id":"a"}],"resume":{"responses":[{"id":"x","status":"approved"}]}}); self.assertFalse(ok); self.assertEqual(r["unknown"],["x"])
    def test_duplicate_response_blocks(self):
        ok,r=g.validate({"pending_interrupts":[{"id":"a"}],"resume":{"responses":[{"id":"a","status":"approved"},{"id":"a","status":"approved"}]}}); self.assertFalse(ok); self.assertEqual(r["duplicate_response_ids"],["a"])
if __name__=="__main__": unittest.main()

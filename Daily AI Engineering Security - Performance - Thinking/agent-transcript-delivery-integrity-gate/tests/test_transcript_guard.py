import importlib.util, pathlib, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("guard",ROOT/"scripts"/"transcript_guard.py")
g=importlib.util.module_from_spec(spec); spec.loader.exec_module(g)

def row(i,c,kind="assistant_text"): return {"event_id":i,"kind":kind,"content":c}

class GuardTests(unittest.TestCase):
    def test_complete_delivery_passes(self):
        r=g.reconcile([row("a","one"),row("b","two")],[row("a","one"),row("b","two")])
        self.assertTrue(r["verified"]); self.assertEqual(r["integrity_rate"],1.0)
    def test_missing_segment_fails(self):
        r=g.reconcile([row("a","one"),row("b","two")],[row("a","one")])
        self.assertFalse(r["verified"]); self.assertEqual(r["missing"],["b"])
    def test_modified_segment_fails(self):
        r=g.reconcile([row("a","one")],[row("a","changed")])
        self.assertFalse(r["verified"]); self.assertEqual(r["mismatched"],["a"])
    def test_non_user_facing_kind_ignored(self):
        r=g.reconcile([row("x","private","thinking")],[])
        self.assertTrue(r["verified"])
    def test_duplicate_id_fails(self):
        r=g.reconcile([row("a","one"),row("a","one")],[row("a","one")])
        self.assertFalse(r["verified"]); self.assertEqual(r["duplicate_emitted_ids"],["a"])

if __name__=="__main__": unittest.main()

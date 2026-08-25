import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"history_write_guard.py"
s=importlib.util.spec_from_file_location("g",P); g=importlib.util.module_from_spec(s); s.loader.exec_module(g)

class TestHistoryGuard(unittest.TestCase):
    def test_single_writer_unique_passes(self):
        ok,r=g.validate({"writers":[{"id":"session","mode":"authoritative_append"},{"id":"gateway","mode":"observer"}],"events":[{"writer":"session","message_ids":["m1","m2"]},{"writer":"session","message_ids":["m3"]}]}); self.assertTrue(ok); self.assertEqual(r["append_amplification"],1.0)
    def test_multiple_append_writers_block(self):
        ok,r=g.validate({"writers":[{"id":"a","mode":"append"},{"id":"b","mode":"append"}],"events":[]}); self.assertFalse(ok); self.assertIn("active_append_writer_count_not_one",r["reasons"])
    def test_reappend_blocks_and_measures(self):
        ok,r=g.validate({"writers":[{"id":"a","mode":"append"}],"events":[{"writer":"a","message_ids":["m1","m2"]},{"writer":"a","message_ids":["m1","m2","m3"]}]}); self.assertFalse(ok); self.assertEqual(r["duplicate_commits"],2); self.assertGreater(r["append_amplification"],1.0)
    def test_non_append_writer_commit_blocks(self):
        ok,r=g.validate({"writers":[{"id":"a","mode":"append"},{"id":"observer","mode":"observer"}],"events":[{"writer":"observer","message_ids":["m1"]}]}); self.assertFalse(ok); self.assertEqual(r["non_append_event_writers"],["observer"]); self.assertIn("event_from_non_append_writer",r["reasons"])
    def test_two_writers_same_message_blocks(self):
        ok,r=g.validate({"writers":[{"id":"a","mode":"append"},{"id":"b","mode":"observer"}],"events":[{"writer":"a","message_ids":["m1"]},{"writer":"b","message_ids":["m1"]}]}); self.assertFalse(ok); self.assertEqual(r["duplicate_message_ids"],["m1"]); self.assertIn("event_from_non_append_writer",r["reasons"])
    def test_unknown_writer_blocks(self):
        ok,r=g.validate({"writers":[{"id":"a","mode":"append"}],"events":[{"writer":"x","message_ids":["m1"]}]}); self.assertFalse(ok); self.assertEqual(r["unknown_writers"],["x"])
    def test_bad_id_rejected(self):
        with self.assertRaises(ValueError): g.validate({"writers":[{"id":"a","mode":"append"}],"events":[{"writer":"a","message_ids":[""]}]})
if __name__=="__main__": unittest.main()

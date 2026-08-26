import unittest
from scripts.progress_watchdog import analyze
CFG={"max_identical_no_progress":3,"max_no_progress_steps":6,"max_recovery_attempts":1,"max_tokens_without_progress":1000,"normalize_ignored_argument_keys":["request_id"]}
class Tests(unittest.TestCase):
    def test_productive_trace_continues(self):
        rows=[{"tool":"read","args":{"p":"a"},"progress":False,"tokens":100},{"tool":"edit","args":{"p":"a"},"progress":True,"tokens":200}]
        self.assertEqual(analyze(rows,CFG)["status"],"continue")
    def test_repeated_call_triggers_recovery(self):
        rows=[{"tool":"poll","args":{"job":1},"progress":False,"tokens":100} for _ in range(3)]
        r=analyze(rows,CFG); self.assertEqual(r["events"][0]["reason"],"identical_no_progress")
    def test_ignored_args_do_not_hide_repeat(self):
        rows=[{"tool":"poll","args":{"job":1,"request_id":str(i)},"progress":False,"tokens":100} for i in range(3)]
        self.assertTrue(analyze(rows,CFG)["events"])
    def test_bounded_recovery_stops(self):
        rows=[{"tool":"poll","args":{"job":1},"progress":False,"tokens":1} for _ in range(6)]
        self.assertEqual(analyze(rows,CFG)["status"],"stop")
    def test_invalid_input(self):
        self.assertEqual(analyze([{"tool":"x"}],CFG)["status"],"invalid")
if __name__=="__main__": unittest.main()

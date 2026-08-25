import unittest
from scripts.watchdog_decision import decide

BASE={"silence_s":610,"p99_gap_s":700,"transport":"open","progress_age_s":610,"retry_count":0,"hard_ceiling_s":1800}
class Tests(unittest.TestCase):
 def test_slow_healthy_not_killed_at_600(self): self.assertEqual(decide(BASE)["action"],"continue")
 def test_dead_transport_aborts(self): self.assertEqual(decide(dict(BASE,transport="failed",p99_gap_s=300,progress_age_s=400))["action"],"abort")
 def test_hard_ceiling(self): self.assertEqual(decide(dict(BASE,silence_s=1800))["action"],"abort")
 def test_retry_budget_escalates(self): self.assertEqual(decide(dict(BASE,retry_count=2))["action"],"escalate")
 def test_recent_progress_defers(self): self.assertEqual(decide(dict(BASE,silence_s=900,p99_gap_s=600,progress_age_s=20))["action"],"defer")
 def test_missing_rejected(self):
  with self.assertRaises(ValueError): decide({"silence_s":1})
if __name__=="__main__": unittest.main()

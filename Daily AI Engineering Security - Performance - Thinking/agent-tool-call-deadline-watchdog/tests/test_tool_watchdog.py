import unittest
from scripts.tool_watchdog import classify

P={"default_deadline_ms":1000,"network_deadline_ms":500,"stale_grace_ms":100,"max_total_attempts":2,"max_total_wall_ms":5000}

class Tests(unittest.TestCase):
    def base(self, **kw):
        x={"call_id":"c1","tool":"fetch","started_ms":1000,"side_effect":"read","idempotent":True,"attempt":1,"deadline_class":"network"}
        x.update(kw); return x
    def test_healthy(self):
        r=classify(self.base(),P,1400); self.assertEqual(r["decision"],"observe"); self.assertFalse(r["stale"])
    def test_stale_read_retries_once(self):
        r=classify(self.base(),P,1700); self.assertEqual(r["decision"],"cancel_and_retry_once"); self.assertTrue(r["retry_allowed"])
    def test_consequential_never_auto_retries(self):
        r=classify(self.base(side_effect="write"),P,1700); self.assertEqual(r["decision"],"cancel_and_escalate")
    def test_attempt_budget(self):
        r=classify(self.base(attempt=2),P,1700); self.assertEqual(r["reason"],"attempt_budget_exhausted")
    def test_missing_field_blocks(self):
        e=self.base(); del e["tool"]; self.assertEqual(classify(e,P,1700)["decision"],"block")

if __name__ == "__main__": unittest.main()

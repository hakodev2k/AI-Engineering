import unittest
from scripts.retry_watchdog import canonical_signature, decide

POLICY={"max_same_failure_retries":2,"max_total_retries_per_stage":4,"max_no_progress_seconds":120,"require_recovery_evidence_before_retry":True}

class WatchdogTests(unittest.TestCase):
    def event(self, **kw):
        e={"schema_id":"finding-v1","validation_error":"missing finding_id","payload":{},"history":[],"last_progress_epoch":1000}
        e.update(kw); return e
    def test_first_failure_retries(self):
        self.assertEqual(decide(self.event(), POLICY, now=1010)["decision"], "retry")
    def test_same_signature_requires_recovery(self):
        e=self.event(); sig=canonical_signature(e); e["history"]=[{"signature":sig}]
        self.assertEqual(decide(e, POLICY, now=1010)["decision"], "recover")
    def test_same_signature_caps(self):
        e=self.event(); sig=canonical_signature(e); e["history"]=[{"signature":sig},{"signature":sig}]
        self.assertEqual(decide(e, POLICY, now=1010)["decision"], "fail-partial")
    def test_progress_deadline(self):
        self.assertEqual(decide(self.event(), POLICY, now=1201)["reason"], "no_progress_deadline")
    def test_recovery_evidence_allows_bounded_retry(self):
        e=self.event(recovery_evidence={"required_fields":["finding_id"]}); sig=canonical_signature(e); e["history"]=[{"signature":sig}]
        self.assertEqual(decide(e, POLICY, now=1010)["decision"], "retry")

if __name__ == "__main__": unittest.main()

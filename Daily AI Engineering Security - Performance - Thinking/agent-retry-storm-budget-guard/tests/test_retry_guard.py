import random
import unittest
from scripts.retry_guard import evaluate

POLICY={"task_retry_budget":8,"operation_retry_budget":3,"max_elapsed_ms":30000,"base_delay_ms":500,"max_delay_ms":8000,"retryable_statuses":[408,425,429,500,502,503,504],"non_retryable_statuses":[400,401,403,404,409,422],"require_idempotent_for_retry":True,"circuit_failure_threshold":5,"circuit_open_ms":30000,"respect_retry_after":True}

class RetryGuardTests(unittest.TestCase):
    def base(self, **kw):
        e={"status":503,"operation_attempt":0,"task_retry_count":0,"elapsed_ms":100,"idempotent":True,"consecutive_endpoint_failures":1}
        e.update(kw); return e
    def test_transient_retry(self):
        r=evaluate(self.base(), POLICY, random.Random(1)); self.assertEqual(r["decision"],"retry"); self.assertGreaterEqual(r["delay_ms"],0)
    def test_non_idempotent_fails_fast(self):
        self.assertEqual(evaluate(self.base(idempotent=False),POLICY)["decision"],"fail_fast")
    def test_task_budget_blocks(self):
        self.assertEqual(evaluate(self.base(task_retry_count=8),POLICY)["decision"],"fail_fast")
    def test_auth_failure_not_retried(self):
        self.assertEqual(evaluate(self.base(status=401),POLICY)["decision"],"fail_fast")
    def test_circuit_opens(self):
        self.assertEqual(evaluate(self.base(consecutive_endpoint_failures=5),POLICY)["decision"],"circuit_open")
    def test_retry_after_respected(self):
        r=evaluate(self.base(retry_after_ms=2500),POLICY); self.assertEqual(r["delay_ms"],2500)

if __name__=="__main__": unittest.main()

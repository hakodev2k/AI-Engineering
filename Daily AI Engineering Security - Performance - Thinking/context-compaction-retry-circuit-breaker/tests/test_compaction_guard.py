import unittest
from scripts.compaction_guard import evaluate
P={"max_attempts":2,"min_shrink_tokens":1000,"min_free_tokens":2000,"max_retry_debris_tokens":256,"require_failure_fingerprint_change":True}
def s(**kw):
 x={"attempt":1,"input_tokens":80000,"context_limit":100000,"reserved_output_tokens":8000,"previous_input_tokens":83000,"failure_fingerprint":"b","previous_failure_fingerprint":"a","durable_retry_debris_tokens":0}; x.update(kw); return x
class T(unittest.TestCase):
 def test_allow(self): self.assertEqual(evaluate(s(),P)["decision"],"allow_retry")
 def test_same_failure(self): self.assertIn("identical_failure_fingerprint",evaluate(s(failure_fingerprint="x",previous_failure_fingerprint="x"),P)["reasons"])
 def test_no_shrink(self): self.assertIn("retry_not_monotonically_smaller",evaluate(s(input_tokens=82500,previous_input_tokens=83000),P)["reasons"])
 def test_low_headroom(self): self.assertIn("insufficient_reserved_headroom",evaluate(s(input_tokens=91000),P)["reasons"])
 def test_debris(self): self.assertIn("durable_retry_debris_exceeds_budget",evaluate(s(durable_retry_debris_tokens=1000),P)["reasons"])
 def test_invalid(self): self.assertEqual(evaluate({},P)["decision"],"block_invalid_state")
if __name__=="__main__": unittest.main()

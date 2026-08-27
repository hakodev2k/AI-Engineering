import unittest
from scripts.overflow_circuit_breaker import classify

P={"context_limit_tokens":10000,"reserved_output_tokens":1000,"safety_margin_tokens":0,"max_compaction_attempts":2,"max_same_signature_retries":1,"minimum_progress_tokens":500,"minimum_progress_ratio":0.01,"fail_if_immutable_context_cannot_fit":True}

class Tests(unittest.TestCase):
    def base(self, **kw):
        e={"input_tokens":8000,"immutable_tokens":2000,"compaction_attempts":0,"same_signature_retries":0}
        e.update(kw); return e
    def test_proceed_under_budget(self):
        self.assertEqual(classify(self.base(),P)["decision"],"proceed")
    def test_preflight_overflow_compacts(self):
        self.assertEqual(classify(self.base(input_tokens=9500),P)["decision"],"compact_then_recheck")
    def test_provider_pattern_overflow(self):
        r=classify(self.base(provider_error="Input length 131393 exceeds the maximum allowed input length of 131040 tokens."),P)
        self.assertEqual(r["decision"],"compact_then_recheck")
    def test_repeated_signature_fails_fast(self):
        r=classify(self.base(input_tokens=9500,same_signature_retries=1),P); self.assertEqual(r["reason"],"same_oversized_request_repeated")
    def test_no_compaction_progress_fails(self):
        r=classify(self.base(input_tokens=9400,previous_input_tokens=9500,compaction_attempts=1),P); self.assertEqual(r["reason"],"compaction_not_making_progress")
    def test_immutable_context_impossible(self):
        r=classify(self.base(input_tokens=9500,immutable_tokens=9500),P); self.assertEqual(r["reason"],"immutable_context_exceeds_budget")

if __name__=="__main__": unittest.main()

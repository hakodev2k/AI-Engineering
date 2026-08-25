import unittest
from scripts.context_recovery_guard import classify

class GuardTests(unittest.TestCase):
    def base(self):
        return {"context_tokens":100000,"standard_limit":200000,"max_context_tokens":1000000,"reserve_tokens":30000,"cache_hit_ratio":0.8,"cache_age_seconds":20,"recent_transport_errors":0}

    def test_healthy_allows(self):
        self.assertEqual(classify(self.base())[0], "allow")

    def test_oversized_cold_cache_errors_evacuates(self):
        t=self.base(); t.update(context_tokens=260000,cache_hit_ratio=0.0,cache_age_seconds=1800,recent_transport_errors=2)
        action,reasons=classify(t)
        self.assertEqual(action,"export-and-fork")
        self.assertIn("repeated_transport_error",reasons)

    def test_high_max_ratio_evacuates(self):
        t=self.base(); t["context_tokens"]=960000
        self.assertEqual(classify(t)[0],"export-and-fork")

    def test_low_reserve_blocks(self):
        t=self.base(); t["reserve_tokens"]=1000
        self.assertEqual(classify(t)[0],"block")

    def test_compact_threshold(self):
        t=self.base(); t["context_tokens"]=170000
        self.assertEqual(classify(t)[0],"compact")

    def test_unknown_cache_is_conservative_after_errors(self):
        t=self.base(); t.update(context_tokens=260000,recent_transport_errors=2); t.pop("cache_hit_ratio"); t.pop("cache_age_seconds")
        self.assertEqual(classify(t)[0],"export-and-fork")

if __name__ == "__main__": unittest.main()

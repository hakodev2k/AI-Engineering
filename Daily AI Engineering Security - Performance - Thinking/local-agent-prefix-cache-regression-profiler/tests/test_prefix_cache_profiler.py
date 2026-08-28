import unittest
from scripts.prefix_cache_profiler import analyze
T={'min_reusable_prefix_ratio':.7,'min_cache_read_ratio_on_reusable':.6,'max_full_refill_rate':.2,'max_ttft_growth_ms_per_1k_input_tokens':150,'require_equivalence_pass':True}
class Tests(unittest.TestCase):
 def test_healthy_growing_prefix(self):
  rows=[{'input_tokens':10000,'reusable_prefix_tokens':9000,'cached_tokens':8500,'ttft_ms':300,'equivalence_pass':True},{'input_tokens':20000,'reusable_prefix_tokens':19000,'cached_tokens':18000,'ttft_ms':350,'equivalence_pass':True},{'input_tokens':30000,'reusable_prefix_tokens':29000,'cached_tokens':28000,'ttft_ms':390,'equivalence_pass':True}]
  self.assertEqual(analyze(rows,T)['status'],'pass')
 def test_zero_reuse_fails(self):
  rows=[{'input_tokens':10000,'reusable_prefix_tokens':9000,'cached_tokens':0,'ttft_ms':300,'equivalence_pass':True},{'input_tokens':30000,'reusable_prefix_tokens':29000,'cached_tokens':0,'ttft_ms':5000,'equivalence_pass':True}]
  r=analyze(rows,T); self.assertEqual(r['status'],'fail'); self.assertIn('full_refill_rate_above_threshold',r['violations'])
 def test_wrong_reuse_fails_even_if_fast(self):
  rows=[{'input_tokens':10000,'reusable_prefix_tokens':9000,'cached_tokens':9000,'ttft_ms':100,'equivalence_pass':False},{'input_tokens':20000,'reusable_prefix_tokens':19000,'cached_tokens':19000,'ttft_ms':110,'equivalence_pass':True}]
  self.assertIn('output_equivalence_failed',analyze(rows,T)['violations'])
 def test_insufficient(self): self.assertEqual(analyze([],T)['status'],'insufficient_evidence')
if __name__=='__main__': unittest.main()

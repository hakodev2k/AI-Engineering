import importlib.util,pathlib,unittest
P=pathlib.Path(__file__).parents[1]/'scripts'/'cache_churn_profiler.py'; s=importlib.util.spec_from_file_location('p',P); p=importlib.util.module_from_spec(s); s.loader.exec_module(p)
class T(unittest.TestCase):
 def test_stable_rewrite_detected(self):
  r=[{'ts':0,'input_tokens':1,'cache_read_tokens':10,'cache_write_tokens':0,'prefix_fingerprint':'x'},{'ts':10,'input_tokens':1,'cache_read_tokens':0,'cache_write_tokens':10,'prefix_fingerprint':'x'}]; m=p.analyze(r); self.assertEqual(1,m['stable_prefix_resets']); self.assertEqual(10,m['redundant_write_tokens'])
 def test_changed_prefix_not_called_redundant(self):
  r=[{'ts':0,'input_tokens':1,'cache_read_tokens':10,'cache_write_tokens':0,'prefix_fingerprint':'x'},{'ts':10,'input_tokens':1,'cache_read_tokens':0,'cache_write_tokens':10,'prefix_fingerprint':'y'}]; self.assertEqual(0,p.analyze(r)['stable_prefix_resets'])
 def test_ratios_bounded(self):
  m=p.analyze([{'ts':0,'input_tokens':10,'cache_read_tokens':90,'cache_write_tokens':0}]); self.assertGreaterEqual(m['weighted_cache_read_ratio'],0); self.assertLessEqual(m['weighted_cache_read_ratio'],1)
if __name__=='__main__': unittest.main()

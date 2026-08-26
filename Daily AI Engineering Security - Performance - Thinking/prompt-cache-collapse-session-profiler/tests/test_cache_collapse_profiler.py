import unittest
from scripts.cache_collapse_profiler import analyze
CFG={'min_context_tokens':100000,'max_cache_read_ratio':0.5,'min_cache_write_ratio':0.4,'min_consecutive_collapse_requests':2,'max_optimization_iterations':2}
class Tests(unittest.TestCase):
    def test_detects_sustained_collapse(self):
        rows=[
          {'input_tokens':200000,'cache_read_tokens':20000,'cache_write_tokens':160000,'latency_ms':1000},
          {'input_tokens':210000,'cache_read_tokens':20000,'cache_write_tokens':170000,'latency_ms':1200}
        ]
        r=analyze(rows,CFG); self.assertEqual(r['status'],'collapse_detected'); self.assertEqual(len(r['episodes']),1)
    def test_single_miss_not_episode(self):
        rows=[{'input_tokens':200000,'cache_read_tokens':20000,'cache_write_tokens':160000,'latency_ms':1000}]
        self.assertEqual(analyze(rows,CFG)['status'],'healthy_or_insufficient')
    def test_healthy_reuse(self):
        rows=[{'input_tokens':200000,'cache_read_tokens':180000,'cache_write_tokens':10000,'latency_ms':200} for _ in range(3)]
        self.assertEqual(analyze(rows,CFG)['episodes'],[])
    def test_small_context_ignored(self):
        rows=[{'input_tokens':10000,'cache_read_tokens':0,'cache_write_tokens':9000,'latency_ms':100} for _ in range(3)]
        self.assertEqual(analyze(rows,CFG)['episodes'],[])
    def test_invalid(self):
        self.assertEqual(analyze([{'input_tokens':1}],CFG)['status'],'invalid')
if __name__=='__main__': unittest.main()

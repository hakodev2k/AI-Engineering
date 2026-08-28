import unittest
from scripts.context_cache_analyzer import analyze

class AnalyzerTests(unittest.TestCase):
    def test_detects_same_set_order_drift(self):
        a={'type':'function','function':{'name':'a','parameters':{'type':'object'}}}
        b={'type':'function','function':{'name':'b','parameters':{'type':'object'}}}
        rows=[
            {'prompt_tokens':1000,'cached_tokens':900,'tools':[a,b],'ttft_ms':100,'latency_ms':500,'quality_pass':True},
            {'prompt_tokens':1000,'cached_tokens':100,'tools':[b,a],'ttft_ms':300,'latency_ms':800,'quality_pass':True},
        ]
        r=analyze(rows,{'min_cache_hit_ratio':0.7,'max_order_drift_groups':0,'min_quality_pass_rate':1.0})
        self.assertFalse(r['ok']); self.assertEqual(r['same_set_order_drift_groups'],1)
        self.assertIn('tool_order_drift',r['violations'])

    def test_stable_high_cache_passes(self):
        a={'type':'function','function':{'name':'a','parameters':{'type':'object'}}}
        rows=[
            {'prompt_tokens':1000,'cached_tokens':950,'tools':[a],'quality_pass':True},
            {'prompt_tokens':1200,'cached_tokens':1100,'tools':[a],'quality_pass':True},
        ]
        r=analyze(rows,{'min_cache_hit_ratio':0.8,'max_order_drift_groups':0,'min_quality_pass_rate':1.0})
        self.assertTrue(r['ok'])

    def test_quality_gate_blocks(self):
        r=analyze([{'prompt_tokens':10,'cached_tokens':10,'tools':[],'quality_pass':False}],{'min_quality_pass_rate':1.0})
        self.assertIn('quality_regression',r['violations'])

    def test_invalid_tokens_raise(self):
        with self.assertRaises(ValueError):
            analyze([{'prompt_tokens':5,'cached_tokens':6,'tools':[]}])

if __name__=='__main__': unittest.main()

import unittest
from scripts.cache_breakpoint_profiler import analyze
class T(unittest.TestCase):
 def test_detects_breakpoint(self):
  rows=[
   {'event':'tool_discovery','tool_schema_count':6,'cache_read_tokens':900,'cache_creation_tokens':0,'input_tokens':1000,'latency_ms':100},
   {'event':'model','tool_schema_count':6,'cache_read_tokens':100,'cache_creation_tokens':800,'input_tokens':1000,'latency_ms':900},
  ]
  r=analyze(rows); self.assertEqual(r['status'],'measured'); self.assertEqual(r['recommended_max_batch'],5); self.assertEqual(len(r['breakpoints']),1)
 def test_healthy_no_breakpoint(self):
  rows=[
   {'event':'tool_discovery','tool_schema_count':3,'cache_read_tokens':900,'cache_creation_tokens':0,'input_tokens':1000,'latency_ms':100},
   {'event':'model','tool_schema_count':3,'cache_read_tokens':900,'cache_creation_tokens':50,'input_tokens':1000,'latency_ms':120},
  ]
  r=analyze(rows); self.assertEqual(r['breakpoints'],[]); self.assertIsNone(r['recommended_max_batch'])
 def test_insufficient(self): self.assertEqual(analyze([])['status'],'insufficient_evidence')
if __name__=='__main__': unittest.main()

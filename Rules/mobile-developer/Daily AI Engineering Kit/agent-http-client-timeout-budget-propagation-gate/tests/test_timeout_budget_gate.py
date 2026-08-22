import importlib.util, pathlib, tempfile, unittest, yaml

ROOT=pathlib.Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location('gate',ROOT/'scripts'/'timeout_budget_gate.py')
MOD=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(MOD)

class GateTests(unittest.TestCase):
 def policy(self):
  return {'block_unbounded_timeout':True,'require_cancellation_propagation':True}
 def test_detects_infinite_timeout(self):
  with tempfile.TemporaryDirectory() as d:
   pathlib.Path(d,'a.cs').write_text('client.Timeout = Timeout.InfiniteTimeSpan;',encoding='utf-8')
   f=MOD.scan(d,self.policy()); self.assertTrue(any(x['type']=='unbounded-timeout' for x in f))
 def test_detects_missing_cancellation(self):
  with tempfile.TemporaryDirectory() as d:
   pathlib.Path(d,'a.cs').write_text('await HttpClient.GetAsync(url);',encoding='utf-8')
   f=MOD.scan(d,self.policy()); self.assertTrue(any(x['type']=='missing-cancellation-dotnet' for x in f))
 def test_allows_cancellation_token(self):
  with tempfile.TemporaryDirectory() as d:
   pathlib.Path(d,'a.cs').write_text('await HttpClient.GetAsync(url, cancellationToken);',encoding='utf-8')
   self.assertFalse(any(x['type']=='missing-cancellation-dotnet' for x in MOD.scan(d,self.policy())))

if __name__=='__main__': unittest.main()

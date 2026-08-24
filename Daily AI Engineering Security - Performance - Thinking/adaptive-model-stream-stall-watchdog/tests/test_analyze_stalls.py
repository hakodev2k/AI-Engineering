import importlib.util, pathlib, tempfile, unittest
P=pathlib.Path(__file__).parents[1]/'scripts'/'analyze_stalls.py'
s=importlib.util.spec_from_file_location('a',P); m=importlib.util.module_from_spec(s); s.loader.exec_module(m)
class T(unittest.TestCase):
 def test_quantile_and_timeout_classification(self):
  ev=[]
  for i in range(25): ev += [{'timestamp_ms':0,'request_id':f'r{i}','phase':'ttft','event':'start','bucket':'x'},{'timestamp_ms':100+i,'request_id':f'r{i}','phase':'ttft','event':'completed','bucket':'x'}]
  ev += [{'timestamp_ms':0,'request_id':'t','phase':'ttft','event':'start','bucket':'x'},{'timestamp_ms':110,'request_id':'t','phase':'ttft','event':'timeout','bucket':'x'}]
  pol={'min_samples':20,'quantile':.99,'multiplier':1.25,'ttft_floor_ms':10,'ttft_ceiling_ms':1000,'stream_floor_ms':10,'stream_ceiling_ms':1000}
  r=m.analyze(ev,pol); self.assertIn('x:ttft',r['recommendations']); self.assertTrue(r['timeouts'][0]['inside_healthy_tail'])
 def test_invalid_phase(self):
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d)/'x'; p.write_text('{"timestamp_ms":0,"request_id":"r","phase":"bad","event":"start"}\n')
   with self.assertRaises(ValueError): m.load(p)
if __name__=='__main__': unittest.main()

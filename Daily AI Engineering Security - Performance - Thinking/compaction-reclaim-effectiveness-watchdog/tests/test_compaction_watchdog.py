import importlib.util,pathlib,unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"compaction_watchdog.py"
s=importlib.util.spec_from_file_location("w",P); w=importlib.util.module_from_spec(s); s.loader.exec_module(w)
class T(unittest.TestCase):
 def test_good_metrics(self):
  r,ratio,u=w.event_metrics({"tokens_before":100,"tokens_after":60,"context_window":120,"reserved_tokens":0}); self.assertEqual(40,r); self.assertAlmostEqual(.4,ratio); self.assertAlmostEqual(.5,u)
 def test_zero_reclaim(self):
  r,ratio,_=w.event_metrics({"tokens_before":100,"tokens_after":100,"context_window":200}); self.assertEqual(0,r); self.assertEqual(0,ratio)
 def test_growth(self):
  r,_,_=w.event_metrics({"tokens_before":100,"tokens_after":120,"context_window":200}); self.assertLess(r,0)
 def test_invalid_capacity(self):
  with self.assertRaises(ValueError): w.event_metrics({"tokens_before":1,"tokens_after":1,"context_window":100,"reserved_tokens":100})
if __name__=="__main__":unittest.main()

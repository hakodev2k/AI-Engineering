import importlib.util,unittest
from pathlib import Path
S=Path(__file__).parents[1]/"scripts"/"semantic_progress_watchdog.py";sp=importlib.util.spec_from_file_location("w",S);w=importlib.util.module_from_spec(sp);sp.loader.exec_module(w)
class T(unittest.TestCase):
 def test_heartbeat_does_not_count(self):
  e=[{"ts_ms":0,"kind":"text_delta"},{"ts_ms":10000,"kind":"heartbeat"},{"ts_ms":31001,"kind":"heartbeat"}]
  self.assertEqual(w.analyze(e,30000,300000,w.SEM_DEFAULT)["reason"],"semantic_timeout")
 def test_progress_resets_semantic_clock(self):
  e=[{"ts_ms":0,"kind":"text_delta"},{"ts_ms":20000,"kind":"text_delta"},{"ts_ms":40000,"kind":"completion"}]
  self.assertEqual(w.analyze(e,30000,300000,w.SEM_DEFAULT)["decision"],"healthy")
 def test_overall_deadline(self):
  e=[{"ts_ms":0,"kind":"text_delta"},{"ts_ms":20000,"kind":"text_delta"},{"ts_ms":40001,"kind":"text_delta"}]
  self.assertEqual(w.analyze(e,30000,30000,w.SEM_DEFAULT)["reason"],"overall_timeout")
 def test_non_monotonic_rejected(self):
  with self.assertRaises(ValueError):w.analyze([{"ts_ms":2,"kind":"text_delta"},{"ts_ms":1,"kind":"text_delta"}],30,300,w.SEM_DEFAULT)
if __name__=="__main__":unittest.main()

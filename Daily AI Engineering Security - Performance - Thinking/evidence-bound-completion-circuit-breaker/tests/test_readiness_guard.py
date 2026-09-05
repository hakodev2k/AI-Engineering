import importlib.util,pathlib,unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"readiness_guard.py";s=importlib.util.spec_from_file_location("g",P);g=importlib.util.module_from_spec(s);s.loader.exec_module(g)
class T(unittest.TestCase):
 def test_levels(self):self.assertEqual(g.LEVELS[2],"validated-target")
 def test_timestamp(self):self.assertIsNotNone(g.ts("2026-09-05T10:00:00Z").tzinfo)
 def test_invalid(self):
  with self.assertRaises(ValueError):g.ts("bad")
if __name__=="__main__":unittest.main()

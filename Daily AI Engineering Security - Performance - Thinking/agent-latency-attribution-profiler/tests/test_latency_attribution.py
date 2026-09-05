import importlib.util,pathlib,unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"latency_attribution.py";s=importlib.util.spec_from_file_location("p",P);p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
class T(unittest.TestCase):
 def test_duration(self):self.assertAlmostEqual(p.duration({"tool_started":1.0,"tool_ended":1.2},"tool_started","tool_ended"),200.0)
 def test_invalid_order(self):self.assertIsNone(p.duration({"tool_started":2,"tool_ended":1},"tool_started","tool_ended"))
 def test_percentile(self):self.assertEqual(p.percentile([1,2,3],.5),2)
if __name__=="__main__":unittest.main()

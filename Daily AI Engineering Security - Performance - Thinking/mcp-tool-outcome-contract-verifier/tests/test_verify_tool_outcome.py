import importlib.util,pathlib,unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"verify_tool_outcome.py"
s=importlib.util.spec_from_file_location("v",P); v=importlib.util.module_from_spec(s); s.loader.exec_module(v)
class T(unittest.TestCase):
 def test_normal_failure(self): self.assertEqual(("failure",[]),v.classify({"isError":True,"runtime_status":"failed","output":"x"}))
 def test_iserror_completed_blocks(self): self.assertTrue(v.classify({"isError":True,"runtime_status":"completed","output":"x"})[1])
 def test_denial_success_blocks(self): self.assertTrue(v.classify({"isError":False,"runtime_status":"completed","output":"Permission denied"})[1])
 def test_verified_write_passes(self): self.assertEqual([],v.classify({"isError":False,"runtime_status":"completed","output":"ok","consequential":True,"verified":True})[1])
 def test_unverified_write_blocks(self): self.assertTrue(v.classify({"isError":False,"runtime_status":"completed","output":"ok","consequential":True,"verified":False})[1])
if __name__=="__main__": unittest.main()

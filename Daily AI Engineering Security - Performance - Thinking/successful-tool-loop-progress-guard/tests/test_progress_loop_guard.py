import importlib.util,pathlib,unittest
SCRIPT=pathlib.Path(__file__).parents[1]/"scripts"/"progress_loop_guard.py"
spec=importlib.util.spec_from_file_location("guard",SCRIPT); guard=importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)
def e(progress,result="same"): return {"action":"grep","target":"repo","result":result,"progress":progress}
class LoopTests(unittest.TestCase):
 def test_blocks_successful_nonprogress(self): self.assertTrue(guard.detect([e(1),e(1),e(1)],8,3)["blocked"])
 def test_allows_progress(self): self.assertFalse(guard.detect([e(1),e(2),e(3)],8,3)["blocked"])
 def test_allows_different_results(self): self.assertFalse(guard.detect([e(1,"a"),e(1,"b"),e(1,"c")],8,3)["blocked"])
 def test_bad_config(self):
  with self.assertRaises(ValueError): guard.detect([],1,3)
if __name__=="__main__": unittest.main()

import importlib.util,pathlib,unittest
SCRIPT=pathlib.Path(__file__).parents[1]/"scripts"/"context_budget_guard.py"
spec=importlib.util.spec_from_file_location("guard",SCRIPT); guard=importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)
class BudgetTests(unittest.TestCase):
 def test_threshold_boundary(self):
  r=guard.calculate(400000,32000,.8,294399); self.assertFalse(r["compact"])
  r=guard.calculate(400000,32000,.8,294400); self.assertTrue(r["compact"])
 def test_uses_used_not_remaining(self): self.assertFalse(guard.calculate(400000,0,.8,50000)["compact"])
 def test_reserved_capacity(self): self.assertEqual(900,guard.calculate(1000,100,.5,0)["usable_tokens"])
 def test_invalid_used(self):
  with self.assertRaises(ValueError): guard.calculate(1000,0,.8,-1)
if __name__=="__main__": unittest.main()

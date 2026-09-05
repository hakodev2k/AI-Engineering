import importlib.util, pathlib, unittest
SCRIPT=pathlib.Path(__file__).parents[1]/"scripts"/"check_tool_deadlines.py"
spec=importlib.util.spec_from_file_location("guard",SCRIPT); guard=importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)
def path(name="single"): return {"name":name,"hard_timeout_seconds":60,"idle_timeout_seconds":10,"owns_cancellable_resource":True,"cancellation_supported":True,"timeout_disposition":"tool_timeout","max_timeout_retries":0,"non_idempotent":False,"retry_safety_approved":False}
class Tests(unittest.TestCase):
 def test_safe(self): self.assertEqual([],guard.validate({"required_path_names":["single"],"execution_paths":[path()]}))
 def test_missing_deadline(self): p=path();p["hard_timeout_seconds"]=None;self.assertTrue(guard.validate({"execution_paths":[p]}))
 def test_missing_path(self): self.assertTrue(guard.validate({"required_path_names":["single","parallel"],"execution_paths":[path()]}))
 def test_cleanup_required(self): p=path();p["cancellation_supported"]=False;self.assertTrue(guard.validate({"execution_paths":[p]}))
 def test_non_idempotent_retry_blocked(self): p=path();p["non_idempotent"]=True;p["max_timeout_retries"]=1;self.assertTrue(guard.validate({"execution_paths":[p]}))
if __name__=="__main__": unittest.main()

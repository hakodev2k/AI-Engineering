import importlib.util, pathlib, unittest
SCRIPT=pathlib.Path(__file__).parents[1]/"scripts"/"check_delegation_env.py"
spec=importlib.util.spec_from_file_location("guard",SCRIPT); guard=importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)
def base(): return {"inheritance_mode":"allowlist","child_can_read_parent_process_environment":False,"parent_env_names":["PATH","LANG","GITHUB_TOKEN"],"child_requested_env_names":["PATH","GITHUB_TOKEN"],"child_allowed_env_names":["PATH"],"brokered_sensitive_env_names":["GITHUB_TOKEN"],"approved_readable_sensitive_env_names":[],"sensitive_name_patterns":[]}
class Tests(unittest.TestCase):
 def test_safe(self): self.assertEqual([],guard.validate(base()))
 def test_full_blocks(self): p=base();p["inheritance_mode"]="full";self.assertTrue(guard.validate(p))
 def test_direct_blocks(self): p=base();p["child_can_read_parent_process_environment"]=True;self.assertTrue(guard.validate(p))
 def test_secret_blocks(self): p=base();p["child_allowed_env_names"].append("GITHUB_TOKEN");p["brokered_sensitive_env_names"]=[];self.assertTrue(guard.validate(p))
 def test_unrequested_blocks(self): p=base();p["child_allowed_env_names"].append("LANG");self.assertTrue(guard.validate(p))
if __name__=="__main__": unittest.main()

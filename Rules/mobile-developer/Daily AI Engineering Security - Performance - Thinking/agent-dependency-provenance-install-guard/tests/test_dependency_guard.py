import unittest
from unittest.mock import patch
import importlib.util, pathlib
P=pathlib.Path(__file__).parents[1]/'scripts'/'dependency_guard.py'
s=importlib.util.spec_from_file_location('guard',P); g=importlib.util.module_from_spec(s); s.loader.exec_module(g)
POL={'require_exact_version':True,'minimum_package_age_hours':72,'allowed_ecosystems':['npm','pypi'],'allow_git_sources':False,'allow_remote_archives':False,'allow_local_paths':False,'block_deprecated_npm':True,'block_yanked_pypi':True,'require_repository_url_for_unapproved':True,'require_human_approval_for_fresh_packages':True,'approved_packages':{'npm':[],'pypi':[]},'blocked_packages':{'npm':['evil'],'pypi':[]},'network_timeout_seconds':1,'max_registry_response_bytes':100000,'audit_log':'x'}
class T(unittest.TestCase):
 def test_non_registry_denied(self): self.assertEqual(g.decide('npm','git+https://x/y',POL)['decision'],'deny')
 def test_unpinned_review(self): self.assertEqual(g.decide('npm','left-pad',POL)['decision'],'review')
 def test_blocked_denied(self): self.assertEqual(g.decide('npm','evil@1.0.0',POL)['decision'],'deny')
 @patch.object(g,'inspect_npm')
 def test_fresh_requires_review(self,m):
  m.return_value={'name':'x','version':'1','age_hours':2,'repository':'https://x','deprecated':False,'integrity':'sha512-x'}
  self.assertEqual(g.decide('npm','x@1',POL)['decision'],'review')
 @patch.object(g,'inspect_npm')
 def test_old_valid_allowed(self,m):
  m.return_value={'name':'x','version':'1','age_hours':100,'repository':'https://x','deprecated':False,'integrity':'sha512-x'}
  self.assertEqual(g.decide('npm','x@1',POL)['decision'],'allow')
 @patch.object(g,'inspect_pypi')
 def test_yanked_denied(self,m):
  m.return_value={'name':'x','version':'1','age_hours':100,'repository':'https://x','yanked':True,'sha256':['a']}
  self.assertEqual(g.decide('pypi','x==1',POL)['decision'],'deny')
if __name__=='__main__': unittest.main()

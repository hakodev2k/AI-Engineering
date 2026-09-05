import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/'scripts'/'scope_gate.py'; s=importlib.util.spec_from_file_location('g',P); g=importlib.util.module_from_spec(s); s.loader.exec_module(g)
POL={'destructive_operations':['delete'],'human_required':['delete']}
BASE={'operation':'delete','targets':['a'],'target_fingerprints':{'a':'h'},'approved_by_type':'human','expires_at':200,'nonce':'12345678'}
class T(unittest.TestCase):
 def test_pass(self): self.assertEqual([],g.validate(POL,BASE,{'operation':'delete','targets':['a'],'target_fingerprints':{'a':'h'}},100))
 def test_broadened_target_blocks(self): self.assertTrue(g.validate(POL,BASE,{'operation':'delete','targets':['a','b'],'target_fingerprints':{'a':'h','b':'x'}},100))
 def test_stale_state_blocks(self): self.assertTrue(g.validate(POL,BASE,{'operation':'delete','targets':['a'],'target_fingerprints':{'a':'changed'}},100))
 def test_human_required(self):
  a=dict(BASE,approved_by_type='agent'); self.assertTrue(g.validate(POL,a,{'operation':'delete','targets':['a'],'target_fingerprints':{'a':'h'}},100))
if __name__=='__main__': unittest.main()

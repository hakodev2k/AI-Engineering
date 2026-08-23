import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/'scripts'/'annotation_guard.py'
s=importlib.util.spec_from_file_location('g',P);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
class Obj: pass
class T(unittest.TestCase):
 def test_wire_readonly(self): self.assertEqual(m.normalize({'annotations':{'readOnlyHint':True}})['risk'],'read-only-candidate')
 def test_sdk_snake_case(self):
  a=Obj();a.read_only_hint=True;t=Obj();t.annotations=a
  self.assertTrue(m.normalize(t)['annotations']['readOnlyHint'])
 def test_missing_fails_closed(self): self.assertEqual(m.normalize({})['risk'],'approval-required')
 def test_destructive(self): self.assertEqual(m.normalize({'annotations':{'destructiveHint':True}})['risk'],'approval-required')
 def test_contradiction(self): self.assertTrue(m.normalize({'annotations':{'readOnlyHint':True,'destructiveHint':True}})['warnings'])
 def test_type_validation(self):
  with self.assertRaises(ValueError): m.normalize({'annotations':{'readOnlyHint':'yes'}})
if __name__=='__main__':unittest.main()
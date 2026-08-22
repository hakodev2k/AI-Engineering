import importlib.util
import pathlib
import unittest

ROOT=pathlib.Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location('manifest_guard',ROOT/'scripts'/'manifest_guard.py')
MG=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(MG)
POLICY={'security_fields':['name','description','inputSchema','annotations'],'ignore_annotation_title':True}

class ManifestGuardTests(unittest.TestCase):
    def test_key_order_is_canonical(self):
        a=[{'name':'x','description':'d','inputSchema':{'type':'object','properties':{'a':{'type':'string'},'b':{'type':'number'}}}}]
        b=[{'inputSchema':{'properties':{'b':{'type':'number'},'a':{'type':'string'}},'type':'object'},'description':'d','name':'x'}]
        self.assertEqual(MG.digest(MG.canonical_tools(a,POLICY)),MG.digest(MG.canonical_tools(b,POLICY)))

    def test_description_drift_detected(self):
        a=MG.canonical_tools([{'name':'x','description':'read file'}],POLICY)
        b=MG.canonical_tools([{'name':'x','description':'read file and upload secrets'}],POLICY)
        changes=MG.diff(a,b)
        self.assertEqual(changes[0]['change'],'modified')
        self.assertIn('description',changes[0]['fields'])

    def test_add_remove_detected(self):
        a=MG.canonical_tools([{'name':'x'}],POLICY)
        b=MG.canonical_tools([{'name':'y'}],POLICY)
        kinds={c['change'] for c in MG.diff(a,b)}
        self.assertEqual(kinds,{'added','removed'})

if __name__=='__main__': unittest.main()

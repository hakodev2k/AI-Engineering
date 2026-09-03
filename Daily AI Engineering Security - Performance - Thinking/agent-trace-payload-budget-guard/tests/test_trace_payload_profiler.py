import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/'scripts'/'trace_payload_profiler.py'
s=importlib.util.spec_from_file_location('prof',P); m=importlib.util.module_from_spec(s); s.loader.exec_module(m)
B={'max_trace_bytes':1000,'max_span_bytes':500,'max_attribute_bytes':200}
class T(unittest.TestCase):
    def test_small_trace_ok(self):
        r=[{'name':'a','attributes':{'x':'abc'}},{'name':'b','attributes':{'y':'def'}}]
        self.assertEqual(m.analyze(r,B)['status'],'ok')
    def test_large_attribute_violates(self):
        r=[{'name':'a','attributes':{'payload':'x'*300}}]
        o=m.analyze(r,B)
        self.assertIn('max_attribute_bytes',o['violations'])
    def test_large_span_violates(self):
        r=[{'name':'a','attributes':{'a':'x'*180,'b':'y'*180,'c':'z'*180}}]
        self.assertIn('max_span_bytes',m.analyze(r,B)['violations'])
    def test_top_attribute_reported(self):
        r=[{'attributes':{'small':'x','big':'y'*50}}]
        self.assertEqual(m.analyze(r,B)['top_attributes'][0]['key'],'big')
if __name__=='__main__': unittest.main()

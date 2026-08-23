import importlib.util,pathlib,unittest
P=pathlib.Path(__file__).parents[1]/'scripts'/'profile_result_meta.py';s=importlib.util.spec_from_file_location('p',P);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
K='io.modelcontextprotocol/serverInfo'
def row(icon='data:image/png;base64,AAAA'):
 return {'result':{'content':[{'type':'text','text':'ok'}],'_meta':{K:{'name':'x','version':'1','icons':[{'src':icon}]}}}}
class T(unittest.TestCase):
 def test_counts_calls(self): self.assertEqual(m.analyze([row(),row()])['calls'],2)
 def test_repetition(self): self.assertGreater(m.analyze([row(),row()])['repeated_server_info_bytes'],0)
 def test_no_meta(self): self.assertEqual(m.analyze([{'result':{'content':[]}}])['meta_bytes'],0)
 def test_changed_not_all_repeated(self): self.assertEqual(m.analyze([row('a'),row('b')])['repeated_server_info_bytes'],0)
 def test_ratio(self): self.assertGreater(m.analyze([row()])['meta_ratio'],0)
if __name__=='__main__':unittest.main()
import importlib.util, json, pathlib, tempfile, unittest
P=pathlib.Path(__file__).parents[1]/'scripts'/'scan_trace_contamination.py'
s=importlib.util.spec_from_file_location('scan',P); m=importlib.util.module_from_spec(s); s.loader.exec_module(m)
class T(unittest.TestCase):
 def run_case(self,rows,policy):
  with tempfile.TemporaryDirectory() as d:
   t=pathlib.Path(d)/'t.jsonl'; p=pathlib.Path(d)/'p.json'
   t.write_text('\n'.join(json.dumps(x) for x in rows),encoding='utf-8'); p.write_text(json.dumps(policy),encoding='utf-8')
   return m.scan(t,m.load_policy(p))
 def test_clean(self): self.assertEqual(self.run_case([{'kind':'search','query':'python parser docs'}],{} )['status'],'clean')
 def test_task_id(self): self.assertEqual(self.run_case([{'kind':'search','query':'SWE-1234 patch'}],{'task_ids':['SWE-1234']})['status'],'contaminated')
 def test_url_pattern(self): self.assertEqual(self.run_case([{'kind':'browser','url':'https://x.test/gold/123'}],{'forbidden_url_regex':['/gold/']})['status'],'contaminated')
 def test_hash(self):
  import hashlib
  text='known answer'; h=hashlib.sha256(text.encode()).hexdigest()
  self.assertEqual(self.run_case([{'kind':'retrieve','text':text}],{'forbidden_hashes':[h]})['status'],'contaminated')
 def test_indeterminate(self): self.assertEqual(self.run_case([{'kind':'web','external':True}],{})['status'],'indeterminate')
if __name__=='__main__': unittest.main()

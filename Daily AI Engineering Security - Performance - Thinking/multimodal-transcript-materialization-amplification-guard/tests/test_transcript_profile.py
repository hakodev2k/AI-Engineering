import base64, importlib.util, json, pathlib, tempfile, unittest

P=pathlib.Path(__file__).parents[1]/'scripts'/'transcript_profile.py'
spec=importlib.util.spec_from_file_location('tp',P); tp=importlib.util.module_from_spec(spec); spec.loader.exec_module(tp)

class TestProfile(unittest.TestCase):
    def make_file(self,rows):
        f=tempfile.NamedTemporaryFile('w',encoding='utf-8',delete=False)
        for r in rows: f.write(json.dumps(r)+'\n')
        f.close(); return f.name
    def test_duplicate_base64(self):
        payload=base64.b64encode(b'x'*4096).decode(); path=self.make_file([{'a':payload},{'b':payload}])
        p=tp.profile(path,1024); self.assertGreater(p['duplicate_payload_ratio'],0); self.assertEqual(p['unique_large_payloads'],1)
    def test_text_only(self):
        p=tp.profile(self.make_file([{'message':'hello'}]),1024); self.assertEqual(p['base64_ratio'],0.0)
    def test_budget_violation(self):
        p=tp.profile(self.make_file([{'message':'x'*1000}]),1024)
        self.assertTrue(tp.evaluate(p,{'max_transcript_bytes':10,'materialization_multiplier':1}))

if __name__=='__main__': unittest.main()
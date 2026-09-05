import importlib.util, pathlib, tempfile, json, unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"quarantine_scan.py"
s=importlib.util.spec_from_file_location("q",P); q=importlib.util.module_from_spec(s); s.loader.exec_module(q)
class T(unittest.TestCase):
 def run_case(self,pol,man):
  with tempfile.TemporaryDirectory() as d:
   a=pathlib.Path(d)/"p.json"; b=pathlib.Path(d)/"m.json"
   a.write_text(json.dumps(pol)); b.write_text(json.dumps(man)); return q.main(["q",str(a),str(b)])
 def base(self): return {"name":"ok","version":"1","sha256":"a"*64,"publisher":"pub","scripts":{},"files":["index.js"]}
 def test_clean(self): self.assertEqual(0,self.run_case({"allowed_publishers":["pub"]},self.base()))
 def test_blocked(self):
  m=self.base(); self.assertEqual(2,self.run_case({"blocked_packages":[["ok","1"]]},m))
 def test_script(self):
  m=self.base(); m["scripts"]={"preinstall":"node x.js"}; self.assertEqual(2,self.run_case({},m))
 def test_native(self):
  m=self.base(); m["files"]=["binding.gyp"]; self.assertEqual(2,self.run_case({},m))
if __name__=="__main__": unittest.main()

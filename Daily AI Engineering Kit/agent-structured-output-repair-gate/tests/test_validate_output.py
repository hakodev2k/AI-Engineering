import json, pathlib, subprocess, sys, tempfile, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts'/'validate_output.py'

class ValidatorTests(unittest.TestCase):
    def run_case(self,value,schema):
        with tempfile.TemporaryDirectory() as d:
            d=pathlib.Path(d); inp=d/'in.json'; sch=d/'schema.json'
            inp.write_text(value,encoding='utf-8'); sch.write_text(json.dumps(schema),encoding='utf-8')
            return subprocess.run([sys.executable,str(SCRIPT),'--input',str(inp),'--schema',str(sch)],capture_output=True,text=True)
    def test_valid(self):
        r=self.run_case('{"name":"ok"}',{"type":"object","required":["name"],"additionalProperties":False,"properties":{"name":{"type":"string"}}})
        self.assertEqual(r.returncode,0,r.stderr+r.stdout)
    def test_markdown_fence_rejected(self):
        r=self.run_case('```json\n{"name":"ok"}\n```',{"type":"object"})
        self.assertEqual(r.returncode,1)
    def test_schema_failure(self):
        r=self.run_case('{"name":3}',{"type":"object","properties":{"name":{"type":"string"}}})
        self.assertEqual(r.returncode,1)
    def test_sensitive_field_rejected(self):
        r=self.run_case('{"api_token":"x"}',{"type":"object"})
        self.assertEqual(r.returncode,1)
if __name__=='__main__': unittest.main()

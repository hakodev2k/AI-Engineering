import importlib.util, unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
S=importlib.util.spec_from_file_location("v",R/"scripts/validate_output.py"); V=importlib.util.module_from_spec(S); S.loader.exec_module(V)
class Tests(unittest.TestCase):
    def schema(self): return {"type":"object","additionalProperties":False,"required":["status"],"properties":{"status":{"type":"string","enum":["ok"]},"confidence":{"type":"number","minimum":0,"maximum":1}}}
    def test_valid(self): self.assertEqual([],V.validate({"status":"ok","confidence":0.5},self.schema()))
    def test_missing_required(self): self.assertTrue(any(x["code"]=="required" for x in V.validate({},self.schema())))
    def test_additional_property(self): self.assertTrue(any(x["code"]=="additionalProperties" for x in V.validate({"status":"ok","x":1},self.schema())))
    def test_enum(self): self.assertTrue(any(x["code"]=="enum" for x in V.validate({"status":"bad"},self.schema())))
    def test_bounds(self): self.assertTrue(any(x["code"]=="maximum" for x in V.validate({"status":"ok","confidence":2},self.schema())))
if __name__=="__main__": unittest.main()

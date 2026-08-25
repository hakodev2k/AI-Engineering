import json,tempfile,unittest
from pathlib import Path
import scripts.cache_boundary as cb

BASE={"runtime_version":"2.1.228","model":"claude-sonnet-5","effort":"medium","system_prompt_hash":"a","tool_schema_hash":"b","hook_context_hash":"c","policy_hash":"d","timestamp":"volatile"}
class Tests(unittest.TestCase):
 def test_identical(self):
  self.assertEqual(cb.compare(BASE,dict(BASE)),[])
  self.assertEqual(cb.fingerprint(BASE),cb.fingerprint(dict(BASE,timestamp="later")))
 def test_runtime_drift(self): self.assertEqual(cb.compare(BASE,dict(BASE,runtime_version="2.1.229")),["runtime_version"])
 def test_hook_drift(self): self.assertIn("hook_context_hash",cb.compare(BASE,dict(BASE,hook_context_hash="x")))
 def test_missing_rejected(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/"m.json"; p.write_text(json.dumps({"model":"x"}))
   with self.assertRaises(ValueError): cb.load(p)
if __name__=="__main__": unittest.main()

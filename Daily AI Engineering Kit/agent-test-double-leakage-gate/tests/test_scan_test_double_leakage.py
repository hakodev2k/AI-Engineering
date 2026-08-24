from __future__ import annotations
import importlib.util,json,tempfile,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location('scanner',ROOT/'scripts/scan_test_double_leakage.py'); assert SPEC and SPEC.loader
S=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(S)
P=S.validate(json.loads((ROOT/'config/leakage-policy.json').read_text(encoding='utf-8')))
class Tests(unittest.TestCase):
 def scan(self,fs):
  with tempfile.TemporaryDirectory() as t:
   root=Path(t)
   for rel,content in fs.items():
    f=root/rel; f.parent.mkdir(parents=True,exist_ok=True); f.write_text(content,encoding='utf-8')
   return S.report(root,P)
 def test_clean(self): self.assertEqual('clean',self.scan({'src/pay.py':'client=RealClient()\n'})['status'])
 def test_fake_blocks(self): self.assertEqual('blocked',self.scan({'src/pay.py':'client=FakePaymentClient()\n'})['status'])
 def test_tests_excluded(self): self.assertEqual(0,self.scan({'tests/pay.py':'client=FakePaymentClient()\n'})['scanned_files'])
 def test_loopback_blocks(self): self.assertEqual('blocked',self.scan({'config/x.json':'{"url":"http://localhost:8080"}\n'})['status'])
 def test_import_blocks(self): self.assertEqual('blocked',self.scan({'src/x.py':'from project/tests/fakes/client import FakeClient\n'})['status'])
 def test_narrow_exception(self):
  r=self.scan({'src/domain/mock-data-contract.py':'class ProductionContract: pass\n'}); m=[x for x in r['findings'] if x['rule_id']=='test-double-filename']; self.assertEqual(1,len(m)); self.assertTrue(m[0]['excepted']); self.assertEqual('clean',r['status'])
if __name__=='__main__': unittest.main()
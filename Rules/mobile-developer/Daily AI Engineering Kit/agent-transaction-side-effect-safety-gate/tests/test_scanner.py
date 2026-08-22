import json,subprocess,sys,tempfile,unittest
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/'scripts'/'scan_transaction_side_effects.py'
POLICY=Path(__file__).parents[1]/'config'/'policy.json'

class ScannerTests(unittest.TestCase):
 def run_scan(self,code):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d);(root/'Sample.cs').write_text(code,encoding='utf-8');out=root/'out.json'
   p=subprocess.run([sys.executable,str(SCRIPT),'--root',str(root),'--policy',str(POLICY),'--output',str(out)],capture_output=True,text=True)
   return p.returncode,json.loads(out.read_text(encoding='utf-8'))
 def test_flags_external_call_near_transaction(self):
  rc,r=self.run_scan('using var tx = db.Database.BeginTransaction();\nawait client.SendAsync(request);\n')
  self.assertEqual(2,rc);self.assertEqual('high',r['findings'][0]['severity'])
 def test_clean_file_passes(self):
  rc,r=self.run_scan('await db.SaveChangesAsync();\nreturn 0;\n')
  self.assertEqual(0,rc);self.assertEqual([],r['findings'])
 def test_outbox_nearby_requires_review_not_high(self):
  rc,r=self.run_scan('using var tx = db.Database.BeginTransaction();\nAddOutboxMessage(evt);\nawait sender.SendAsync(request);\n')
  self.assertEqual(0,rc);self.assertEqual('review',r['findings'][0]['severity'])

if __name__=='__main__':unittest.main()
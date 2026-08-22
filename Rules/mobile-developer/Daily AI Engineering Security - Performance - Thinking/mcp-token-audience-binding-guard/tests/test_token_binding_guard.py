#!/usr/bin/env python3
import json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];SCRIPT=ROOT/'scripts'/'token_binding_guard.py';POLICY=ROOT/'config'/'policy.json'
class GuardTests(unittest.TestCase):
 def run_case(self,d):
  with tempfile.TemporaryDirectory() as td:
   p=Path(td)/'in.json';p.write_text(json.dumps(d),encoding='utf-8');cp=subprocess.run([sys.executable,str(SCRIPT),str(p),'--policy',str(POLICY)],capture_output=True,text=True);return cp,json.loads(cp.stdout) if cp.stdout.strip() else None
 def base(self):return {'issuer':'https://issuer.example.internal','audiences':['https://mcp.example.internal'],'active':True,'scopes':['mcp.read'],'operation':'read','passthrough_requested':False}
 def test_valid_allows(self):
  cp,r=self.run_case(self.base());self.assertEqual(cp.returncode,0);self.assertEqual(r['decision'],'allow')
 def test_wrong_audience_denies(self):
  d=self.base();d['audiences']=['https://other'];cp,_=self.run_case(d);self.assertEqual(cp.returncode,5)
 def test_missing_active_denies(self):
  d=self.base();d.pop('active');cp,_=self.run_case(d);self.assertEqual(cp.returncode,5)
 def test_passthrough_denies(self):
  d=self.base();d['passthrough_requested']=True;cp,_=self.run_case(d);self.assertEqual(cp.returncode,5)
 def test_raw_token_field_denies_without_echo(self):
  d=self.base();d['access_token']='secret-value';cp,r=self.run_case(d);self.assertEqual(cp.returncode,5);self.assertNotIn('secret-value',json.dumps(r))
 def test_missing_scope_denies(self):
  d=self.base();d['operation']='write';cp,_=self.run_case(d);self.assertEqual(cp.returncode,5)
 def test_unknown_operation_denies(self):
  d=self.base();d['operation']='admin';d['scopes']=['mcp.read','mcp.write'];cp,_=self.run_case(d);self.assertEqual(cp.returncode,5)
if __name__=='__main__':unittest.main()

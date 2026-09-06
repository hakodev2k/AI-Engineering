#!/usr/bin/env python3
import json, subprocess, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts'/'validate_saga.py'

class ValidateSagaTests(unittest.TestCase):
    def run_plan(self, plan):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/'plan.json'; p.write_text(json.dumps(plan),encoding='utf-8')
            return subprocess.run(['python',str(SCRIPT),str(p),'--simulate'],text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)

    def test_valid_plan_passes(self):
        plan={'saga_id':'s1','status':'planned','steps':[{'id':'a','action':'do a','side_effect':True,'idempotency_key':'s1:a','compensation':'undo a','approval_required':False,'dependencies':[]}]}
        r=self.run_plan(plan); self.assertEqual(r.returncode,0,r.stderr); self.assertEqual(json.loads(r.stdout)['status'],'valid')

    def test_side_effect_requires_idempotency_and_compensation(self):
        plan={'saga_id':'s1','status':'planned','steps':[{'id':'a','action':'do a','side_effect':True,'idempotency_key':None,'compensation':None,'approval_required':False,'dependencies':[]}]}
        r=self.run_plan(plan); self.assertEqual(r.returncode,2); self.assertGreaterEqual(len(json.loads(r.stdout)['errors']),2)

    def test_unknown_dependency_blocks(self):
        plan={'saga_id':'s1','status':'planned','steps':[{'id':'a','action':'do a','side_effect':False,'idempotency_key':None,'compensation':None,'approval_required':False,'dependencies':['missing']}]}
        r=self.run_plan(plan); self.assertEqual(r.returncode,2); self.assertIn('unknown dependency',r.stdout)

if __name__=='__main__': unittest.main()

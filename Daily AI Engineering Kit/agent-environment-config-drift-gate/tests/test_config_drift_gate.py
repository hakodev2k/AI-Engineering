import json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts/config_drift_gate.py'; POLICY=ROOT/'config/policy.yaml'

def run(baseline,current,env='staging'):
    with tempfile.TemporaryDirectory() as d:
        b=Path(d)/'baseline.json'; c=Path(d)/'current.json'; o=Path(d)/'result.json'
        b.write_text(json.dumps(baseline),encoding='utf-8'); c.write_text(json.dumps(current),encoding='utf-8')
        p=subprocess.run([sys.executable,str(SCRIPT),'--baseline',str(b),'--current',str(c),'--policy',str(POLICY),'--environment',env,'--output',str(o)],capture_output=True,text=True)
        return p.returncode,json.loads(p.stdout),json.loads(o.read_text(encoding='utf-8'))

class DriftGateTests(unittest.TestCase):
    def test_identical_passes(self):
        cfg={'environment':'staging','auth':{'require_https':True}}
        code,r,_=run(cfg,cfg)
        self.assertEqual(code,0); self.assertEqual(r['status'],'passed'); self.assertFalse(r['modified'])

    def test_feature_flag_requires_approval(self):
        base={'environment':'staging','feature_flags':{'new_checkout':False}}
        cur={'environment':'staging','feature_flags':{'new_checkout':True}}
        code,r,_=run(base,cur)
        self.assertEqual(code,4); self.assertEqual(r['status'],'approval_required')
        self.assertTrue(any(x['key']=='feature_flags.new_checkout' for x in r['approvals']))

    def test_security_weakening_blocks(self):
        base={'environment':'staging','auth':{'require_https':True}}
        cur={'environment':'staging','auth':{'require_https':False}}
        code,r,_=run(base,cur)
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='BLOCKED_SECURITY_WEAKENING' for x in r['findings']))

    def test_protected_production_drift_blocks(self):
        base={'environment':'production','database':{'provider':'postgresql'}}
        cur={'environment':'production','database':{'provider':'sqlserver'}}
        code,r,_=run(base,cur,'production')
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='PROTECTED_PRODUCTION_DRIFT' for x in r['findings']))

    def test_sensitive_value_is_redacted(self):
        base={'database':{'connection_string':'secret-one'}}
        cur={'database':{'connection_string':'secret-two'}}
        _,r,_=run(base,cur)
        text=json.dumps(r)
        self.assertNotIn('secret-one',text); self.assertNotIn('secret-two',text); self.assertIn('<redacted>',text)

    def test_ignored_runtime_key_does_not_create_drift(self):
        base={'build':{'timestamp':'one'}}; cur={'build':{'timestamp':'two'}}
        code,r,_=run(base,cur)
        self.assertEqual(code,0); self.assertEqual(r['counts'],{'changed':0,'added':0,'removed':0})

if __name__=='__main__': unittest.main()

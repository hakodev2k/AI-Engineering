import json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts/license_gate.py'; POLICY=ROOT/'config/license-policy.yaml'

def run(sbom):
    with tempfile.TemporaryDirectory() as d:
        p=Path(d)/'sbom.json'; p.write_text(json.dumps(sbom),encoding='utf-8')
        r=subprocess.run([sys.executable,str(SCRIPT),'--sbom',str(p),'--policy',str(POLICY)],capture_output=True,text=True)
        return r.returncode,json.loads(r.stdout)

def component(name='x',version='1.0.0',license_id='MIT',purl='pkg:generic/x@1.0.0'):
    c={'type':'library','name':name,'version':version,'purl':purl}
    if license_id is not None: c['licenses']=[{'license':{'id':license_id}}]
    return c

class GateTests(unittest.TestCase):
    def test_allowed_license_passes(self):
        code,r=run({'components':[component()]})
        self.assertEqual(code,0); self.assertEqual(r['status'],'passed'); self.assertFalse(r['changed_dependencies'])
    def test_blocked_license_blocks(self):
        code,r=run({'components':[component(license_id='GPL-3.0-only')]})
        self.assertEqual(code,2); self.assertEqual(r['status'],'blocked')
        self.assertTrue(any(x['code']=='LICENSE_BLOCKED' for x in r['findings']))
    def test_missing_license_blocks(self):
        code,r=run({'components':[component(license_id=None)]})
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='MISSING_LICENSE' for x in r['findings']))
    def test_unknown_license_requires_approval(self):
        code,r=run({'components':[component(license_id='LicenseRef-Custom')]})
        self.assertEqual(code,4); self.assertEqual(r['status'],'approval_required')
    def test_missing_version_blocks(self):
        c=component(); c.pop('version')
        code,r=run({'components':[c]})
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='MISSING_VERSION' for x in r['findings']))
    def test_multiple_licenses_any_allowed(self):
        c=component(); c['licenses']=[{'license':{'id':'MIT'}},{'license':{'id':'GPL-3.0-only'}}]
        code,r=run({'components':[c]})
        self.assertEqual(code,0); self.assertEqual(r['status'],'passed')
if __name__=='__main__': unittest.main()

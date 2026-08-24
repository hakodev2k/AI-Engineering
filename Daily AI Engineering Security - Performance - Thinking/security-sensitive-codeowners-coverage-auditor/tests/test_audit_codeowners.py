import json, subprocess, sys, tempfile, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'audit_codeowners.py'

class AuditTests(unittest.TestCase):
    def run_case(self, codeowners, manifest, files):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)
            for f in files:
                p=root/f; p.parent.mkdir(parents=True,exist_ok=True); p.write_text('x',encoding='utf-8')
            co=root/'CODEOWNERS'; co.write_text(codeowners,encoding='utf-8')
            mf=root/'manifest.json'; mf.write_text(json.dumps({'paths':manifest}),encoding='utf-8')
            return subprocess.run([sys.executable,str(SCRIPT),'--repo',str(root),'--codeowners',str(co),'--manifest',str(mf)],capture_output=True,text=True)
    def test_specialist_coverage_passes(self):
        r=self.run_case('* @all\n/src/auth/ @sec\n',[{'path':'src/auth/a.ts','required_owners':['@sec']}],['src/auth/a.ts'])
        self.assertEqual(r.returncode,0,r.stdout+r.stderr)
    def test_catchall_does_not_replace_specialist(self):
        r=self.run_case('/old/auth/ @sec\n* @all\n',[{'path':'src/auth/a.ts','required_owners':['@sec']}],['src/auth/a.ts'])
        self.assertEqual(r.returncode,2); self.assertIn('@sec',r.stdout)
    def test_missing_manifest_path_fails(self):
        r=self.run_case('* @all\n',[{'path':'src/auth/missing.ts','required_owners':['@all']}],[])
        self.assertEqual(r.returncode,2)

if __name__=='__main__': unittest.main()

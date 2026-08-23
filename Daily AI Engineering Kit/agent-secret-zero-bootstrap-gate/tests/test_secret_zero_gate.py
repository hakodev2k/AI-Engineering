import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/'scripts'/'secret_zero_gate.py'
POLICY=Path(__file__).parents[1]/'config'/'policy.json'
class GateTests(unittest.TestCase):
    def run_gate(self, files, env='production'):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)
            for name,content in files.items():
                p=root/name; p.parent.mkdir(parents=True,exist_ok=True); p.write_text(content,encoding='utf-8')
            r=subprocess.run([sys.executable,str(SCRIPT),'--root',str(root),'--policy',str(POLICY),'--environment',env],capture_output=True,text=True)
            return r.returncode,json.loads(r.stdout)
    def test_clean_identity_configuration_passes(self):
        code,data=self.run_gate({'app.json':'{"credential":"managed-identity"}'})
        self.assertEqual(0,code); self.assertEqual('pass',data['status'])
    def test_static_secret_blocks_and_value_is_redacted(self):
        code,data=self.run_gate({'appsettings.json':'client_secret=super-sensitive-value'})
        self.assertEqual(2,code); self.assertEqual('blocked',data['status']); self.assertNotIn('super-sensitive-value',json.dumps(data))
    def test_credential_file_blocks(self):
        code,data=self.run_gate({'.env':'SAFE_EXAMPLE=true'})
        self.assertEqual(2,code); self.assertTrue(any(x['rule']=='forbidden_credential_file' for x in data['findings']))
if __name__=='__main__': unittest.main()

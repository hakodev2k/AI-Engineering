import json, pathlib, subprocess, sys, tempfile, unittest

SCRIPT=pathlib.Path(__file__).parents[1]/'scripts'/'config_drift_gate.py'

class GateTests(unittest.TestCase):
    def run_gate(self,root,policy,*args):
        return subprocess.run([sys.executable,str(SCRIPT),'--root',str(root),'--policy',str(policy),'--report',str(root/'report.json'),*args],capture_output=True,text=True)

    def test_removed_key_blocks(self):
        with tempfile.TemporaryDirectory() as d:
            root=pathlib.Path(d); (root/'app.json').write_text('{"a":1,"b":"x"}')
            policy=root/'policy.json'; policy.write_text(json.dumps({'allowed_config_globs':['*.json'],'baseline_dir':'.ai-config-baseline','forbidden_key_patterns':[],'max_removed_keys':0}))
            r=self.run_gate(root,policy,'--write-baseline'); self.assertEqual(r.returncode,0,r.stderr)
            (root/'app.json').write_text('{"a":1}')
            r=self.run_gate(root,policy); self.assertEqual(r.returncode,2); self.assertIn('removed-keys',r.stdout)

    def test_type_change_blocks(self):
        with tempfile.TemporaryDirectory() as d:
            root=pathlib.Path(d); (root/'app.json').write_text('{"a":1}')
            policy=root/'policy.json'; policy.write_text(json.dumps({'allowed_config_globs':['*.json'],'baseline_dir':'.ai-config-baseline','forbidden_key_patterns':[],'max_removed_keys':0}))
            self.assertEqual(self.run_gate(root,policy,'--write-baseline').returncode,0)
            (root/'app.json').write_text('{"a":"1"}')
            r=self.run_gate(root,policy); self.assertEqual(r.returncode,2); self.assertIn('type-changes',r.stdout)

if __name__=='__main__': unittest.main()

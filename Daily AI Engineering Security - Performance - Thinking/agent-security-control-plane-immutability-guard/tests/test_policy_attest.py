import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'policy_attest.py'

class PolicyAttestTests(unittest.TestCase):
    def run_script(self, root, cfg, state, record=False):
        cmd = [sys.executable, str(SCRIPT), '--root', str(root), '--config', str(cfg), '--state', str(state)]
        if record:
            cmd.append('--record')
        return subprocess.run(cmd, text=True, capture_output=True)

    def make_env(self, required=True):
        td = tempfile.TemporaryDirectory()
        root = Path(td.name) / 'repo'; root.mkdir()
        protected = root / '.agent-policy.json'; protected.write_text('{"sandbox":true}\n', encoding='utf-8')
        cfg = Path(td.name) / 'policy.json'
        cfg.write_text(json.dumps({'protected_files':[{'path':'.agent-policy.json','required':required}]}), encoding='utf-8')
        state = Path(td.name) / 'baseline.json'
        return td, root, protected, cfg, state

    def test_unchanged_policy_verifies(self):
        td, root, protected, cfg, state = self.make_env()
        with td:
            self.assertEqual(self.run_script(root,cfg,state,True).returncode, 0)
            p = self.run_script(root,cfg,state)
            self.assertEqual(p.returncode, 0)
            self.assertEqual(json.loads(p.stdout)['status'], 'verified')

    def test_modified_policy_blocks(self):
        td, root, protected, cfg, state = self.make_env()
        with td:
            self.assertEqual(self.run_script(root,cfg,state,True).returncode, 0)
            protected.write_text('{"sandbox":false}\n', encoding='utf-8')
            p = self.run_script(root,cfg,state)
            self.assertEqual(p.returncode, 2)
            self.assertEqual(json.loads(p.stdout)['findings'][0]['reason'], 'hash-changed')

    def test_missing_required_policy_blocks(self):
        td, root, protected, cfg, state = self.make_env()
        with td:
            self.assertEqual(self.run_script(root,cfg,state,True).returncode, 0)
            protected.unlink()
            p = self.run_script(root,cfg,state)
            self.assertEqual(p.returncode, 2)
            self.assertEqual(json.loads(p.stdout)['findings'][0]['reason'], 'required-file-missing')

if __name__ == '__main__':
    unittest.main()

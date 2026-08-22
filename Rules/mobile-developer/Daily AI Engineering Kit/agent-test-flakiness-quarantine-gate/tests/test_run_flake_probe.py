import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts/run_flake_probe.py'

class ProbeTests(unittest.TestCase):
    def invoke(self, command, runs=2):
        with tempfile.TemporaryDirectory() as d:
            d=Path(d)
            cfg=d/'cfg.json'
            cfg.write_text(json.dumps({
                'max_probe_runs': 5,
                'allowed_test_commands': [sys.executable],
                'evidence_directory': str(d/'evidence'),
                'quarantine_requires_approval': True
            }), encoding='utf-8')
            p=subprocess.run([sys.executable,str(SCRIPT),'--test-id','sample','--command',command,'--config',str(cfg),'--runs',str(runs),'--out-dir',str(d/'out')],capture_output=True,text=True)
            return p, json.loads(p.stdout) if p.stdout.strip().startswith('{') else None

    def test_consistent_pass(self):
        command=f'"{sys.executable}" -c "import sys; sys.exit(0)"'
        p,result=self.invoke(command)
        self.assertEqual(p.returncode,0)
        self.assertEqual(result['status'],'passed')
        self.assertEqual(result['passes'],2)

    def test_consistent_failure(self):
        command=f'"{sys.executable}" -c "import sys; sys.exit(1)"'
        p,result=self.invoke(command)
        self.assertEqual(p.returncode,2)
        self.assertEqual(result['status'],'consistent-failure')
        self.assertEqual(result['failures'],2)

    def test_disallowed_command_is_rejected(self):
        p,result=self.invoke('echo not-allowed')
        self.assertEqual(p.returncode,4)
        self.assertIsNone(result)

    def test_run_bound_is_enforced(self):
        with tempfile.TemporaryDirectory() as d:
            d=Path(d); cfg=d/'cfg.json'
            cfg.write_text(json.dumps({'max_probe_runs':1,'allowed_test_commands':[sys.executable],'evidence_directory':str(d/'e')}),encoding='utf-8')
            command=f'"{sys.executable}" -c "import sys; sys.exit(0)"'
            p=subprocess.run([sys.executable,str(SCRIPT),'--test-id','x','--command',command,'--config',str(cfg),'--runs','2'],capture_output=True,text=True)
            self.assertEqual(p.returncode,4)

if __name__=='__main__': unittest.main()

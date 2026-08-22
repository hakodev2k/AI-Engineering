import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / 'scripts' / 'policy_shadow_gate.py'

class PolicyShadowGateTests(unittest.TestCase):
    def run_gate(self, policies):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / 'policies.json'
            p.write_text(json.dumps({'policies': policies}), encoding='utf-8')
            r = subprocess.run([sys.executable, str(SCRIPT), str(p)], capture_output=True, text=True)
            return r.returncode, json.loads(r.stdout or r.stderr)

    def test_blocks_conflicting_shadow(self):
        code, out = self.run_gate([
            {'id':'allow-all','priority':10,'effect':'allow','actions':['*'],'resources':['*'],'principals':['*']},
            {'id':'deny-delete','priority':20,'effect':'deny','actions':['delete'],'resources':['invoice'],'principals':['user']}
        ])
        self.assertEqual(1, code)
        self.assertEqual('blocked', out['status'])
        self.assertEqual('shadowed-deny', out['findings'][0]['type'])

    def test_passes_non_overlapping_rules(self):
        code, out = self.run_gate([
            {'id':'allow-read','priority':10,'effect':'allow','actions':['read'],'resources':['invoice']},
            {'id':'deny-delete','priority':20,'effect':'deny','actions':['delete'],'resources':['invoice']}
        ])
        self.assertEqual(0, code)
        self.assertEqual('pass', out['status'])

    def test_redundant_shadow_is_nonblocking(self):
        code, out = self.run_gate([
            {'id':'allow-all-read','priority':10,'effect':'allow','actions':['read'],'resources':['*']},
            {'id':'allow-invoice-read','priority':20,'effect':'allow','actions':['read'],'resources':['invoice']}
        ])
        self.assertEqual(0, code)
        self.assertEqual('redundant-shadow', out['findings'][0]['type'])

if __name__ == '__main__':
    unittest.main()

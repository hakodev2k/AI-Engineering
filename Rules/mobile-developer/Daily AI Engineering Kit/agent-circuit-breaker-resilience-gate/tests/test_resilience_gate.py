import json, subprocess, sys, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts/resilience_gate.py'; POLICY=ROOT/'config/policy.yaml'

def run(*args):
    p=subprocess.run([sys.executable,str(SCRIPT),'--policy',str(POLICY),*args],capture_output=True,text=True)
    return p.returncode,json.loads(p.stdout)

class GateTests(unittest.TestCase):
    def test_retryable_503_retries_once(self):
        code,r=run('--attempt','1','--idempotent','true','--status','503')
        self.assertEqual(code,0); self.assertEqual(r['action'],'retry'); self.assertGreaterEqual(r['retry_delay_seconds'],0)
    def test_attempt_budget_stops(self):
        code,r=run('--attempt','2','--idempotent','true','--status','503')
        self.assertEqual(code,2); self.assertEqual(r['reason'],'attempt-budget-exhausted')
    def test_non_idempotent_retry_requires_approval(self):
        code,r=run('--attempt','1','--idempotent','false','--status','503')
        self.assertEqual(code,4); self.assertEqual(r['action'],'approval'); self.assertTrue(r['approval_required'])
    def test_auth_failure_stops(self):
        code,r=run('--attempt','1','--idempotent','true','--status','401')
        self.assertEqual(code,2); self.assertEqual(r['action'],'stop')
    def test_open_circuit_stops(self):
        code,r=run('--attempt','1','--idempotent','true','--status','503','--circuit-state','open')
        self.assertEqual(code,2); self.assertEqual(r['reason'],'circuit-open')
    def test_retry_after_is_capped(self):
        code,r=run('--attempt','1','--idempotent','true','--status','429','--retry-after','600')
        self.assertEqual(code,0); self.assertLessEqual(r['retry_delay_seconds'],60)
if __name__=='__main__': unittest.main()

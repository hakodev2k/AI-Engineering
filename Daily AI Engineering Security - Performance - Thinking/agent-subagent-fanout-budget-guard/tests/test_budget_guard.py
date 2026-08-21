import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts'/'budget_guard.py'
POLICY=ROOT/'config'/'budget-policy.json'

class GuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(); self.ledger=Path(self.tmp.name)/'ledger.json'
        self.run('init','--policy',str(POLICY),'--root','r1','--ledger',str(self.ledger),expect=0)
    def tearDown(self): self.tmp.cleanup()
    def run(self,*args,expect=None):
        p=subprocess.run([sys.executable,str(SCRIPT),*args],capture_output=True,text=True)
        if expect is not None: self.assertEqual(p.returncode,expect,(p.stdout,p.stderr))
        return p
    def reserve(self,req,child,parent='root',tokens=10000,tools=10,delegate=False,expect=0):
        args=['reserve','--policy',str(POLICY),'--ledger',str(self.ledger),'--root','r1','--parent',parent,'--request-id',req,'--child',child,'--tokens',str(tokens),'--tool-calls',str(tools)]
        if delegate: args.append('--can-delegate')
        return self.run(*args,expect=expect)
    def test_idempotent_spawn_request_does_not_duplicate(self):
        a=self.reserve('q1','a'); b=self.reserve('q1','a')
        self.assertIn('idempotent_replay',b.stdout)
        data=json.loads(self.ledger.read_text()); self.assertEqual(len(data['reservations']),1)
    def test_concurrency_limit_denies_fifth_active_child(self):
        for i in range(4): self.reserve(f'q{i}',f'a{i}')
        self.reserve('q5','a5',expect=4)
    def test_depth_limit_blocks_grandchild_when_parent_not_delegable(self):
        p=self.reserve('q1','a',delegate=False); self.reserve('q2','b',parent='a',expect=4)
    def test_recursive_budget_depth_is_bounded(self):
        p=self.reserve('q1','a',delegate=True)
        self.reserve('q2','b',parent='a',delegate=True)
        self.reserve('q3','c',parent='b',expect=4)
    def test_token_reservation_blocks_over_budget(self):
        self.reserve('q1','a',tokens=100000)
        self.reserve('q2','b',tokens=70000,expect=4)
    def test_reconcile_counts_actual_and_releases_slot(self):
        p=self.reserve('q1','a'); rid=json.loads(p.stdout)['reservation_id']
        self.run('reconcile','--ledger',str(self.ledger),'--reservation-id',rid,'--tokens-used','9000','--tool-calls-used','7','--status','completed',expect=0)
        data=json.loads(self.ledger.read_text()); self.assertEqual(data['actual']['tokens'],9000); self.assertEqual(data['actual']['descendants'],1)
    def test_finalize_fails_with_active_reservation(self):
        self.reserve('q1','a'); self.run('finalize','--policy',str(POLICY),'--ledger',str(self.ledger),expect=4)

if __name__=='__main__': unittest.main()
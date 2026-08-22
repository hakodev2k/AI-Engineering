#!/usr/bin/env python3
import json, subprocess, sys, tempfile, time, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts'/'compaction_guard.py'
POLICY=ROOT/'config'/'policy.json'

class CompactionGuardTests(unittest.TestCase):
    def run_ledger(self,events,now=1000):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'ledger.jsonl'; p.write_text('\n'.join(json.dumps(e) for e in events),encoding='utf-8')
            return subprocess.run([sys.executable,str(SCRIPT),'decide',str(p),'--policy',str(POLICY),'--context-limit','400000','--now',str(now)],capture_output=True,text=True)

    def test_first_attempt_allowed(self):
        r=self.run_ledger([]); self.assertEqual(r.returncode,0); self.assertEqual(json.loads(r.stdout)['decision'],'compact')

    def test_low_progress_enters_cooldown(self):
        r=self.run_ledger([{'timestamp':950,'fingerprint':'a','kind':'compaction','before_tokens':300000,'after_tokens':270000,'actual':True}])
        self.assertEqual(r.returncode,3); self.assertEqual(json.loads(r.stdout)['decision'],'cooldown')

    def test_attempt_limit_requires_manual_recovery(self):
        events=[{'timestamp':100,'fingerprint':'a','kind':'compaction','before_tokens':300000,'after_tokens':230000}, {'timestamp':200,'fingerprint':'a','kind':'compaction','before_tokens':290000,'after_tokens':220000}]
        r=self.run_ledger(events,now=1000); self.assertEqual(r.returncode,4); self.assertEqual(json.loads(r.stdout)['decision'],'manual_recovery')

    def test_target_utilization_allows_without_more_compaction(self):
        r=self.run_ledger([{'timestamp':100,'fingerprint':'a','kind':'compaction','before_tokens':350000,'after_tokens':200000}],now=1000)
        self.assertEqual(r.returncode,0); self.assertEqual(json.loads(r.stdout)['decision'],'allow')

    def test_rate_limit(self):
        events=[{'timestamp':700+i*10,'fingerprint':str(i),'kind':'compaction','before_tokens':300000,'after_tokens':200000} for i in range(3)]
        r=self.run_ledger(events,now=1000); self.assertEqual(r.returncode,3)

if __name__=='__main__': unittest.main()

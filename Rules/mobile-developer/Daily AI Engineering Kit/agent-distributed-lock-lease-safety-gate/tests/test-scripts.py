#!/usr/bin/env python3
import json, pathlib, subprocess, sys, tempfile, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]

class GateScripts(unittest.TestCase):
    def test_valid_evidence(self):
        data={"status":"pass","findings":[],"verification":{"contention":True,"expiry":True,"stale_owner":True},"open_questions":[]}
        with tempfile.NamedTemporaryFile('w',suffix='.json',delete=False) as f:
            json.dump(data,f); name=f.name
        r=subprocess.run([sys.executable,str(ROOT/'scripts/verify-evidence.py'),name],capture_output=True,text=True)
        self.assertEqual(r.returncode,0,r.stderr)

    def test_pass_requires_all_checks(self):
        data={"status":"pass","findings":[],"verification":{"contention":True,"expiry":False,"stale_owner":True}}
        with tempfile.NamedTemporaryFile('w',suffix='.json',delete=False) as f:
            json.dump(data,f); name=f.name
        r=subprocess.run([sys.executable,str(ROOT/'scripts/verify-evidence.py'),name],capture_output=True,text=True)
        self.assertNotEqual(r.returncode,0)

    def test_scanner_flags_missing_owner(self):
        with tempfile.TemporaryDirectory() as d:
            pathlib.Path(d,'worker.cs').write_text('await distributedLock.AcquireLock(); await Work(); ReleaseLock();',encoding='utf-8')
            r=subprocess.run([sys.executable,str(ROOT/'scripts/scan-locks.py'),d,'--json'],capture_output=True,text=True)
            result=json.loads(r.stdout)
            self.assertTrue(any(x['code']=='missing-owner-or-fencing-token' for x in result['findings']))
            self.assertEqual(r.returncode,2)

if __name__=='__main__': unittest.main()

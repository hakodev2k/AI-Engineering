#!/usr/bin/env python3
import json, subprocess, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CHECK=ROOT/'scripts'/'outbox_check.py'
SIM=ROOT/'scripts'/'simulate_delivery.py'
POLICY=ROOT/'config'/'outbox-policy.json'

class OutboxTests(unittest.TestCase):
    def test_simulation_all_pass(self):
        with tempfile.TemporaryDirectory() as td:
            out=Path(td)/'sim.json'; p=subprocess.run(['python',str(SIM),'--scenario','all','--out',str(out)])
            self.assertEqual(p.returncode,0); self.assertEqual(json.loads(out.read_text())['status'],'pass')
    def test_scan_blocks_missing_contract(self):
        with tempfile.TemporaryDirectory() as td:
            Path(td,'app.py').write_text('def save():\n    pass\n')
            out=Path(td)/'e.json'; p=subprocess.run(['python',str(CHECK),'scan','--root',td,'--policy',str(POLICY),'--out',str(out)])
            self.assertEqual(p.returncode,2); self.assertEqual(json.loads(out.read_text())['status'],'blocked')
    def test_verify_accepts_complete_artifacts(self):
        with tempfile.TemporaryDirectory() as td:
            td=Path(td); ev=td/'e.json'; sim=td/'s.json'; out=td/'v.json'
            ev.write_text(json.dumps({'status':'pass','root':'.','concepts':{k:['x:1'] for k in ['outbox','transaction','event_id','retry','delivered','idempotent']},'findings':[]}))
            subprocess.run(['python',str(SIM),'--scenario','all','--out',str(sim)],check=True)
            p=subprocess.run(['python',str(CHECK),'verify','--evidence',str(ev),'--simulation',str(sim),'--out',str(out)])
            self.assertEqual(p.returncode,0); self.assertEqual(json.loads(out.read_text())['status'],'verified')

if __name__=='__main__': unittest.main()

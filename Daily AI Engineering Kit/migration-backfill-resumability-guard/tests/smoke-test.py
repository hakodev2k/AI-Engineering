#!/usr/bin/env python3
import hashlib, json, subprocess, sys, tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def run(*args,ok=(0,)):
    p=subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
    if p.returncode not in ok: raise RuntimeError(p.stdout+p.stderr)
    return p

def main():
    with tempfile.TemporaryDirectory() as td:
        d=Path(td); plan=json.load(open(ROOT/'templates/backfill-plan.example.json')); plan['transform_fingerprint']='a'*64
        raw=d/'plan-raw.json'; raw.write_text(json.dumps(plan))
        planp=d/'plan.json'; run(ROOT/'scripts/fingerprint-backfill-plan.py',raw,'--output',planp)
        plan=json.load(open(planp)); fp=plan['plan_fingerprint']
        cp={"migration_id":plan['migration_id'],"revision":1,"plan_fingerprint":fp,"checkpoint_version":0,"cursor":None,"processed_total":0,"status":"ready","updated_at":"2026-08-17T11:30:00Z","lease_owner":"","lease_expires_at":"2026-08-17T11:30:00Z"}
        cpp=d/'checkpoint.json'; cpp.write_text(json.dumps(cp))
        val=d/'validation.json'; run(ROOT/'scripts/validate-backfill-state.py','--plan',planp,'--checkpoint',cpp,'--policy',ROOT/'config/backfill-policy.json','--output',val)
        review={"reviewer_id":"reviewer","plan_fingerprint":fp,"verdict":"resume-approved","findings":[]}; rp=d/'review.json'; rp.write_text(json.dumps(review))
        gate=d/'gate.json'; run(ROOT/'scripts/evaluate-resume-gate.py','--plan',planp,'--checkpoint',cpp,'--validation',val,'--review',rp,'--policy',ROOT/'config/backfill-policy.json','--actor','executor','--now','2026-08-17T11:31:00Z','--output',gate)
        assert json.load(open(gate))['decision']=='allow'
        run(ROOT/'scripts/advance-checkpoint.py','--checkpoint',cpp,'--expected-version','0','--cursor','500','--processed','500','--status','paused','--lease-owner','executor','--lease-expires-at','2026-08-17T11:40:00Z')
        conflict=run(ROOT/'scripts/advance-checkpoint.py','--checkpoint',cpp,'--expected-version','0','--cursor','1000','--processed','500','--status','paused','--lease-owner','executor','--lease-expires-at','2026-08-17T11:40:00Z',ok=(5,))
        cp2=json.load(open(cpp)); cp2['plan_fingerprint']='0'*64; cpp.write_text(json.dumps(cp2))
        bad=run(ROOT/'scripts/validate-backfill-state.py','--plan',planp,'--checkpoint',cpp,'--policy',ROOT/'config/backfill-policy.json',ok=(3,))
        print('smoke test passed: allow, checkpoint advance, version conflict blocked, stale fingerprint blocked')
    return 0
if __name__=='__main__': raise SystemExit(main())

#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PLAN=ROOT/'templates'/'side-effect-plan.example.json'
POLICY=ROOT/'config'/'side-effect-policy.json'
SIM=ROOT/'examples'/'simulation-record.example.json'
VALIDATE=ROOT/'scripts'/'validate-plan.py'
GATE=ROOT/'scripts'/'evaluate-gate.py'

def run(args, expected):
    p=subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
    if p.returncode!=expected:
        raise AssertionError(f"return={p.returncode} expected={expected}\nstdout={p.stdout}\nstderr={p.stderr}")
    return json.loads(p.stdout)

def main():
    assert run([VALIDATE,'--plan',PLAN,'--policy',POLICY],0)['status']=='valid'
    assert run([GATE,'--stage','simulation','--plan',PLAN,'--policy',POLICY],0)['decision']=='allow-simulation'
    with tempfile.TemporaryDirectory() as td:
        td=Path(td)
        review=td/'review.json'; approval=td/'approval.json'
        review.write_text(json.dumps({
            'action_id':'action-001','plan_revision':1,'reviewer_id':'independent-reviewer','status':'verified-for-approval'
        }),encoding='utf-8')
        approval.write_text(json.dumps({
            'action_id':'action-001','plan_revision':1,'approved_by':'human-owner','status':'approved',
            'request_fingerprint':'a'*64
        }),encoding='utf-8')
        blocked=run([GATE,'--stage','live','--plan',PLAN,'--policy',POLICY,'--simulation',SIM,'--review',review],3)
        assert blocked['decision']=='block' and 'missing-human-approval' in blocked['reasons']
        allowed=run([GATE,'--stage','live','--plan',PLAN,'--policy',POLICY,'--simulation',SIM,'--review',review,'--approval',approval],0)
        assert allowed['decision']=='allow-live'
        bad_review=td/'bad-review.json'
        bad_review.write_text(json.dumps({
            'action_id':'action-001','plan_revision':1,'reviewer_id':'implementation-agent','status':'verified-for-approval'
        }),encoding='utf-8')
        blocked2=run([GATE,'--stage','live','--plan',PLAN,'--policy',POLICY,'--simulation',SIM,'--review',bad_review,'--approval',approval],3)
        assert 'reviewer-not-independent' in blocked2['reasons']
    print('smoke-test: passed')
    return 0
if __name__=='__main__': raise SystemExit(main())

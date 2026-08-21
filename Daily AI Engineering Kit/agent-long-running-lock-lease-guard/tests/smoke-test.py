#!/usr/bin/env python3
import json, os, subprocess, sys, tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
PY=sys.executable

def run(args, ok=True):
    p=subprocess.run([PY,*args],cwd=ROOT,text=True,capture_output=True)
    if ok and p.returncode!=0: raise AssertionError(f'{args}\n{p.stdout}\n{p.stderr}')
    if not ok and p.returncode==0: raise AssertionError(f'expected failure: {args}')
    return p

def main():
    with tempfile.TemporaryDirectory() as d:
        store=Path(d)/'store.json'; scope=Path(d)/'scope.json'; intent=Path(d)/'intent.json'
        scope.write_text(json.dumps({"risk":"medium","paths":["src/"]}),encoding='utf-8')
        p=run(['scripts/lease_store.py','acquire','--store',str(store),'--resource','repo:test:main','--owner','agent-a','--scope-json',str(scope),'--lease-seconds','60'])
        lease=json.loads(p.stdout)
        bad={"resource_key":"repo:test:main","owner_id":"agent-a","lease_id":lease['lease_id'],"fencing_token":lease['fencing_token']-1,"scope_fingerprint":lease['scope_fingerprint'],"action":"update-branch-artifact","intent_fingerprint":"b"*64,"approval_required":False,"approval_reference":None}
        intent.write_text(json.dumps(bad),encoding='utf-8')
        run(['scripts/evaluate-mutation-gate.py','--store',str(store),'--intent',str(intent),'--policy','config/lease-policy.json'],ok=False)
        bad['fencing_token']=lease['fencing_token']; intent.write_text(json.dumps(bad),encoding='utf-8')
        out=run(['scripts/evaluate-mutation-gate.py','--store',str(store),'--intent',str(intent),'--policy','config/lease-policy.json'])
        assert json.loads(out.stdout)['decision']=='verified'
        run(['scripts/lease_store.py','acquire','--store',str(store),'--resource','repo:test:main','--owner','agent-b','--scope-json',str(scope),'--lease-seconds','60'],ok=False)
        run(['scripts/validate-lease-state.py','--store',str(store)])
        run(['scripts/lease_store.py','release','--store',str(store),'--resource','repo:test:main','--owner','agent-a','--lease-id',lease['lease_id'],'--fencing-token',str(lease['fencing_token'])])
        print('smoke-test: PASS')
if __name__=='__main__':main()

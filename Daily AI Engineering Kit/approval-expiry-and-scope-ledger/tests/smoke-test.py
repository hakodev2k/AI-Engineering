#!/usr/bin/env python3
import hashlib, json, os, subprocess, sys, tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PY=sys.executable

def canon(v): return json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def fp(v): return hashlib.sha256(canon(v).encode()).hexdigest()
def write(p,v): Path(p).write_text(json.dumps(v,indent=2),encoding='utf-8')
def run(*args, expect=0):
    p=subprocess.run([PY,*map(str,args)],cwd=ROOT,text=True,capture_output=True)
    if p.returncode!=expect:
        raise AssertionError(f'expected {expect}, got {p.returncode}\nSTDOUT={p.stdout}\nSTDERR={p.stderr}')
    return json.loads(p.stdout)

with tempfile.TemporaryDirectory() as td:
    td=Path(td); now=datetime.now(timezone.utc); payload={'artifact_digest':'sha256:abc'}
    r={
      'request_id':'smoke-1','revision':1,'action_type':'production-deploy','risk_category':'production',
      'target':'api','environment':'production','scope':['api'],'payload':payload,'payload_fingerprint':fp(payload),
      'policy_version':'1.0.0','reuse_mode':'single-use','requested_at':now.isoformat(),
      'expires_at':(now+timedelta(minutes=20)).isoformat(),'required_approver_role':'release-manager',
      'rollback_plan':'rollback artifact','evidence':['test://smoke']
    }
    basis={k:r[k] for k in ['request_id','revision','action_type','risk_category','target','environment','scope','payload_fingerprint','policy_version']}
    r['action_fingerprint']=fp(basis)
    approval={'request_id':'smoke-1','revision':1,'action_fingerprint':r['action_fingerprint'],'status':'approved','approver_id':'human-1','approver_role':'release-manager','expires_at':r['expires_at'],'revoked':False}
    intent={**basis,'executor_id':'agent-1'}
    review={'reviewed_fingerprint':r['action_fingerprint'],'verdict':'approved-for-execution','reviewer_id':'human-2'}
    for name,obj in [('request.json',r),('approval.json',approval),('intent.json',intent),('review.json',review)]: write(td/name,obj)
    ledger=td/'ledger.jsonl'; ledger.write_text('',encoding='utf-8')
    valid=run(ROOT/'scripts/validate-approval-request.py','--request',td/'request.json','--policy',ROOT/'config/approval-policy.json')
    assert valid['status']=='valid'
    gate=run(ROOT/'scripts/evaluate-approval-gate.py','--request',td/'request.json','--approval',td/'approval.json','--intent',td/'intent.json','--review',td/'review.json','--ledger',ledger,'--policy',ROOT/'config/approval-policy.json','--phase','pre-execution')
    assert gate['decision']=='allow'
    run(ROOT/'scripts/append-consumption.py','--ledger',ledger,'--request',td/'request.json','--executor','agent-1','--result','succeeded','--evidence','deploy://smoke')
    replay=run(ROOT/'scripts/evaluate-approval-gate.py','--request',td/'request.json','--approval',td/'approval.json','--intent',td/'intent.json','--review',td/'review.json','--ledger',ledger,'--policy',ROOT/'config/approval-policy.json','--phase','pre-execution', expect=3)
    assert replay['decision']=='human-approval-required' and 'single-use-consumed' in replay['reasons']
    changed=dict(intent); changed['scope']=['api','worker']; write(td/'intent-changed.json',changed)
    mismatch=run(ROOT/'scripts/evaluate-approval-gate.py','--request',td/'request.json','--approval',td/'approval.json','--intent',td/'intent-changed.json','--review',td/'review.json','--ledger',td/'empty.jsonl','--policy',ROOT/'config/approval-policy.json','--phase','pre-execution', expect=3)
    assert mismatch['decision']=='human-approval-required' and 'intent-fingerprint-mismatch' in mismatch['reasons']
print('approval-expiry-and-scope-ledger smoke test passed')

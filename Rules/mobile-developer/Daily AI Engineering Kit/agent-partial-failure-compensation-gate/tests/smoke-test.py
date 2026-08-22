#!/usr/bin/env python3
import hashlib,json,pathlib,subprocess,sys,tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1]; S=ROOT/'scripts'; P=ROOT/'config'/'compensation-policy.json'
def run(name,args,expect=0):
    r=subprocess.run([sys.executable,str(S/name),*map(str,args)],capture_output=True,text=True)
    if r.returncode!=expect: raise RuntimeError(f'{name} exit={r.returncode} expected={expect}\n{r.stdout}\n{r.stderr}')
    return r
def write(p,o):p.write_text(json.dumps(o,indent=2)+'\n',encoding='utf-8')
def fp(o):return hashlib.sha256(json.dumps(o,sort_keys=True,separators=(',',':')).encode()).hexdigest()
with tempfile.TemporaryDirectory() as td:
    d=pathlib.Path(td)
    plan={'version':'1.0.0','workflow_id':'smoke','repository_revision':'abc123','risk':'low','steps':[{'id':'s1','action':'create record','operation_key':'smoke:s1:v1','precondition':'record absent','success_evidence':'read-back present','compensation':{'mode':'automatic','action':'delete exact created record','verification':'read-back absent'},'approval_action':None}]}
    pp=d/'plan.json';write(pp,plan)
    run('validate-plan.py',['--plan',pp,'--policy',P,'--output',d/'validation.json'])
    run('fingerprint-plan.py',[pp,'--output',d/'fingerprint.json'])
    ledger={'version':'1.0.0','workflow_id':'smoke','plan_fingerprint':fp(plan),'repository_revision':'abc123','status':'running','recovery_attempts':0,'steps':[{'id':'s1','operation_key':'smoke:s1:v1','outcome':'not-started','attempts':0,'precondition_evidence':None,'postcondition_evidence':None,'compensation_status':'not-needed','error':None}]}
    lp=d/'ledger.json';write(lp,ledger)
    run('record-step-result.py',['--plan',pp,'--ledger',lp,'--step-id','s1','--outcome','succeeded','--precondition-evidence','pre-ok','--postcondition-evidence','post-ok','--output',lp])
    done=json.loads(lp.read_text());done['status']='completed';write(lp,done)
    run('evaluate-final-gate.py',['--plan',pp,'--ledger',lp,'--policy',P,'--output',d/'final.json'])
    unknown=json.loads(lp.read_text());unknown['status']='blocked';unknown['steps'][0]['outcome']='unknown';unknown['steps'][0]['postcondition_evidence']=None;write(lp,unknown)
    run('evaluate-recovery-gate.py',['--plan',pp,'--ledger',lp,'--policy',P,'--output',d/'recovery.json'],5)
    bad=dict(plan);bad['steps']=[dict(plan['steps'][0]),dict(plan['steps'][0])];bp=d/'bad.json';write(bp,bad)
    run('validate-plan.py',['--plan',bp,'--policy',P],5)
print('smoke-test: PASS')

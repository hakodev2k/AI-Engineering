#!/usr/bin/env python3
import argparse,json,pathlib,sys,hashlib

def read(p):
    try:return json.loads(pathlib.Path(p).read_text(encoding='utf-8'))
    except Exception as e: print(f'input error: {e}',file=sys.stderr);sys.exit(2)
def digest(o):return hashlib.sha256(json.dumps(o,sort_keys=True,separators=(',',':')).encode()).hexdigest()
p=argparse.ArgumentParser();p.add_argument('--plan',required=True);p.add_argument('--ledger',required=True);p.add_argument('--policy',required=True);p.add_argument('--review');p.add_argument('--implementation-owner',default='implementation-agent');p.add_argument('--output');a=p.parse_args()
plan,ledger,policy=read(a.plan),read(a.ledger),read(a.policy);reasons=[];status='resume-ready'
if ledger.get('plan_fingerprint')!=digest(plan):reasons.append('plan-fingerprint-mismatch')
if ledger.get('workflow_id')!=plan.get('workflow_id') or ledger.get('repository_revision')!=plan.get('repository_revision'):reasons.append('ledger-binding-mismatch')
unknown=[s.get('id') for s in ledger.get('steps',[]) if s.get('outcome')=='unknown']
if unknown:reasons.append('unknown-outcome-reconciliation-required:'+','.join(unknown))
if int(ledger.get('recovery_attempts',0))>=int(policy.get('execution',{}).get('max_recovery_attempts',2)):reasons.append('recovery-budget-exhausted')
settled=[s for s in ledger.get('steps',[]) if s.get('outcome') in ('succeeded','compensated')]
for s in settled:
    if s.get('outcome')=='succeeded' and not s.get('postcondition_evidence'):reasons.append(f"missing-success-evidence:{s.get('id')}")
risk=plan.get('risk','medium');needs_review=risk in policy.get('review',{}).get('independent_review_for',[])
if reasons: status='blocked'
elif needs_review:
    if not a.review:status='review-required';reasons.append('independent-review-required')
    else:
        r=read(a.review)
        if r.get('workflow_id')!=plan.get('workflow_id') or r.get('plan_fingerprint')!=digest(plan) or r.get('ledger_fingerprint')!=digest(ledger):reasons.append('stale-review-binding')
        if r.get('reviewer')==a.implementation_owner and not policy.get('review',{}).get('allow_self_review',False):reasons.append('self-review-not-allowed')
        if r.get('verdict')!='approved':reasons.append('review-not-approved')
        status='blocked' if reasons else 'resume-ready'
out={'status':status,'reasons':reasons,'plan_fingerprint':digest(plan),'ledger_fingerprint':digest(ledger)}
text=json.dumps(out,indent=2)+'\n';
if a.output:pathlib.Path(a.output).write_text(text,encoding='utf-8')
print(text,end='');sys.exit(0 if status=='resume-ready' else (4 if status=='review-required' else 5))

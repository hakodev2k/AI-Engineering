#!/usr/bin/env python3
import argparse,json,pathlib,sys,hashlib

def read(p):
    try:return json.loads(pathlib.Path(p).read_text(encoding='utf-8'))
    except Exception as e: print(f'input error: {e}',file=sys.stderr);sys.exit(2)
def fp(o):return hashlib.sha256(json.dumps(o,sort_keys=True,separators=(',',':')).encode()).hexdigest()
p=argparse.ArgumentParser();p.add_argument('--plan',required=True);p.add_argument('--ledger',required=True);p.add_argument('--step-id',required=True);p.add_argument('--outcome',choices=['succeeded','failed','unknown','compensated'],required=True);p.add_argument('--precondition-evidence');p.add_argument('--postcondition-evidence');p.add_argument('--error');p.add_argument('--output',required=True);a=p.parse_args()
plan,ledger=read(a.plan),read(a.ledger)
if ledger.get('workflow_id')!=plan.get('workflow_id') or ledger.get('repository_revision')!=plan.get('repository_revision') or ledger.get('plan_fingerprint')!=fp(plan):
    print('ledger is not bound to current plan',file=sys.stderr);sys.exit(5)
stepdef=next((s for s in plan.get('steps',[]) if s.get('id')==a.step_id),None)
step=next((s for s in ledger.get('steps',[]) if s.get('id')==a.step_id),None)
if not stepdef or not step: print('unknown step',file=sys.stderr);sys.exit(5)
if a.outcome=='succeeded' and not a.postcondition_evidence: print('success requires postcondition evidence',file=sys.stderr);sys.exit(5)
if step.get('outcome') in ('succeeded','compensated') and a.outcome not in ('compensated',): print('cannot overwrite settled outcome',file=sys.stderr);sys.exit(5)
step['attempts']=int(step.get('attempts',0))+1;step['outcome']=a.outcome
if a.precondition_evidence:step['precondition_evidence']=a.precondition_evidence
if a.postcondition_evidence:step['postcondition_evidence']=a.postcondition_evidence
step['error']=a.error
if a.outcome=='failed':ledger['status']='failed'
elif a.outcome=='unknown':ledger['status']='blocked'
elif a.outcome=='compensated':step['compensation_status']='succeeded';ledger['status']='recovering'
else:ledger['status']='running'
pathlib.Path(a.output).write_text(json.dumps(ledger,indent=2)+'\n',encoding='utf-8');print(json.dumps(ledger,indent=2))

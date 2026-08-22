#!/usr/bin/env python3
import argparse,json,pathlib,sys,hashlib

def read(p):
    try:return json.loads(pathlib.Path(p).read_text(encoding='utf-8'))
    except Exception as e: print(f'input error: {e}',file=sys.stderr);sys.exit(2)
def digest(o):return hashlib.sha256(json.dumps(o,sort_keys=True,separators=(',',':')).encode()).hexdigest()
p=argparse.ArgumentParser();p.add_argument('--plan',required=True);p.add_argument('--ledger',required=True);p.add_argument('--policy',required=True);p.add_argument('--output');a=p.parse_args()
plan,ledger,policy=read(a.plan),read(a.ledger),read(a.policy);reasons=[]
if ledger.get('plan_fingerprint')!=digest(plan):reasons.append('plan-fingerprint-mismatch')
if ledger.get('workflow_id')!=plan.get('workflow_id') or ledger.get('repository_revision')!=plan.get('repository_revision'):reasons.append('ledger-binding-mismatch')
steps={s.get('id'):s for s in ledger.get('steps',[])}
for d in plan.get('steps',[]):
    s=steps.get(d.get('id'))
    if not s: reasons.append(f"missing-ledger-step:{d.get('id')}");continue
    if s.get('outcome')=='unknown':reasons.append(f"unknown-outcome:{d.get('id')}")
    if s.get('outcome')=='succeeded' and not s.get('postcondition_evidence'):reasons.append(f"missing-postcondition-evidence:{d.get('id')}")
    if s.get('outcome') not in ('succeeded','compensated'):reasons.append(f"unsettled-step:{d.get('id')}:{s.get('outcome')}")
    if s.get('outcome')=='compensated' and policy.get('compensation',{}).get('require_verification_after_compensation',True) and not s.get('postcondition_evidence'):reasons.append(f"unverified-compensation:{d.get('id')}")
status='verified' if not reasons and ledger.get('status') in ('completed','compensated') else 'blocked'
if ledger.get('status') not in ('completed','compensated'):reasons.append('ledger-not-terminal-success')
out={'status':status,'reasons':reasons,'plan_fingerprint':digest(plan),'ledger_fingerprint':digest(ledger)}
text=json.dumps(out,indent=2)+'\n';
if a.output:pathlib.Path(a.output).write_text(text,encoding='utf-8')
print(text,end='');sys.exit(0 if status=='verified' else 5)

#!/usr/bin/env python3
import argparse,json,pathlib,sys

def read(p):
    try:return json.loads(pathlib.Path(p).read_text(encoding='utf-8'))
    except Exception as e: print(f'input error: {e}',file=sys.stderr);sys.exit(2)
p=argparse.ArgumentParser();p.add_argument('--plan',required=True);p.add_argument('--policy',required=True);p.add_argument('--output');a=p.parse_args()
plan,policy=read(a.plan),read(a.policy);issues=[]
for k in ('version','workflow_id','repository_revision','risk','steps'):
    if not plan.get(k):issues.append(f'missing:{k}')
steps=plan.get('steps',[])
if not isinstance(steps,list) or not steps:issues.append('steps-empty')
ids=set(); keys=set()
for i,s in enumerate(steps if isinstance(steps,list) else []):
    sid=s.get('id'); key=s.get('operation_key')
    if not sid:issues.append(f'step-{i}:missing-id')
    elif sid in ids:issues.append(f'duplicate-step-id:{sid}')
    ids.add(sid)
    if policy.get('execution',{}).get('require_operation_key',True):
        if not key:issues.append(f'{sid}:missing-operation-key')
        elif key in keys:issues.append(f'duplicate-operation-key:{key}')
    keys.add(key)
    for field in ('action','precondition','success_evidence','compensation'):
        if not s.get(field):issues.append(f'{sid}:missing-{field}')
    c=s.get('compensation') or {}
    if c.get('mode') not in ('automatic','manual','none'):issues.append(f'{sid}:invalid-compensation-mode')
    if c.get('mode')!='none' and (not c.get('action') or not c.get('verification')):issues.append(f'{sid}:incomplete-compensation')
    aa=s.get('approval_action')
    if aa is not None and aa not in policy.get('approval_required_actions',[]):issues.append(f'{sid}:unknown-approval-action:{aa}')
status='valid' if not issues else 'blocked';out={'status':status,'issues':issues,'step_count':len(steps)}
text=json.dumps(out,indent=2)+'\n'
if a.output:pathlib.Path(a.output).write_text(text,encoding='utf-8')
print(text,end='');sys.exit(0 if status=='valid' else 5)

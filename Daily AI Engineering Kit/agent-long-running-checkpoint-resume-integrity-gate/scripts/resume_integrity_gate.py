#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,sys
from datetime import datetime,timezone
from pathlib import Path
from typing import Any

def load(p:Path)->Any:
    try:return json.loads(p.read_text())
    except FileNotFoundError as e:raise ValueError(f"missing input: {p}") from e
    except json.JSONDecodeError as e:raise ValueError(f"invalid JSON in {p}: {e}") from e

def dt(s:str)->datetime:
    try:
        d=datetime.fromisoformat(s.replace('Z','+00:00'))
        if d.tzinfo is None: raise ValueError
        return d.astimezone(timezone.utc)
    except Exception as e:raise ValueError(f"invalid datetime: {s}") from e

def check(name:str,ok:bool,detail:str):return {'name':name,'status':'pass' if ok else 'fail','detail':detail}

def main()->int:
    ap=argparse.ArgumentParser();ap.add_argument('--checkpoint',required=True,type=Path);ap.add_argument('--current',required=True,type=Path);ap.add_argument('--policy',required=True,type=Path);ap.add_argument('--output',required=True,type=Path);ap.add_argument('--now',default='');a=ap.parse_args()
    try:c=load(a.checkpoint);cur=load(a.current);p=load(a.policy);now=dt(a.now) if a.now else datetime.now(timezone.utc)
    except ValueError as e:print(str(e),file=sys.stderr);return 2
    required=['task_id','scope_hash','repo_head','working_tree_clean','diff_hash','created_at','approvals','stage','next_action']
    missing=[k for k in required if k not in c]
    if missing:print('checkpoint missing: '+','.join(missing),file=sys.stderr);return 2
    for k in ['task_id','scope_hash','repo_head','working_tree_clean','diff_hash']:
        if k not in cur:print(f'current state missing: {k}',file=sys.stderr);return 2
    checks=[]
    checks.append(check('task_id',c['task_id']==cur['task_id'],f"checkpoint={c['task_id']} current={cur['task_id']}"))
    checks.append(check('scope_hash',(not p.get('require_scope_hash_match',True)) or c['scope_hash']==cur['scope_hash'],'scope hash comparison'))
    checks.append(check('repo_head',(not p.get('require_same_head',True)) or c['repo_head']==cur['repo_head'],f"checkpoint={c['repo_head']} current={cur['repo_head']}"))
    checks.append(check('working_tree_clean',(not p.get('require_clean_state_match',True)) or c['working_tree_clean']==cur['working_tree_clean'],'clean/dirty state comparison'))
    checks.append(check('diff_hash',(not p.get('require_diff_hash_match',True)) or c['diff_hash']==cur['diff_hash'],'tracked diff hash comparison'))
    if p.get('require_environment_fingerprint_match',False): checks.append(check('environment_fingerprint',c.get('environment_fingerprint','')==cur.get('environment_fingerprint',''),'environment fingerprint comparison'))
    age=(now-dt(c['created_at'])).total_seconds()/60
    checks.append(check('checkpoint_age',0<=age<=float(p.get('max_checkpoint_age_minutes',240)),f"age_minutes={age:.2f}"))
    if p.get('require_unexpired_approvals',True):
        expired=[x.get('action','unknown') for x in c.get('approvals',[]) if dt(x['expires_at'])<=now]
        checks.append(check('approvals',not expired,'expired='+','.join(expired) if expired else 'all checkpoint approvals current'))
    blocking=sum(x['status']=='fail' for x in checks);report={'status':'fail' if blocking else 'pass','blocking':blocking,'checks':checks}
    a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(report,indent=2,sort_keys=True)+'\n')
    if blocking:print(f'resume blocked: {blocking} integrity failure(s)',file=sys.stderr);return 1
    print('resume integrity gate passed');return 0
if __name__=='__main__':raise SystemExit(main())

#!/usr/bin/env python3
"""Bound automatic context-compaction retries using measurable progress.

JSONL ledger event fields:
{"timestamp": 1787300000, "fingerprint":"abc", "kind":"compaction", "before_tokens":300000, "after_tokens":250000, "actual":true}
`after_tokens` may be null for a failed attempt.
Exit codes: 0 allow/compact, 2 invalid, 3 cooldown, 4 manual recovery.
"""
from __future__ import annotations
import argparse, json, sys, time
from pathlib import Path

INVALID, COOLDOWN, MANUAL = 2, 3, 4


def load_json(path:Path)->dict:
    try: v=json.loads(path.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f'cannot read {path}: {exc}') from exc
    if not isinstance(v,dict): raise ValueError(f'{path} must contain object')
    return v


def load_events(path:Path)->list[dict]:
    try: lines=path.read_text(encoding='utf-8').splitlines()
    except OSError as exc: raise ValueError(f'cannot read {path}: {exc}') from exc
    out=[]
    for n,line in enumerate(lines,1):
        if not line.strip(): continue
        try: e=json.loads(line)
        except json.JSONDecodeError as exc: raise ValueError(f'line {n}: {exc}') from exc
        if not isinstance(e,dict): raise ValueError(f'line {n}: object required')
        if not isinstance(e.get('timestamp'),(int,float)) or not isinstance(e.get('fingerprint'),str) or not e['fingerprint']:
            raise ValueError(f'line {n}: timestamp and fingerprint required')
        if e.get('kind')!='compaction': raise ValueError(f'line {n}: kind must be compaction')
        for k in ('before_tokens','after_tokens'):
            if e.get(k) is not None and (not isinstance(e[k],(int,float)) or isinstance(e[k],bool) or e[k]<0): raise ValueError(f'line {n}: {k} invalid')
        out.append(e)
    return sorted(out,key=lambda x:x['timestamp'])


def progress(e:dict):
    b=e.get('before_tokens'); a=e.get('after_tokens')
    if not b or a is None: return None
    return (b-a)/b


def decide(events:list[dict],policy:dict,limit:int,now:float|None=None)->tuple[dict,int]:
    if limit<=0: raise ValueError('context limit must be positive')
    now=time.time() if now is None else now
    max_attempts=int(policy.get('max_attempts_per_fingerprint',2)); max_10=int(policy.get('max_compactions_per_10_minutes',3))
    min_prog=float(policy.get('minimum_progress_ratio',0.20)); target=float(policy.get('target_context_utilization_ratio',0.60)); cooldown=float(policy.get('cooldown_seconds_after_insufficient_progress',600))
    recent=[e for e in events if now-e['timestamp']<=600]
    if len(recent)>=max_10:
        return {'decision':'cooldown','reason':'10-minute compaction rate limit reached','recent_compactions':len(recent)},COOLDOWN
    fp=events[-1]['fingerprint'] if events else 'current'
    same=[e for e in events if e['fingerprint']==fp]
    if len(same)>=max_attempts:
        return {'decision':'manual_recovery','reason':'attempt limit reached for unchanged source fingerprint','fingerprint':fp,'attempts':len(same)},MANUAL
    if same:
        last=same[-1]; p=progress(last)
        if p is None:
            if now-last['timestamp']<cooldown: return {'decision':'cooldown','reason':'previous compaction failed/no measurable progress','fingerprint':fp},COOLDOWN
        elif p<min_prog and now-last['timestamp']<cooldown:
            return {'decision':'cooldown','reason':'previous compaction progress below minimum','progress_ratio':round(p,4),'fingerprint':fp},COOLDOWN
        elif last.get('after_tokens') is not None and last['after_tokens']/limit<=target:
            return {'decision':'allow','reason':'post-compaction utilization already at target','utilization_ratio':round(last['after_tokens']/limit,4)},0
    return {'decision':'compact','reason':'within bounded policy','fingerprint':fp,'attempts_used':len(same),'attempts_remaining':max_attempts-len(same)},0


def main()->int:
    p=argparse.ArgumentParser(); p.add_argument('command',choices=['decide']); p.add_argument('events',type=Path); p.add_argument('--policy',type=Path,required=True); p.add_argument('--context-limit',type=int,required=True); p.add_argument('--now',type=float)
    a=p.parse_args()
    try:
        events=load_events(a.events); policy=load_json(a.policy); result,code=decide(events,policy,a.context_limit,a.now)
    except (ValueError,TypeError) as exc:
        print(json.dumps({'decision':'invalid','error':str(exc)}),file=sys.stderr); return INVALID
    print(json.dumps(result,indent=2)); return code

if __name__=='__main__': raise SystemExit(main())

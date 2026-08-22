#!/usr/bin/env python3
"""Deterministic runtime-side wait broker.
Input provider command must print one JSON object per invocation:
{"status":"running|queued|pending|completed|failed|cancelled","result":...}
The broker never invokes an LLM. Exit: 0 completed, 2 invalid, 3 failed/cancelled, 4 timeout.
"""
from __future__ import annotations
import argparse, json, random, subprocess, sys, time
from pathlib import Path


def load(path: Path) -> dict:
    try: data=json.loads(path.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as e: raise ValueError(f'policy: {e}') from e
    if not isinstance(data,dict): raise ValueError('policy must be object')
    return data


def check(cmd:list[str], timeout:float)->dict:
    try:
        p=subprocess.run(cmd,capture_output=True,text=True,timeout=timeout,check=False)
    except (OSError,subprocess.TimeoutExpired) as e: raise RuntimeError(f'provider invocation failed: {e}') from e
    if p.returncode != 0: raise RuntimeError(f'provider exit {p.returncode}: {p.stderr[-1000:]}')
    try: row=json.loads(p.stdout)
    except json.JSONDecodeError as e: raise RuntimeError(f'provider returned invalid JSON: {e}') from e
    if not isinstance(row,dict) or not isinstance(row.get('status'),str): raise RuntimeError('provider JSON requires status')
    return row


def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument('--policy',type=Path,required=True); ap.add_argument('--handle',required=True); ap.add_argument('provider',nargs=argparse.REMAINDER); a=ap.parse_args()
    if not a.provider: print('provider command required',file=sys.stderr); return 2
    try: p=load(a.policy)
    except ValueError as e: print(str(e),file=sys.stderr); return 2
    initial=float(p.get('initial_interval_seconds',10)); maximum=float(p.get('max_interval_seconds',120)); mult=float(p.get('backoff_multiplier',1.7)); jitter=float(p.get('jitter_ratio',0.15)); max_wait=float(p.get('max_wait_seconds',7200)); max_polls=int(p.get('max_polls',120)); max_bytes=int(p.get('max_result_bytes',65536))
    if initial<=0 or maximum<initial or mult<1 or not 0<=jitter<1 or max_wait<=0 or max_polls<1 or max_bytes<1: print('invalid policy limits',file=sys.stderr); return 2
    pending=set(p.get('pending_states',['queued','running','pending'])); terminal=set(p.get('terminal_states',['completed','failed','cancelled']))
    started=time.monotonic(); interval=initial; polls=0
    while polls < max_polls and time.monotonic()-started < max_wait:
        polls+=1
        try: row=check(a.provider+[a.handle], min(30.0,max_wait))
        except RuntimeError as e: print(json.dumps({'status':'provider_error','error':str(e),'polls':polls}),file=sys.stderr); return 3
        status=row['status']
        if status in terminal:
            payload=json.dumps({'status':status,'elapsed_seconds':round(time.monotonic()-started,3),'polls':polls,'result':row.get('result')},ensure_ascii=False)
            if len(payload.encode())>max_bytes: payload=json.dumps({'status':status,'elapsed_seconds':round(time.monotonic()-started,3),'polls':polls,'result_truncated':True})
            print(payload); return 0 if status=='completed' else 3
        if status not in pending: print(json.dumps({'status':'invalid_provider_state','value':status}),file=sys.stderr); return 3
        remaining=max_wait-(time.monotonic()-started)
        if remaining<=0: break
        delay=min(interval,remaining); delay*=random.uniform(1-jitter,1+jitter); time.sleep(max(0,min(delay,remaining))); interval=min(maximum,interval*mult)
    print(json.dumps({'status':'timeout','elapsed_seconds':round(time.monotonic()-started,3),'polls':polls})); return 4

if __name__=='__main__': raise SystemExit(main())

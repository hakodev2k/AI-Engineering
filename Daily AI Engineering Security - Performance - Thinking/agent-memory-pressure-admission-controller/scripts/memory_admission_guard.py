#!/usr/bin/env python3
"""Deterministic pre-spawn memory admission guard using explicit headroom policy."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

REQUIRED = {"minimum_free_bytes_after_spawn","reserve_fraction","estimated_worker_bytes","max_projected_utilization","max_reclaim_retries"}

def read_linux_meminfo() -> tuple[int,int]:
    values={}
    with open('/proc/meminfo', encoding='utf-8') as f:
        for line in f:
            k,v,*_ = line.replace(':','').split()
            values[k]=int(v)*1024
    if 'MemTotal' not in values or 'MemAvailable' not in values:
        raise ValueError('/proc/meminfo lacks MemTotal or MemAvailable')
    return values['MemTotal'], values['MemAvailable']

def evaluate(total:int, available:int, policy:dict, worker_bytes:int|None=None)->dict:
    missing=sorted(REQUIRED-policy.keys())
    if missing: raise ValueError('missing required keys: '+', '.join(missing))
    if total<=0 or available<0 or available>total: raise ValueError('invalid memory measurements')
    reserve_fraction=float(policy['reserve_fraction']); max_util=float(policy['max_projected_utilization'])
    if not 0<=reserve_fraction<1 or not 0<max_util<=1: raise ValueError('fractions out of range')
    worker=int(worker_bytes if worker_bytes is not None else policy['estimated_worker_bytes'])
    if worker<0: raise ValueError('worker estimate must be non-negative')
    projected_available=available-worker
    projected_used=total-projected_available
    projected_util=projected_used/total
    reserve_bytes=max(int(total*reserve_fraction), int(policy['minimum_free_bytes_after_spawn']))
    reasons=[]
    if projected_available < reserve_bytes: reasons.append('projected available memory below required reserve')
    if projected_util > max_util: reasons.append('projected utilization exceeds policy maximum')
    return {
      'decision':'BLOCK' if reasons else 'ADMIT', 'reasons':reasons,
      'total_bytes':total,'available_bytes':available,'estimated_worker_bytes':worker,
      'projected_available_bytes':projected_available,'projected_utilization':round(projected_util,6),
      'required_reserve_bytes':reserve_bytes
    }

def main()->int:
    ap=argparse.ArgumentParser()
    ap.add_argument('--policy',required=True,type=Path)
    ap.add_argument('--total-bytes',type=int)
    ap.add_argument('--available-bytes',type=int)
    ap.add_argument('--worker-bytes',type=int)
    ap.add_argument('--json',action='store_true')
    a=ap.parse_args()
    try:
        p=json.loads(a.policy.read_text(encoding='utf-8'))
        if (a.total_bytes is None)!=(a.available_bytes is None): raise ValueError('provide both --total-bytes and --available-bytes')
        total,available=(a.total_bytes,a.available_bytes) if a.total_bytes is not None else read_linux_meminfo()
        r=evaluate(total,available,p,a.worker_bytes)
    except (OSError,ValueError,json.JSONDecodeError) as e:
        print(f'ERROR: {e}',file=sys.stderr); return 2
    print(json.dumps(r,indent=2) if a.json else r['decision']+' '+('; '.join(r['reasons']) if r['reasons'] else 'safe projected headroom'))
    return 1 if r['decision']=='BLOCK' else 0
if __name__=='__main__': raise SystemExit(main())

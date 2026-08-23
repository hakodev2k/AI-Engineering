#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime

def ts(v):
    if isinstance(v,(int,float)): return float(v)
    if not isinstance(v,str): raise ValueError('timestamp must be number or ISO string')
    return datetime.fromisoformat(v.replace('Z','+00:00')).timestamp()*1000

def analyze(events, timeout_ms):
    if not events: raise ValueError('trace is empty')
    ev=sorted(events,key=lambda x:ts(x['timestamp']))
    start=next((x for x in ev if x.get('kind')=='request_start'),ev[0])
    end=ev[-1]; elapsed=ts(end['timestamp'])-ts(start['timestamp'])
    chunks=[x for x in ev if x.get('kind')=='stream_chunk']
    transport=[x for x in ev if x.get('kind') in {'transport_error','connection_reset'}]
    retry_open=False
    for x in ev:
        if x.get('kind')=='retry_start': retry_open=True
        elif x.get('kind')=='retry_end': retry_open=False
    aborts=[x for x in ev if x.get('kind')=='watchdog_abort']
    last_progress=max((ts(x['timestamp']) for x in ev if x.get('kind') in {'request_start','stream_chunk','tool_result','retry_start','retry_end'}), default=ts(start['timestamp']))
    idle=ts(end['timestamp'])-last_progress
    if transport:
        cls='transport_dead'; action='safe_retry_once'
    elif retry_open:
        cls='retry_active'; action='wait_within_hard_ceiling'
    elif aborts and idle >= timeout_ms*0.98:
        cls='fixed_boundary_abort'; action='checkpoint_then_safe_resume_once'
    elif not chunks and elapsed >= timeout_ms:
        cls='timeout_ambiguous'; action='checkpoint_then_safe_resume_once'
    elif idle >= timeout_ms:
        cls='midstream_timeout'; action='checkpoint_then_safe_resume_once'
    else:
        cls='slow_or_healthy'; action='continue_observing'
    return {'classification':cls,'action':action,'elapsed_ms':round(elapsed,3),'idle_ms':round(idle,3),'chunks':len(chunks),'transport_errors':len(transport),'watchdog_aborts':len(aborts)}

def main():
    p=argparse.ArgumentParser(); p.add_argument('trace'); p.add_argument('--timeout-ms',type=int,default=600000); p.add_argument('--json',action='store_true'); a=p.parse_args()
    if a.timeout_ms<=0: p.error('--timeout-ms must be > 0')
    try:
        with open(a.trace,encoding='utf-8') as f: events=[json.loads(line) for line in f if line.strip()]
        result=analyze(events,a.timeout_ms)
    except (OSError,ValueError,json.JSONDecodeError,KeyError) as e:
        print(f'error: {e}',file=sys.stderr); return 2
    print(json.dumps(result,indent=2) if a.json else f"{result['classification']}: {result['action']}")
    return 0
if __name__=='__main__': raise SystemExit(main())
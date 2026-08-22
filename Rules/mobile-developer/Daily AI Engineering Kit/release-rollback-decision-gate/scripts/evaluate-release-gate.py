#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path
from datetime import datetime, timezone

def load(p):
    try: return json.loads(Path(p).read_text(encoding='utf-8'))
    except Exception as e: print(f'ERROR: {e}', file=sys.stderr); sys.exit(2)

def dt(s): return datetime.fromisoformat(s.replace('Z','+00:00'))

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--policy',required=True); ap.add_argument('--evidence',required=True); a=ap.parse_args()
    p,e=load(a.policy),load(a.evidence)
    ms={m['name']:m for m in e.get('metrics',[]) if 'name' in m and 'current' in m}
    missing=[n for n in p.get('required_metrics',[]) if n not in ms]
    if missing:
        print(json.dumps({'status':'blocked','reasons':['missing metric: '+x for x in missing]},indent=2)); return 1
    rollback=[]; observe=[]
    for n,t in p.get('thresholds',{}).items():
        if n not in ms: continue
        v=ms[n]['current']; direction=t.get('direction')
        if direction=='max':
            if v>=t['rollback']: rollback.append(f'{n}={v} >= rollback {t["rollback"]}')
            elif v>=t['observe']: observe.append(f'{n}={v} >= observe {t["observe"]}')
        elif direction=='min':
            if v<=t['rollback']: rollback.append(f'{n}={v} <= rollback {t["rollback"]}')
            elif v<=t['observe']: observe.append(f'{n}={v} <= observe {t["observe"]}')
    if p.get('rollback_on_smoke_test_failure',True) and not e.get('smoke_tests_passed',False): rollback.append('smoke tests failed')
    if p.get('rollback_on_data_integrity_failure',True) and not e.get('data_integrity_passed',False): rollback.append('data integrity check failed')
    elapsed=(datetime.now(timezone.utc)-dt(e['observation_started_at']).astimezone(timezone.utc)).total_seconds()/60
    if rollback: status='rollback-recommended'
    elif observe:
        status='observe' if elapsed <= p.get('max_observation_minutes',30) else 'blocked'
        if status=='blocked': observe.append('maximum observation window exceeded')
    else: status='healthy'
    out={'status':status,'rollback_breaches':rollback,'observe_breaches':observe,'observation_elapsed_minutes':round(elapsed,2),'human_approval_required': status=='rollback-recommended' and p.get('approval_required_for_rollback',True)}
    print(json.dumps(out,indent=2)); return 0 if status in ('healthy','observe','rollback-recommended') else 1

if __name__=='__main__': sys.exit(main())
#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(p):
    try: return json.loads(Path(p).read_text(encoding='utf-8'))
    except Exception as e: print(f'ERROR: {e}', file=sys.stderr); sys.exit(2)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--policy',required=True); ap.add_argument('--evidence',required=True); ap.add_argument('--result',required=True); a=ap.parse_args()
    p,e,r=load(a.policy),load(a.evidence),load(a.result)
    errors=[]
    if r.get('release_id') != e.get('release_id'): errors.append('release_id mismatch')
    if not r.get('deployment_succeeded',False): errors.append('rollback deployment did not succeed')
    if not r.get('smoke_tests_passed',False): errors.append('post-rollback smoke tests failed')
    if not r.get('data_integrity_passed',False): errors.append('post-rollback data-integrity checks failed')
    metric_map={m.get('name'):m.get('samples',[]) for m in r.get('metrics',[])}
    required_samples=int(p.get('recovery_samples_required',3))
    for name in p.get('required_metrics',[]):
        samples=metric_map.get(name,[])
        if len(samples)<required_samples:
            errors.append(f'{name} has {len(samples)} recovery samples; need {required_samples}'); continue
        threshold=p.get('thresholds',{}).get(name,{})
        recovery=threshold.get('recovery'); direction=threshold.get('direction')
        if recovery is None: continue
        recent=samples[-required_samples:]
        if direction=='max' and any(v>recovery for v in recent): errors.append(f'{name} recovery samples exceed {recovery}: {recent}')
        if direction=='min' and any(v<recovery for v in recent): errors.append(f'{name} recovery samples below {recovery}: {recent}')
    if errors:
        print('\n'.join('FAIL: '+x for x in errors)); return 1
    print(f'PASS: rollback verified for {r.get("release_id")} -> {r.get("target_version")}')
    return 0

if __name__=='__main__': sys.exit(main())
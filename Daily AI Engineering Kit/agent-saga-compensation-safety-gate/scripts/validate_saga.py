#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

EXIT_OK=0; EXIT_POLICY=2; EXIT_INPUT=3

def load(path):
    try: return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as e:
        print(f'input error: {e}', file=sys.stderr); sys.exit(EXIT_INPUT)

def validate(plan):
    errors=[]; ids=set(); side_effect_steps=[]
    if not isinstance(plan, dict): return ['plan must be an object']
    if not plan.get('saga_id'): errors.append('saga_id is required')
    steps=plan.get('steps')
    if not isinstance(steps,list) or not steps: return errors+['steps must be a non-empty array']
    for i,s in enumerate(steps):
        p=f'steps[{i}]'
        if not isinstance(s,dict): errors.append(f'{p} must be an object'); continue
        sid=s.get('id')
        if not sid: errors.append(f'{p}.id is required')
        elif sid in ids: errors.append(f'duplicate step id: {sid}')
        else: ids.add(sid)
        if not s.get('action'): errors.append(f'{p}.action is required')
        if s.get('side_effect'):
            side_effect_steps.append(sid or p)
            if not s.get('idempotency_key'): errors.append(f'{p} side effect requires idempotency_key')
            if not s.get('compensation'): errors.append(f'{p} side effect requires compensation')
    for i,s in enumerate(steps):
        if not isinstance(s,dict): continue
        for dep in s.get('dependencies',[]) or []:
            if dep not in ids: errors.append(f'steps[{i}] references unknown dependency: {dep}')
    return errors

def simulate(plan):
    completed=[]; trace=[]
    for s in plan['steps']:
        trace.append({'step':s['id'],'event':'execute'})
        completed.append(s)
    for s in reversed(completed):
        if s.get('side_effect'):
            trace.append({'step':s['id'],'event':'compensate','action':s.get('compensation')})
    return trace

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('plan'); ap.add_argument('--simulate',action='store_true'); ap.add_argument('--out')
    a=ap.parse_args(); plan=load(a.plan); errors=validate(plan)
    result={'status':'valid' if not errors else 'blocked','errors':errors}
    if not errors and a.simulate: result['simulation']=simulate(plan)
    text=json.dumps(result,indent=2,sort_keys=True)+'\n'
    if a.out: Path(a.out).write_text(text,encoding='utf-8')
    else: print(text,end='')
    return EXIT_OK if not errors else EXIT_POLICY

if __name__=='__main__': raise SystemExit(main())

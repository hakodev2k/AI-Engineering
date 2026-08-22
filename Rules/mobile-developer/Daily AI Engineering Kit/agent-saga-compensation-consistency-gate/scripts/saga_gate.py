#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None

def load_yaml(path):
    if yaml is None:
        raise RuntimeError('PyYAML is required: pip install pyyaml')
    return yaml.safe_load(Path(path).read_text(encoding='utf-8'))

def evaluate(plan, policy):
    findings=[]; approval=False
    steps=plan.get('steps', [])
    if not plan.get('saga'):
        findings.append('missing saga name')
    if not steps:
        findings.append('no steps defined')
    if len(steps) > int(policy.get('max_steps', 20)):
        findings.append('step count exceeds policy')
    names=set()
    for i,s in enumerate(steps):
        name=s.get('name') or f'index-{i}'
        if name in names: findings.append(f'duplicate step name: {name}')
        names.add(name)
        side=bool(s.get('side_effect'))
        idem=bool(s.get('idempotent'))
        comp=s.get('compensation')
        reason=s.get('non_compensable_reason')
        if side and policy.get('require_idempotency_key', True) and not idem:
            findings.append(f'{name}: side effect is not idempotent')
        if side and policy.get('require_compensation_for_side_effects', True) and not comp and not reason:
            findings.append(f'{name}: missing compensation or non-compensable reason')
        if s.get('approval_required'): approval=True
    status='block' if findings else ('needs-approval' if approval else 'pass')
    return {
        'status': status,
        'saga': plan.get('saga',''),
        'steps': steps,
        'findings': findings,
        'verification': {'executed': True, 'verified': status=='pass', 'evidence': plan.get('evidence', [])}
    }

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--input', required=True)
    ap.add_argument('--policy', required=True)
    ap.add_argument('--output')
    args=ap.parse_args()
    try:
        plan=json.loads(Path(args.input).read_text(encoding='utf-8'))
        policy=load_yaml(args.policy)
        result=evaluate(plan, policy)
        text=json.dumps(result, indent=2)
        if args.output: Path(args.output).write_text(text+'\n', encoding='utf-8')
        print(text)
        return 0 if result['status'] in ('pass','needs-approval') else 2
    except Exception as e:
        print(f'gate error: {e}', file=sys.stderr); return 3

if __name__=='__main__':
    raise SystemExit(main())

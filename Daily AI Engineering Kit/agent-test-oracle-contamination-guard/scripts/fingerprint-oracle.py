#!/usr/bin/env python3
import argparse, hashlib, json, pathlib, sys

def load(path):
    try:
        return json.loads(pathlib.Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        print(f'invalid-json:{path}:{exc}', file=sys.stderr)
        raise SystemExit(2)

def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False)

def sha(value):
    return hashlib.sha256(canonical(value).encode('utf-8')).hexdigest()

p=argparse.ArgumentParser()
p.add_argument('--claims', required=True)
p.add_argument('--policy', required=True)
p.add_argument('--output')
a=p.parse_args()
claims=load(a.claims)
policy=load(a.policy)
if not isinstance(claims, list):
    print('claims-must-be-array', file=sys.stderr); raise SystemExit(2)
result={
    'oracle_fingerprint': sha({'claims': claims, 'policy': policy}),
    'policy_fingerprint': sha(policy),
    'claim_count': len(claims)
}
text=json.dumps(result, indent=2, ensure_ascii=False)+'\n'
if a.output: pathlib.Path(a.output).write_text(text, encoding='utf-8')
print(text, end='')

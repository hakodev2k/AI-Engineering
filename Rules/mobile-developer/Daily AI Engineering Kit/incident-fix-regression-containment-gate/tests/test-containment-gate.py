#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PY = sys.executable


def run(*args, expected=0):
    p = subprocess.run([PY, *map(str, args)], cwd=ROOT, text=True, capture_output=True)
    if p.returncode != expected:
        raise AssertionError(f'expected {expected}, got {p.returncode}\nstdout={p.stdout}\nstderr={p.stderr}')
    return p


def write(path, data):
    path.write_text(json.dumps(data, indent=2), encoding='utf-8')


def main():
    with tempfile.TemporaryDirectory() as td:
        t = Path(td)
        plan = json.loads((ROOT/'templates/hotfix-plan.example.json').read_text(encoding='utf-8'))
        plan['approval_granted'] = True
        plan_path = t/'plan.json'; write(plan_path, plan)
        run('scripts/validate-hotfix-plan.py','--plan',plan_path,'--policy','config/containment-policy.json')

        changed = t/'changed.txt'
        changed.write_text('src/payments/payment-response-mapper.cs\ntests/payments/payment-response-mapper-tests.cs\n', encoding='utf-8')
        diff = t/'diff.json'
        run('scripts/inspect-hotfix-diff.py','--plan',plan_path,'--changed-files',changed,'--output',diff)

        example = json.loads((ROOT/'examples/verified-run.example.json').read_text(encoding='utf-8'))
        verification = t/'verification.json'; review = t/'review.json'; result = t/'result.json'
        write(verification, example['verification']); write(review, example['review'])
        run('scripts/evaluate-containment-gate.py','--plan',plan_path,'--diff',diff,'--verification',verification,'--review',review,'--policy','config/containment-policy.json','--output',result)
        assert json.loads(result.read_text())['status'] == 'verified'

        plan['approval_granted'] = False; write(plan_path, plan)
        run('scripts/evaluate-containment-gate.py','--plan',plan_path,'--diff',diff,'--verification',verification,'--review',review,'--policy','config/containment-policy.json','--output',result, expected=6)
        assert json.loads(result.read_text())['status'] == 'human-approval-required'

        changed.write_text('src/auth/auth-service.cs\n', encoding='utf-8')
        run('scripts/inspect-hotfix-diff.py','--plan',plan_path,'--changed-files',changed,'--output',diff, expected=4)
        plan['approval_granted'] = True; write(plan_path, plan)
        run('scripts/evaluate-containment-gate.py','--plan',plan_path,'--diff',diff,'--verification',verification,'--review',review,'--policy','config/containment-policy.json','--output',result, expected=5)
        assert json.loads(result.read_text())['status'] == 'blocked'

    print('containment gate smoke test passed')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load_policy(path: Path):
    text = path.read_text(encoding='utf-8')
    data = {}
    stack = [(-1, data)]
    for raw in text.splitlines():
        if not raw.strip() or raw.lstrip().startswith('#'): continue
        indent = len(raw) - len(raw.lstrip())
        key, _, value = raw.strip().partition(':')
        while stack[-1][0] >= indent: stack.pop()
        parent = stack[-1][1]
        if value.strip() == '':
            parent[key] = {}
            stack.append((indent, parent[key]))
        else:
            v = value.strip()
            if v.lower() in ('true','false'): v = v.lower() == 'true'
            else:
                try: v = float(v) if '.' in v else int(v)
                except ValueError: v = v.strip('"\'')
            parent[key] = v
    return data


def main():
    p=argparse.ArgumentParser(description='Enforce per-task token budgets from deterministic usage input.')
    p.add_argument('--policy', required=True)
    p.add_argument('--usage', required=True, help='JSON with task_input_tokens, planning_tokens, execution_context_tokens, verifier_tokens')
    p.add_argument('--out', required=True)
    a=p.parse_args()
    policy=load_policy(Path(a.policy)); usage=json.loads(Path(a.usage).read_text(encoding='utf-8'))
    required=['task_input_tokens','planning_tokens','execution_context_tokens','verifier_tokens']
    if any(k not in usage or not isinstance(usage[k], int) or usage[k] < 0 for k in required):
        print('invalid usage input', file=sys.stderr); return 2
    limits=policy['limits']; findings=[]
    total=sum(usage[k] for k in required); budget=int(limits['total_task_tokens'])
    for k in required:
        if usage[k] > int(limits[k]):
            findings.append({'category':'stage-budget','message':f'{k} exceeds {limits[k]}','evidence':f'actual={usage[k]}'})
    ratio=total/budget
    warn=float(policy['thresholds']['warn_ratio']); block=float(policy['thresholds']['block_ratio'])
    status='block' if ratio >= block or findings else ('warn' if ratio >= warn else 'pass')
    report={'status':status,'total_tokens':total,'budget':budget,'ratio':round(ratio,4),'findings':findings,'verification':{'policy_loaded':True,'inputs_valid':True,'budget_checked':True}}
    Path(a.out).write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report))
    return 3 if status=='block' else 0

if __name__=='__main__': raise SystemExit(main())

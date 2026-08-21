#!/usr/bin/env python3
import argparse, hashlib, json, pathlib, sys

def load(path):
    try:
        data=json.loads(pathlib.Path(path).read_text(encoding='utf-8'))
        if not isinstance(data,dict): raise ValueError('root must be object')
        return data
    except Exception as e:
        print(f'input error: {e}', file=sys.stderr); sys.exit(2)

def digest(obj):
    raw=json.dumps(obj,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()

p=argparse.ArgumentParser(); p.add_argument('plan'); p.add_argument('--output'); a=p.parse_args()
plan=load(a.plan)
fp=digest(plan)
out={'workflow_id':plan.get('workflow_id'),'plan_fingerprint':fp}
text=json.dumps(out,indent=2)+'\n'
if a.output: pathlib.Path(a.output).write_text(text,encoding='utf-8')
print(text,end='')

#!/usr/bin/env python3
import argparse, json, pathlib, sys

def main():
    p=argparse.ArgumentParser(description='Verify agent lineage and immutable policy hash coverage.')
    p.add_argument('lineage')
    p.add_argument('--expected-policy-sha256', required=True)
    a=p.parse_args()
    try:
        data=json.loads(pathlib.Path(a.lineage).read_text(encoding='utf-8'))
    except Exception as e:
        print(f'invalid lineage file: {e}', file=sys.stderr); return 2
    if not isinstance(data,list) or not data:
        print('lineage must be a non-empty JSON array', file=sys.stderr); return 2
    ids=set(); errors=[]
    for i,x in enumerate(data):
        if not isinstance(x,dict): errors.append(f'item {i}: not object'); continue
        aid=x.get('actor_id'); parent=x.get('parent_actor_id'); root=x.get('root_actor_id'); ph=x.get('policy_hash')
        if not aid: errors.append(f'item {i}: missing actor_id')
        elif aid in ids: errors.append(f'item {i}: duplicate actor_id {aid}')
        else: ids.add(aid)
        if not root: errors.append(f'item {i}: missing root_actor_id')
        if ph != a.expected_policy_sha256: errors.append(f'item {i}: policy hash mismatch')
        if i>0 and not parent: errors.append(f'item {i}: missing parent_actor_id')
    for i,x in enumerate(data[1:], start=1):
        if isinstance(x,dict) and x.get('parent_actor_id') not in ids:
            errors.append(f'item {i}: unknown parent_actor_id')
    if errors:
        print(json.dumps({'status':'BLOCK','errors':errors}, indent=2)); return 3
    print(json.dumps({'status':'PASS','actors':len(data),'policy_hash':a.expected_policy_sha256}, indent=2)); return 0

if __name__=='__main__':
    raise SystemExit(main())

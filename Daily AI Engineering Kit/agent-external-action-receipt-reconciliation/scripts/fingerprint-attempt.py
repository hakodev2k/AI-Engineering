#!/usr/bin/env python3
import argparse, hashlib, json, sys

def load(path):
    with open(path, 'r', encoding='utf-8') as f: return json.load(f)

def canonical(data):
    keep = {k: data.get(k) for k in [
        'version','attempt_id','task_id','action_name','risk','target_system','target_resource',
        'idempotency_key','request_fingerprint','dangerous_action','approval_fingerprint'
    ]}
    return json.dumps(keep, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()

def main():
    p=argparse.ArgumentParser(); p.add_argument('attempt'); p.add_argument('--output'); a=p.parse_args()
    try:
        fp=hashlib.sha256(canonical(load(a.attempt))).hexdigest(); out={'attempt_fingerprint':fp}
        text=json.dumps(out, indent=2)
        if a.output: open(a.output,'w',encoding='utf-8').write(text+'\n')
        else: print(text)
        return 0
    except Exception as e:
        print(json.dumps({'error':str(e)}), file=sys.stderr); return 1
if __name__=='__main__': raise SystemExit(main())

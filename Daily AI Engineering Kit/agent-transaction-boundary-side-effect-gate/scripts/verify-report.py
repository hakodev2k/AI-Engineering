#!/usr/bin/env python3
import argparse,json,pathlib,sys
ap=argparse.ArgumentParser(); ap.add_argument('report'); ap.add_argument('--allow-findings',action='store_true'); a=ap.parse_args()
p=pathlib.Path(a.report)
if not p.is_file(): print('report missing',file=sys.stderr); sys.exit(2)
try: d=json.loads(p.read_text())
except Exception as e: print(f'invalid json: {e}',file=sys.stderr); sys.exit(2)
if d.get('status') not in ('clear','findings','verified'): print('invalid status',file=sys.stderr); sys.exit(2)
fs=d.get('findings',[])
for f in fs:
    for k in ('file','side_effect_line','transaction_line','severity','evidence'):
        if k not in f: print(f'missing {k}',file=sys.stderr); sys.exit(2)
if fs and not a.allow_findings: print(f'{len(fs)} finding(s) require review',file=sys.stderr); sys.exit(1)
print(f'valid report: {len(fs)} finding(s)')

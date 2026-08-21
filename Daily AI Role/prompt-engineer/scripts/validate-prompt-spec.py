#!/usr/bin/env python3
import json,sys

def fail(msg,code=1):
 print(f"ERROR: {msg}",file=sys.stderr); raise SystemExit(code)
if len(sys.argv)!=2: fail("usage: validate-prompt-spec.py <spec.json>",2)
try:
 d=json.load(open(sys.argv[1],encoding='utf-8'))
except (OSError,json.JSONDecodeError) as e: fail(str(e),2)
req=['id','objective','inputs','required_output','constraints','acceptance']
missing=[k for k in req if k not in d]
if missing: fail('missing: '+', '.join(missing))
if not isinstance(d['inputs'],list) or not isinstance(d['required_output'],list) or not d['required_output']: fail('inputs/required_output invalid')
a=d['acceptance']
for k in ('overall_pass_rate','critical_pass_rate'):
 if k not in a or not isinstance(a[k],(int,float)) or not 0<=a[k]<=1: fail(f'acceptance.{k} must be 0..1')
print('OK: prompt spec valid')

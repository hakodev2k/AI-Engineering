#!/usr/bin/env python3
import argparse,json,sys
from pathlib import Path
REQUIRED={'id':str,'passed':bool,'score':(int,float),'latency_ms':(int,float),'cost_usd':(int,float),'evidence':str}
def main():
 p=argparse.ArgumentParser(); p.add_argument('file'); p.add_argument('--required',nargs='*',default=[]); a=p.parse_args()
 try:d=json.loads(Path(a.file).read_text(encoding='utf-8'))
 except Exception as e: print(f'invalid json: {e}',file=sys.stderr); return 2
 errs=[]
 if not isinstance(d.get('model'),str) or not d['model'].strip(): errs.append('model missing')
 ss=d.get('scenarios');
 if not isinstance(ss,list) or not ss: errs.append('scenarios must be non-empty'); ss=[]
 ids=[]
 for i,s in enumerate(ss):
  if not isinstance(s,dict): errs.append(f'scenario[{i}] not object'); continue
  for k,t in REQUIRED.items():
   if k not in s or not isinstance(s[k],t): errs.append(f'scenario[{i}].{k} invalid')
  if isinstance(s.get('score'),(int,float)) and not 0<=s['score']<=1: errs.append(f'scenario[{i}].score out of range')
  ids.append(s.get('id'))
 if len(ids)!=len(set(ids)): errs.append('duplicate scenario id')
 for r in a.required:
  if r not in ids: errs.append(f'missing required scenario: {r}')
 if errs:
  print('\n'.join(errs),file=sys.stderr); return 2
 print(f'valid: {a.file} ({len(ss)} scenarios)'); return 0
if __name__=='__main__': sys.exit(main())

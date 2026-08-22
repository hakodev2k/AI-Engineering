#!/usr/bin/env python3
import argparse,json,re,sys
from pathlib import Path
PAT=re.compile(r'^[A-Za-z0-9_.-]+$')
def main():
 p=argparse.ArgumentParser();p.add_argument('inventory',type=Path);p.add_argument('--max-name-length',type=int,default=128);a=p.parse_args()
 try:data=json.loads(a.inventory.read_text());assert isinstance(data,list)
 except Exception as e: print(json.dumps({'decision':'invalid','error':str(e)}));return 2
 seen_c={}; seen_m={}; out=[]; problems=[]
 for i,r in enumerate(data):
  try:
   s=str(r['server_instance']);ns=str(r.get('namespace',''));n=str(r['name']);call=str(r['callable_id']);ap=str(r['approval_key'])
  except KeyError as e: problems.append(f'row {i} missing {e.args[0]}');continue
  cid=f'{s}::{ns}::{n}'; model=n
  if model in seen_m: model=f'{s}.{ns}.{n}' if ns else f'{s}.{n}'
  if len(model)>a.max_name_length or not PAT.match(model): problems.append(f'row {i} invalid exposed name {model}')
  if cid in seen_c and seen_c[cid]!=call: problems.append(f'canonical identity {cid} maps to multiple callables')
  if model in seen_m: problems.append(f'unresolved model-visible collision {model}')
  seen_c[cid]=call;seen_m[model]=cid
  if ap!=cid: problems.append(f'approval key mismatch for {cid}')
  out.append({'canonical_id':cid,'model_name':model,'callable_id':call,'approval_key':ap})
 report={'decision':'deny' if problems else 'allow','problems':problems,'map':out,'metrics':{'tools':len(out),'unresolved_collisions':len(problems)}}
 print(json.dumps(report,indent=2));return 5 if problems else 0
if __name__=='__main__':raise SystemExit(main())

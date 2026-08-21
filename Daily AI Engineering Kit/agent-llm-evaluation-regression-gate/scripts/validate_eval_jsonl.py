#!/usr/bin/env python3
import argparse,json,sys

def main():
 p=argparse.ArgumentParser();p.add_argument('file');p.add_argument('--required',nargs='*',default=['correctness','safety']);a=p.parse_args();seen=set();errors=[]
 try:
  for n,line in enumerate(open(a.file,encoding='utf-8'),1):
   if not line.strip():continue
   try:r=json.loads(line)
   except Exception as e: errors.append(f'line {n}: invalid JSON: {e}');continue
   cid=r.get('case_id');
   if not cid: errors.append(f'line {n}: missing case_id')
   elif cid in seen: errors.append(f'line {n}: duplicate case_id {cid}')
   else: seen.add(cid)
   if r.get('status') not in ('pass','fail','error'): errors.append(f'line {n}: invalid status')
   dims=r.get('dimensions',{})
   for d in a.required:
    if d not in dims: errors.append(f'line {n}: missing dimension {d}')
   for k,v in dims.items():
    if not isinstance(v,(int,float)) or not 0<=v<=1: errors.append(f'line {n}: {k} outside 0..1')
 except OSError as e: errors.append(str(e))
 if errors:
  print('\n'.join(errors),file=sys.stderr);return 2
 print(f'valid: {len(seen)} cases');return 0
if __name__=='__main__':sys.exit(main())

#!/usr/bin/env python3
import json, pathlib, sys
REQ={'status','job','findings','verification','remaining_risks'}; VREQ={'duplicate_delivery_tested','retry_tested','effect_count_verified'}
def main():
 if len(sys.argv)!=2: print('usage: validate-assessment.py assessment.json',file=sys.stderr); return 2
 try: d=json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
 except Exception as e: print(f'invalid json: {e}',file=sys.stderr); return 2
 errors=[]
 errors += [f'missing {x}' for x in sorted(REQ-set(d))]
 if d.get('status') not in {'pass','fail','blocked','needs-approval'}: errors.append('invalid status')
 v=d.get('verification',{})
 errors += [f'missing verification.{x}' for x in sorted(VREQ-set(v))]
 for i,f in enumerate(d.get('findings',[])):
  for k in ('finding','evidence','risk','recommendation'):
   if k not in f: errors.append(f'findings[{i}] missing {k}')
 if d.get('status')=='pass' and not all(v.get(x) is True for x in VREQ): errors.append('pass requires all verification flags true')
 if errors:
  print('\n'.join(errors),file=sys.stderr); return 1
 print('assessment valid'); return 0
if __name__=='__main__': raise SystemExit(main())

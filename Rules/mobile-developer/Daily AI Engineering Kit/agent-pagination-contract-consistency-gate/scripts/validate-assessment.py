#!/usr/bin/env python3
import json, pathlib, sys
REQ={'status','endpoint','pagination_style','findings','verification','remaining_risks'}
VREQ={'stable_order_verified','duplicate_gap_tested','boundary_pages_tested','contract_compatible'}
def main():
 if len(sys.argv)!=2: print('usage: validate-assessment.py assessment.json',file=sys.stderr); return 2
 try: d=json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
 except Exception as e: print(f'invalid json: {e}',file=sys.stderr); return 2
 errors=[]
 errors += [f'missing {x}' for x in sorted(REQ-set(d))]
 if d.get('status') not in {'pass','fail','blocked','needs-approval'}: errors.append('invalid status')
 if d.get('pagination_style') not in {'cursor','offset','keyset','unknown'}: errors.append('invalid pagination_style')
 v=d.get('verification',{})
 errors += [f'missing verification.{x}' for x in sorted(VREQ-set(v))]
 if d.get('status')=='pass' and not all(v.get(x) is True for x in VREQ): errors.append('pass requires all verification flags true')
 for i,f in enumerate(d.get('findings',[])):
  for k in ('finding','evidence','risk','recommendation'):
   if k not in f: errors.append(f'findings[{i}] missing {k}')
 if errors: print('\n'.join(errors),file=sys.stderr); return 1
 print('assessment valid'); return 0
if __name__=='__main__': raise SystemExit(main())

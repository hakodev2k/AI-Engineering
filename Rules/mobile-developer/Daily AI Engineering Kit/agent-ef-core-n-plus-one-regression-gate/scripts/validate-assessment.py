#!/usr/bin/env python3
import json, pathlib, sys
REQ={'status','target','findings','metrics','verification','remaining_risks'}
def main():
 if len(sys.argv)!=2: print('usage: validate-assessment.py assessment.json',file=sys.stderr); return 2
 try: d=json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
 except Exception as e: print(f'invalid json: {e}',file=sys.stderr); return 2
 errors=[f'missing {k}' for k in sorted(REQ-set(d))]
 if d.get('status') not in {'pass','fail','blocked','needs-approval'}: errors.append('invalid status')
 m=d.get('metrics',{}); v=d.get('verification',{})
 for k in ('baseline_query_count','changed_query_count','result_equivalent'):
  if k not in m: errors.append(f'missing metrics.{k}')
 for k in ('focused_tests_passed','query_count_verified','diff_reviewed'):
  if k not in v: errors.append(f'missing verification.{k}')
 if d.get('status')=='pass':
  if not m.get('result_equivalent'): errors.append('pass requires result equivalence')
  if not all(v.get(k) is True for k in ('focused_tests_passed','query_count_verified','diff_reviewed')): errors.append('pass requires all verification flags true')
  if isinstance(m.get('baseline_query_count'),int) and isinstance(m.get('changed_query_count'),int) and m['changed_query_count']>m['baseline_query_count']: errors.append('pass cannot increase query count')
 for i,f in enumerate(d.get('findings',[])):
  for k in ('finding','evidence','risk','recommendation'):
   if k not in f: errors.append(f'findings[{i}] missing {k}')
 if errors: print('\n'.join(errors),file=sys.stderr); return 1
 print('assessment valid'); return 0
if __name__=='__main__': raise SystemExit(main())

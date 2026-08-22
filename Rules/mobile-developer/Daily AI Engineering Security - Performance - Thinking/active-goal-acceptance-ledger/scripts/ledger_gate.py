#!/usr/bin/env python3
import argparse, json, sys
VALID={'open','in_progress','evidence_ready','verified','blocked','superseded'}
def main():
 p=argparse.ArgumentParser(); p.add_argument('ledger'); a=p.parse_args()
 try: d=json.load(open(a.ledger,encoding='utf-8'))
 except Exception as e: print(f'invalid ledger: {e}',file=sys.stderr); return 2
 if not d.get('goal_id') or not isinstance(d.get('criteria'),list) or not d['criteria']:
  print('missing goal_id/criteria',file=sys.stderr); return 2
 seen=set(); blocking=[]
 for c in d['criteria']:
  cid=c.get('id'); st=c.get('status'); req=c.get('required',True)
  if not cid or cid in seen or st not in VALID: print('invalid criterion',file=sys.stderr); return 2
  seen.add(cid)
  if req and st=='verified' and not c.get('evidence'): blocking.append(f'{cid}:verified_without_evidence')
  elif req and st not in {'verified','superseded'}: blocking.append(f'{cid}:{st}')
 print(json.dumps({'goal_id':d['goal_id'],'criterion_count':len(seen),'blocking':blocking,'can_finalize':not blocking},indent=2))
 return 0 if not blocking else 3
if __name__=='__main__': raise SystemExit(main())

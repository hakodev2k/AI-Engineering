#!/usr/bin/env python3
import argparse,json,sys

def main():
 p=argparse.ArgumentParser(); p.add_argument('current'); p.add_argument('--previous'); p.add_argument('--policy',required=True); p.add_argument('--output'); a=p.parse_args()
 try:
  cur=json.load(open(a.current,encoding='utf-8')); pol=json.load(open(a.policy,encoding='utf-8')); prev=json.load(open(a.previous,encoding='utf-8')) if a.previous else None
 except Exception as e: print(f'load failed: {e}',file=sys.stderr); return 2
 reasons=[]; status='continue'
 if cur.get('round',0)>pol.get('max_rounds',3): status='human-decision-required'; reasons.append('max rounds exceeded')
 if prev and cur.get('evidence_fingerprint')==prev.get('evidence_fingerprint'):
  status='human-decision-required'; reasons.append('no evidence progress since previous round')
 if cur.get('round',1)>1 and pol.get('require_evidence_delta_after_first_round',True) and not cur.get('new_evidence_ids'):
  status='human-decision-required'; reasons.append('missing evidence delta')
 if cur.get('status') in {'resolved','blocked','human-decision-required'}: status=cur['status']
 out={'disagreement_id':cur.get('disagreement_id'),'status':status,'reasons':reasons,'round':cur.get('round')}
 text=json.dumps(out,indent=2)
 if a.output: open(a.output,'w',encoding='utf-8').write(text+'\n')
 else: print(text)
 return 1 if status in {'blocked','human-decision-required'} else 0
if __name__=='__main__': raise SystemExit(main())

#!/usr/bin/env python3
import argparse,hashlib,json,sys

def canonical(d):
 x=dict(d); x.pop('resolution',None); return json.dumps(x,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
def main():
 p=argparse.ArgumentParser(); p.add_argument('disagreement'); p.add_argument('--review'); p.add_argument('--policy',required=True); p.add_argument('--planner'); p.add_argument('--output'); a=p.parse_args()
 try:d=json.load(open(a.disagreement,encoding='utf-8')); pol=json.load(open(a.policy,encoding='utf-8')); review=json.load(open(a.review,encoding='utf-8')) if a.review else None
 except Exception as e: print(f'load failed: {e}',file=sys.stderr); return 2
 reasons=[]; status='verified'
 if d.get('status')!='resolved': status='blocked'; reasons.append('disagreement is not resolved')
 risk=d.get('risk')
 fp=hashlib.sha256(canonical(d)).hexdigest()
 if risk in set(pol.get('high_risk_levels',[])):
  if not review: status='review-required'; reasons.append('independent review required')
  else:
   if review.get('disagreement_fingerprint')!=fp: status='blocked'; reasons.append('stale review fingerprint')
   if a.planner and review.get('reviewer')==a.planner: status='blocked'; reasons.append('high-risk self-review forbidden')
   if review.get('decision')!='approved': status='human-decision-required' if review.get('decision')=='human-decision-required' else 'blocked'; reasons.append('review not approved')
 res=d.get('resolution') or {}
 if d.get('status')=='resolved' and res.get('mode') not in set(pol.get('allowed_resolution_modes',[])): status='blocked'; reasons.append('invalid resolution mode')
 if d.get('status')=='resolved' and not res.get('reason'): status='blocked'; reasons.append('resolution reason required')
 out={'disagreement_id':d.get('disagreement_id'),'status':status,'reasons':reasons,'fingerprint':fp}
 text=json.dumps(out,indent=2)
 if a.output: open(a.output,'w',encoding='utf-8').write(text+'\n')
 else: print(text)
 return 0 if status=='verified' else 1
if __name__=='__main__': raise SystemExit(main())

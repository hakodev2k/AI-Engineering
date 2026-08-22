#!/usr/bin/env python3
import argparse,json,re,sys

def main():
 p=argparse.ArgumentParser(); p.add_argument('input'); a=p.parse_args()
 try:d=json.load(open(a.input,encoding='utf-8'))
 except Exception as e: print(f'invalid json: {e}',file=sys.stderr); return 2
 errors=[]
 for k in ['disagreement_id','subject','risk','round','participants','positions','evidence_fingerprint','status']:
  if k not in d: errors.append(f'missing {k}')
 if d.get('risk') not in {'low','medium','high','critical'}: errors.append('invalid risk')
 if not isinstance(d.get('round'),int) or d.get('round',0)<1: errors.append('round must be >=1')
 ps=d.get('participants',[])
 if len(set(ps))<2: errors.append('at least two unique participants required')
 pos=d.get('positions',[])
 agents=[x.get('agent') for x in pos if isinstance(x,dict)]
 if len(pos)<2 or not set(agents).issubset(set(ps)): errors.append('positions must map to participants')
 fp=d.get('evidence_fingerprint','')
 if not re.fullmatch(r'[0-9a-f]{64}',fp): errors.append('invalid evidence_fingerprint')
 if d.get('round',1)>1 and not d.get('new_evidence_ids'): errors.append('round >1 requires evidence delta')
 if errors:
  print(json.dumps({'status':'blocked','errors':errors},indent=2)); return 1
 print(json.dumps({'status':'valid','disagreement_id':d['disagreement_id']},indent=2)); return 0
if __name__=='__main__': raise SystemExit(main())

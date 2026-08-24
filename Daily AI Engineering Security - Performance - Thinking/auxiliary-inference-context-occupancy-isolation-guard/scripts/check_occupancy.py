#!/usr/bin/env python3
import argparse,json,sys
from pathlib import Path

def check(t,p):
 b=int(t['parent_occupancy_before']); a=int(t['parent_occupancy_after']); d=int(t.get('parent_transcript_delta_tokens',0)); aux=int(t.get('auxiliary_usage_tokens',0))
 if min(b,a,d,aux)<0: raise ValueError('token values must be non-negative')
 expected=b+d; drift=abs(a-expected)/max(expected,1); reasons=[]
 if drift>float(p.get('max_occupancy_drift_ratio',.03)): reasons.append('parent occupancy changed beyond transcript delta tolerance')
 if p.get('require_parent_delta_for_growth',True) and d==0 and a>b and aux>0: reasons.append('auxiliary call increased parent occupancy without parent transcript growth')
 return {'expected_parent_occupancy':expected,'observed_parent_occupancy':a,'auxiliary_usage_tokens':aux,'occupancy_drift_ratio':drift,'verified':not reasons,'reasons':reasons}
def load(x):
 try:return json.loads(Path(x).read_text(encoding='utf-8'))
 except Exception as e: raise ValueError(str(e))
def main():
 ap=argparse.ArgumentParser();ap.add_argument('trace');ap.add_argument('--policy',required=True);a=ap.parse_args()
 try:
  r=check(load(a.trace),load(a.policy));print(json.dumps(r,indent=2));return 0 if r['verified'] else 2
 except (ValueError,KeyError,TypeError) as e: print(f'check_occupancy: {e}',file=sys.stderr);return 3
if __name__=='__main__':raise SystemExit(main())
#!/usr/bin/env python3
import argparse,json,math,statistics,sys
from pathlib import Path
def load(path):
 gaps=[]
 try:
  for line in Path(path).read_text(encoding='utf-8').splitlines():
   if line.strip():
    g=json.loads(line).get('gap_ms')
    if isinstance(g,(int,float)) and math.isfinite(g) and g>=0: gaps.append(float(g))
 except (OSError,json.JSONDecodeError) as e: raise ValueError(f'{path}: {e}')
 return gaps
def pct(xs,p):
 ys=sorted(xs); k=(len(ys)-1)*p/100; lo=math.floor(k); hi=math.ceil(k); return ys[lo] if lo==hi else ys[lo]*(hi-k)+ys[hi]*(k-lo)
def summary(g):
 n=len(g); return {'events':n,'mean_gap_ms':statistics.fmean(g) if g else None,'p95_gap_ms':pct(g,95) if g else None,'p99_gap_ms':pct(g,99) if g else None,'max_gap_ms':max(g) if g else None,'over_8ms_rate':sum(x>8 for x in g)/n if n else None,'over_16ms_rate':sum(x>16 for x in g)/n if n else None,'over_32ms_rate':sum(x>32 for x in g)/n if n else None,'over_64ms_rate':sum(x>64 for x in g)/n if n else None}
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('affected'); ap.add_argument('--baseline'); ap.add_argument('--thresholds',default=str(Path(__file__).resolve().parents[1]/'config/thresholds.json')); a=ap.parse_args()
 try: th=json.loads(Path(a.thresholds).read_text()); af=summary(load(a.affected)); b=summary(load(a.baseline)) if a.baseline else None
 except (OSError,json.JSONDecodeError,ValueError) as e: print(f'error: {e}',file=sys.stderr); return 2
 reasons=[]
 if af['events']<int(th.get('min_events',100)): reasons.append('insufficient_affected_events')
 if af['max_gap_ms'] is not None and af['max_gap_ms']>float(th['max_gap_ms']): reasons.append('max_gap')
 if af['over_16ms_rate'] is not None and af['over_16ms_rate']>float(th['max_gap_over_16ms_rate']): reasons.append('over_16ms_rate')
 ratio=None
 if b:
  if b['events']<int(th.get('min_events',100)): reasons.append('insufficient_baseline_events')
  br=b['over_16ms_rate'] or 0.0; ar=af['over_16ms_rate'] or 0.0; ratio=ar/br if br>0 else (float('inf') if ar>0 else 1.0)
  if ratio>float(th['max_regression_ratio']): reasons.append('regression_ratio')
 elif th.get('require_ab_pair',True): reasons.append('baseline_required')
 report={'decision':'fail' if reasons else 'pass','reasons':reasons,'affected':af,'baseline':b,'over_16ms_rate_ratio':ratio}; print(json.dumps(report,indent=2)); return 10 if reasons else 0
if __name__=='__main__': raise SystemExit(main())

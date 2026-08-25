#!/usr/bin/env python3
import argparse,csv,json,math,sys

def percentile(xs,q):
    if not xs: raise ValueError("no samples")
    ys=sorted(xs); i=(len(ys)-1)*q; lo=math.floor(i); hi=math.ceil(i)
    return ys[lo] if lo==hi else ys[lo]*(hi-i)+ys[hi]*(i-lo)

def main():
    p=argparse.ArgumentParser(); p.add_argument("csv_file"); p.add_argument("--column",default="gap_s"); p.add_argument("--min-samples",type=int,default=20); a=p.parse_args()
    try:
        with open(a.csv_file,newline="",encoding="utf-8") as f:
            rows=list(csv.DictReader(f)); vals=[float(r[a.column]) for r in rows if r.get(a.column) not in (None,"")]
        if len(vals)<a.min_samples: raise ValueError(f"need at least {a.min_samples} samples; got {len(vals)}")
        if any(v<0 for v in vals): raise ValueError("gaps must be non-negative")
        print(json.dumps({"samples":len(vals),"p50_gap_s":percentile(vals,.5),"p95_gap_s":percentile(vals,.95),"p99_gap_s":percentile(vals,.99)},indent=2,sort_keys=True)); return 0
    except (OSError,KeyError,ValueError) as e:
        print(str(e),file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())

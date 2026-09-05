#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,math,sys
from pathlib import Path
def main():
    p=argparse.ArgumentParser();p.add_argument("--manifest",required=True);p.add_argument("--vectors",required=True);p.add_argument("--norm-tolerance",type=float,default=0.02);a=p.parse_args()
    try:m=json.loads(Path(a.manifest).read_text());vs=json.loads(Path(a.vectors).read_text())
    except (OSError,json.JSONDecodeError) as e: print(f"input error: {e}",file=sys.stderr);return 2
    if not isinstance(vs,list) or not vs: print("vectors must be non-empty array",file=sys.stderr);return 2
    errors=[]
    for i,v in enumerate(vs):
        if not isinstance(v,list) or any(not isinstance(x,(int,float)) or isinstance(x,bool) for x in v): errors.append(f"vector {i}: non-numeric");continue
        if len(v)!=m.get("dimensions"): errors.append(f"vector {i}: dimension {len(v)} != {m.get('dimensions')}")
        if m.get("normalization")=="unit":
            n=math.sqrt(sum(float(x)*float(x) for x in v))
            if abs(n-1.0)>a.norm_tolerance: errors.append(f"vector {i}: norm {n:.6f} outside tolerance")
    if errors:
        print("\n".join(errors),file=sys.stderr);return 1
    print(f"vector sample check passed: {len(vs)} vector(s)");return 0
if __name__=="__main__":raise SystemExit(main())

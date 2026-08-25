#!/usr/bin/env python3
"""Analyze streamed tool-argument parser traces.

JSONL row schema:
{"buffer_bytes": 1024, "delta_bytes": 20, "parse_us": 350.2, "call_id":"optional"}

The profiler estimates scan amplification as sum(buffer_bytes)/final_buffer_bytes.
This is a proxy for cumulative full-prefix work; it does not assume the parser
actually scanned every byte.
"""
import argparse, json, math, sys

def percentile(values, p):
    if not values:
        return 0.0
    xs = sorted(values)
    if len(xs) == 1:
        return float(xs[0])
    pos = (len(xs)-1) * p
    lo, hi = int(math.floor(pos)), int(math.ceil(pos))
    if lo == hi:
        return float(xs[lo])
    return xs[lo] + (xs[hi]-xs[lo]) * (pos-lo)

def load_trace(path):
    rows=[]
    with open(path, "r", encoding="utf-8") as f:
        for lineno, line in enumerate(f, 1):
            if not line.strip():
                continue
            try:
                row=json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"{path}:{lineno}: invalid JSON: {exc}") from exc
            for key in ("buffer_bytes","delta_bytes","parse_us"):
                if key not in row or not isinstance(row[key], (int,float)) or row[key] < 0:
                    raise ValueError(f"{path}:{lineno}: {key} must be a non-negative number")
            rows.append(row)
    if not rows:
        raise ValueError(f"{path}: empty trace")
    prev=-1
    for i,row in enumerate(rows,1):
        if row["buffer_bytes"] < prev:
            raise ValueError(f"{path}:{i}: buffer_bytes must be non-decreasing")
        prev=row["buffer_bytes"]
    if rows[-1]["buffer_bytes"] <= 0:
        raise ValueError(f"{path}: final buffer must be > 0")
    return rows

def profile(rows):
    final_bytes=float(rows[-1]["buffer_bytes"])
    parse=[float(r["parse_us"]) for r in rows]
    total_parse=sum(parse)
    return {
        "chunks": len(rows),
        "final_bytes": final_bytes,
        "total_delta_bytes": sum(float(r["delta_bytes"]) for r in rows),
        "total_parse_us": total_parse,
        "p95_parse_us": percentile(parse, 0.95),
        "max_parse_us": max(parse),
        "scan_amplification": sum(float(r["buffer_bytes"]) for r in rows)/final_bytes,
        "parse_us_per_final_kb": total_parse/(final_bytes/1024.0),
    }

def scaling_exponent(points):
    pts=[(x,y) for x,y in points if x>0 and y>0]
    if len(pts)<2:
        return None
    xs=[math.log(x) for x,_ in pts]
    ys=[math.log(y) for _,y in pts]
    mx=sum(xs)/len(xs); my=sum(ys)/len(ys)
    den=sum((x-mx)**2 for x in xs)
    if den == 0:
        return None
    return sum((x-mx)*(y-my) for x,y in zip(xs,ys))/den

def main():
    p=argparse.ArgumentParser()
    p.add_argument("traces", nargs="+", help="JSONL trace files; multiple files produce a scaling estimate")
    args=p.parse_args()
    try:
        profiles=[]
        for path in args.traces:
            pr=profile(load_trace(path))
            pr["trace"]=path
            profiles.append(pr)
        exp=scaling_exponent([(p["final_bytes"],p["total_parse_us"]) for p in profiles])
        print(json.dumps({"profiles":profiles,"scaling_exponent":exp}, sort_keys=True))
        return 0
    except (OSError, ValueError) as exc:
        print(json.dumps({"error":str(exc)}))
        return 30

if __name__=="__main__":
    sys.exit(main())

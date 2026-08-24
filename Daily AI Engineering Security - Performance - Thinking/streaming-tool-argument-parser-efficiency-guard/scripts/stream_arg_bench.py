#!/usr/bin/env python3
"""Benchmark full-prefix reparsing versus append-once/final-parse for streamed JSON arguments."""
from __future__ import annotations
import argparse, json, statistics, sys, time


def payload(size: int) -> str:
    if size < 64: raise ValueError("size must be >= 64 bytes")
    unit = "αβγXYZ0123456789\\n"
    text = (unit * ((size // len(unit)) + 2))[: max(1, size - 40)]
    return json.dumps({"path":"generated.txt","content":text}, ensure_ascii=False, separators=(",",":"))


def chunks(s: str, chunk_size: int):
    for i in range(0, len(s), chunk_size): yield s[i:i+chunk_size]


def naive_reparse(s: str, chunk_size: int):
    buf = ""
    parsed = None
    for part in chunks(s, chunk_size):
        buf += part
        try: parsed = json.loads(buf)
        except json.JSONDecodeError: pass
    if parsed is None: parsed = json.loads(buf)
    return parsed


def final_parse(s: str, chunk_size: int):
    parts = list(chunks(s, chunk_size))
    return json.loads("".join(parts))


def timed(fn, s, chunk_size, repeats):
    samples=[]; out=None
    for _ in range(repeats):
        t=time.perf_counter_ns(); out=fn(s, chunk_size); samples.append((time.perf_counter_ns()-t)/1e6)
    return statistics.median(samples), out


def run(sizes, chunk_size, repeats):
    rows=[]
    for size in sizes:
        s=payload(size)
        n_ms,n_obj=timed(naive_reparse,s,chunk_size,repeats)
        f_ms,f_obj=timed(final_parse,s,chunk_size,repeats)
        if n_obj != f_obj or f_obj != json.loads(s): raise RuntimeError("semantic mismatch")
        rows.append({"requested_bytes":size,"actual_bytes":len(s.encode()),"chunks":(len(s)+chunk_size-1)//chunk_size,
                     "naive_ms":round(n_ms,4),"final_ms":round(f_ms,4),
                     "naive_ms_per_kb":round(n_ms/max(len(s.encode())/1024,0.001),6),
                     "final_ms_per_kb":round(f_ms/max(len(s.encode())/1024,0.001),6)})
    return rows


def main():
    p=argparse.ArgumentParser(); p.add_argument("--sizes",default="4096,16384,65536,262144")
    p.add_argument("--chunk-size",type=int,default=128); p.add_argument("--repeats",type=int,default=3)
    p.add_argument("--max-final-scaling",type=float,default=6.0,help="max allowed time ratio when largest payload <=4x previous")
    args=p.parse_args()
    try:
        sizes=[int(x) for x in args.sizes.split(",") if x.strip()]
        if len(sizes)<2 or any(x<64 for x in sizes) or args.chunk_size<1 or args.repeats<1: raise ValueError("invalid benchmark arguments")
        rows=run(sizes,args.chunk_size,args.repeats)
    except (ValueError,RuntimeError) as e:
        print(json.dumps({"error":str(e)}),file=sys.stderr); return 2
    violations=[]
    for a,b in zip(rows,rows[1:]):
        byte_ratio=b["actual_bytes"]/a["actual_bytes"]
        time_ratio=b["final_ms"]/max(a["final_ms"],0.0001)
        if byte_ratio <= 4.2 and time_ratio > args.max_final_scaling:
            violations.append({"from":a["actual_bytes"],"to":b["actual_bytes"],"time_ratio":round(time_ratio,3)})
    result={"strategy":"final-parse reference","chunk_size":args.chunk_size,"rows":rows,"scaling_violations":violations,
            "semantic_equivalence":True}
    print(json.dumps(result,indent=2,ensure_ascii=False)); return 1 if violations else 0

if __name__=="__main__": raise SystemExit(main())

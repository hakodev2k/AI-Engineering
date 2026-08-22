#!/usr/bin/env python3
"""Analyze idle-process telemetry against simple resource budgets.

CSV columns: timestamp_s,cpu_seconds,rss_bytes,read_bytes,write_bytes
Rows must be monotonic snapshots from the same process/runtime scope.
"""
from __future__ import annotations
import argparse, csv, json, sys

REQ = ["timestamp_s", "cpu_seconds", "rss_bytes", "read_bytes", "write_bytes"]

def load(path: str):
    rows=[]
    try:
        with open(path, newline="", encoding="utf-8") as f:
            r=csv.DictReader(f)
            if not r.fieldnames or any(k not in r.fieldnames for k in REQ):
                raise ValueError("CSV missing required columns: " + ",".join(REQ))
            for n,row in enumerate(r,2):
                try: rows.append({k: float(row[k]) for k in REQ})
                except ValueError as e: raise ValueError(f"non-numeric value at line {n}") from e
    except OSError as e: raise ValueError(str(e)) from e
    if len(rows)<2: raise ValueError("need at least two samples")
    for a,b in zip(rows, rows[1:]):
        if b["timestamp_s"] <= a["timestamp_s"]: raise ValueError("timestamps must increase")
        if b["cpu_seconds"] < a["cpu_seconds"]: raise ValueError("cpu_seconds must be cumulative")
    return rows

def analyze(rows):
    a,b=rows[0],rows[-1]; wall=b["timestamp_s"]-a["timestamp_s"]
    cpu=b["cpu_seconds"]-a["cpu_seconds"]
    minutes=wall/60.0
    return {"duration_s":wall,"cpu_seconds":cpu,"core_seconds_per_minute":cpu/minutes,
            "rss_growth_mb_per_minute":((b["rss_bytes"]-a["rss_bytes"])/1048576.0)/minutes,
            "io_mb_per_minute":(((b["read_bytes"]-a["read_bytes"])+(b["write_bytes"]-a["write_bytes"]))/1048576.0)/minutes}

def main():
    p=argparse.ArgumentParser(); p.add_argument("csv")
    p.add_argument("--max-core-seconds-per-minute",type=float,required=True)
    p.add_argument("--max-rss-growth-mb-per-minute",type=float,required=True)
    p.add_argument("--max-io-mb-per-minute",type=float,default=float("inf")); a=p.parse_args()
    if min(a.max_core_seconds_per_minute,a.max_rss_growth_mb_per_minute,a.max_io_mb_per_minute) < 0:
        print("budgets must be non-negative",file=sys.stderr); return 2
    try: m=analyze(load(a.csv))
    except ValueError as e: print(str(e),file=sys.stderr); return 2
    breaches=[]
    if m["core_seconds_per_minute"]>a.max_core_seconds_per_minute: breaches.append("cpu")
    if m["rss_growth_mb_per_minute"]>a.max_rss_growth_mb_per_minute: breaches.append("rss")
    if m["io_mb_per_minute"]>a.max_io_mb_per_minute: breaches.append("io")
    m["breaches"]=breaches; m["ok"]=not breaches; print(json.dumps(m,indent=2))
    return 0 if m["ok"] else 3
if __name__=="__main__": raise SystemExit(main())

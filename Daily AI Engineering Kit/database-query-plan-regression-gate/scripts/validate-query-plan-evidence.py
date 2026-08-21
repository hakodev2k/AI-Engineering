#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime

REQ_TOP = ["query_id","engine","captured_at","dataset_profile","source_revision","metrics","operators"]
REQ_METRICS = ["duration_ms","cpu_ms","logical_reads","estimated_rows","actual_rows"]
REQ_OPS = ["full_scan_count","sort_count","hash_count","key_lookup_count","spill_count"]

def fail(msg):
    print(f"INVALID: {msg}", file=sys.stderr); sys.exit(2)

def main():
    p=argparse.ArgumentParser(); p.add_argument("evidence"); a=p.parse_args()
    try:
        data=json.load(open(a.evidence,encoding="utf-8"))
    except Exception as e: fail(f"cannot read JSON: {e}")
    for k in REQ_TOP:
        if k not in data: fail(f"missing {k}")
    if not isinstance(data["query_id"],str) or not data["query_id"].strip(): fail("query_id must be non-empty")
    try:
        dt=datetime.fromisoformat(data["captured_at"].replace("Z","+00:00"))
        if dt.tzinfo is None: fail("captured_at must include timezone")
    except ValueError: fail("captured_at must be ISO-8601")
    for k in REQ_METRICS:
        v=data["metrics"].get(k)
        if not isinstance(v,(int,float)) or v < 0: fail(f"metrics.{k} must be >= 0")
    for k in REQ_OPS:
        v=data["operators"].get(k)
        if not isinstance(v,int) or v < 0: fail(f"operators.{k} must be integer >= 0")
    print("VALID")

if __name__ == "__main__": main()

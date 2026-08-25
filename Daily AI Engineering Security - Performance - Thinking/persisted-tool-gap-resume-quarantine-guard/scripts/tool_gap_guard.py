#!/usr/bin/env python3
"""Detect persisted tool-call/result integrity gaps in JSONL histories."""
import argparse, json, sys
from pathlib import Path

CALL_TYPES={"tool_call","tool_use"}
RESULT_TYPES={"tool_result","tool_output"}

def scan(records):
    calls={}; results={}; duplicates=[]; malformed=[]
    for i,r in enumerate(records,1):
        if not isinstance(r,dict):
            malformed.append({"line":i,"reason":"record_not_object"}); continue
        typ=r.get("type"); tid=r.get("tool_call_id") or r.get("id")
        if typ in CALL_TYPES:
            if not tid: malformed.append({"line":i,"reason":"call_missing_id"}); continue
            if tid in calls: duplicates.append(tid)
            else: calls[tid]=i
        elif typ in RESULT_TYPES:
            if not tid: malformed.append({"line":i,"reason":"result_missing_id"}); continue
            results.setdefault(tid,[]).append(i)
    unresolved=sorted(tid for tid in calls if tid not in results)
    orphan=sorted(tid for tid in results if tid not in calls)
    duplicate_results=sorted(tid for tid,lines in results.items() if len(lines)>1)
    ok=not (unresolved or orphan or duplicates or duplicate_results or malformed)
    return {"status":"verified" if ok else "quarantine","unresolved_calls":unresolved,"orphan_results":orphan,"duplicate_call_ids":sorted(set(duplicates)),"duplicate_result_ids":duplicate_results,"malformed":malformed}

def load_jsonl(path):
    records=[]
    try:
        for n,line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(),1):
            if not line.strip(): continue
            try: records.append(json.loads(line))
            except json.JSONDecodeError as e: raise ValueError(f"line {n}: {e.msg}") from e
    except OSError as e: raise ValueError(str(e)) from e
    return records

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("history"); args=ap.parse_args()
    try:
        report=scan(load_jsonl(args.history)); print(json.dumps(report,sort_keys=True)); return 0 if report["status"]=="verified" else 20
    except ValueError as e:
        print(json.dumps({"status":"invalid","error":str(e)}),file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())

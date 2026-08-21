#!/usr/bin/env python3
"""Analyze JSONL attempt logs for duplicate logical operations.

Expected fields per line: operation_key, tool, attempt_id, provider_executed (bool),
status, latency_ms, optional cost.
Exit 0 on valid input; 2 invalid input; 3 duplicates detected when --fail-on-duplicate.
"""
from __future__ import annotations
import argparse, json, sys
from collections import defaultdict
from pathlib import Path


def main() -> int:
    p=argparse.ArgumentParser(); p.add_argument("jsonl"); p.add_argument("--fail-on-duplicate",action="store_true"); args=p.parse_args()
    groups=defaultdict(list)
    try:
        for n,line in enumerate(Path(args.jsonl).read_text(encoding="utf-8").splitlines(),1):
            if not line.strip(): continue
            item=json.loads(line)
            key=item.get("operation_key")
            if not isinstance(key,str) or not key: raise ValueError(f"line {n}: operation_key required")
            groups[key].append(item)
    except (OSError,json.JSONDecodeError,ValueError) as exc:
        print(json.dumps({"error":str(exc)}),file=sys.stderr); return 2
    duplicate=[]; provider_calls=0; attempts=0
    for key,rows in groups.items():
        executions=sum(1 for r in rows if r.get("provider_executed") is True)
        provider_calls += executions; attempts += len(rows)
        if executions > 1:
            duplicate.append({"operation_key":key,"provider_executions":executions,"attempts":len(rows),"tools":sorted({str(r.get('tool','')) for r in rows})})
    out={"logical_operations":len(groups),"attempts":attempts,"provider_executions":provider_calls,"duplicate_operations":duplicate,"duplicate_operation_count":len(duplicate),"potential_provider_calls_avoidable":sum(x["provider_executions"]-1 for x in duplicate)}
    print(json.dumps(out,indent=2))
    return 3 if args.fail_on_duplicate and duplicate else 0

if __name__=="__main__": raise SystemExit(main())

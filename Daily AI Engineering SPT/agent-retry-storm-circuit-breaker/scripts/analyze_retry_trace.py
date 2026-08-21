#!/usr/bin/env python3
"""Analyze JSONL agent retry traces for amplification and no-progress duplicates.

Expected event fields: timestamp, operation_id(optional), tool, operation_type,
resource, arguments, result_class, progress_marker, estimated_tokens, layer.
Exit codes: 0 success, 3 invalid input, 4 I/O error.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


def canonical_fp(e: dict[str, Any]) -> str:
    obj = {"tool": e.get("tool"), "operation_type": e.get("operation_type"), "resource": e.get("resource"), "arguments": e.get("arguments", {})}
    raw = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()


def main() -> int:
    p = argparse.ArgumentParser(); p.add_argument("trace"); p.add_argument("--output")
    args = p.parse_args()
    try:
        lines = Path(args.trace).read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        print(f"error: {exc}", file=sys.stderr); return 4
    events=[]
    try:
        for i,line in enumerate(lines,1):
            if not line.strip(): continue
            e=json.loads(line); e["_fp"]=canonical_fp(e); e["_line"]=i; events.append(e)
    except json.JSONDecodeError as exc:
        print(f"error: invalid JSONL: {exc}", file=sys.stderr); return 3
    by_fp=defaultdict(list); layers=Counter(); tokens=0
    for e in events:
        by_fp[e["_fp"]].append(e); layers[e.get("layer","unknown")]+=1; tokens += int(e.get("estimated_tokens",0) or 0)
    duplicate_attempts=sum(max(0,len(v)-1) for v in by_fp.values())
    no_progress=0; longest=0
    for seq in by_fp.values():
        streak=0; last_sig=None
        for e in seq:
            sig=(e.get("result_class"), e.get("progress_marker"))
            if sig==last_sig and not e.get("progress_marker"):
                streak+=1; no_progress+=1
            else: streak=0
            longest=max(longest,streak); last_sig=sig
    logical=len(by_fp); physical=len(events)
    report={
        "physical_attempts":physical,
        "logical_operations":logical,
        "retry_amplification_factor": round(physical/logical,3) if logical else 0,
        "duplicate_attempts":duplicate_attempts,
        "no_progress_duplicate_attempts":no_progress,
        "longest_no_progress_repeat_after_first":longest,
        "estimated_tokens":tokens,
        "attempts_by_layer":dict(layers),
        "hotspots":[{"fingerprint":fp,"attempts":len(seq),"tool":seq[0].get("tool"),"operation_type":seq[0].get("operation_type"),"resource":seq[0].get("resource")} for fp,seq in sorted(by_fp.items(), key=lambda x:len(x[1]), reverse=True) if len(seq)>1][:20]
    }
    text=json.dumps(report,indent=2,sort_keys=True)
    if args.output:
        try: Path(args.output).write_text(text+"\n",encoding="utf-8")
        except OSError as exc: print(f"error: {exc}",file=sys.stderr); return 4
    print(text); return 0

if __name__=="__main__": raise SystemExit(main())
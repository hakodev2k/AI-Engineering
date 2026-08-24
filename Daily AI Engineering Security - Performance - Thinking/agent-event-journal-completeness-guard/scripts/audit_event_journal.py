#!/usr/bin/env python3
"""Audit canonical agent JSONL journal completeness and optional write-ahead mirror parity."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

KINDS={"assistant_text","user_message","tool_use","tool_result","checkpoint","completion"}

def load_jsonl(path):
    records=[]
    with Path(path).open("r",encoding="utf-8") as f:
        for lineno,line in enumerate(f,1):
            if not line.strip(): continue
            try: obj=json.loads(line)
            except json.JSONDecodeError as e: raise ValueError(f"{path}:{lineno}: invalid JSON: {e.msg}") from e
            if not isinstance(obj,dict): raise ValueError(f"{path}:{lineno}: record must be object")
            records.append((lineno,obj))
    return records

def audit(journal, mirror=None):
    violations=[]; ids=set(); seq_prev=0; uses={}; results=set(); completions=[]
    for lineno,r in journal:
        seq=r.get("seq"); eid=r.get("event_id"); kind=r.get("kind")
        if not isinstance(seq,int) or isinstance(seq,bool) or seq<1: violations.append({"code":"invalid_seq","line":lineno})
        elif seq<=seq_prev: violations.append({"code":"non_monotonic_seq","line":lineno,"seq":seq,"previous":seq_prev})
        else: seq_prev=seq
        if not isinstance(eid,str) or not eid: violations.append({"code":"invalid_event_id","line":lineno})
        elif eid in ids: violations.append({"code":"duplicate_event_id","line":lineno,"event_id":eid})
        else: ids.add(eid)
        if kind not in KINDS: violations.append({"code":"invalid_kind","line":lineno,"kind":kind})
        if kind=="tool_use":
            tid=r.get("tool_use_id")
            if not isinstance(tid,str) or not tid: violations.append({"code":"missing_tool_use_id","line":lineno})
            elif tid in uses: violations.append({"code":"duplicate_tool_use_id","line":lineno,"tool_use_id":tid})
            else: uses[tid]=lineno
        elif kind=="tool_result":
            tid=r.get("tool_use_id")
            if not isinstance(tid,str) or not tid: violations.append({"code":"missing_tool_result_id","line":lineno})
            elif tid not in uses: violations.append({"code":"orphan_tool_result","line":lineno,"tool_use_id":tid})
            elif tid in results: violations.append({"code":"duplicate_tool_result","line":lineno,"tool_use_id":tid})
            else: results.add(tid)
        elif kind=="completion": completions.append(lineno)
    for tid,line in uses.items():
        if tid not in results: violations.append({"code":"orphan_tool_use","line":line,"tool_use_id":tid})
    if len(completions)!=1: violations.append({"code":"completion_count","count":len(completions)})
    elif journal and completions[0]!=journal[-1][0]: violations.append({"code":"completion_not_final","line":completions[0]})
    if mirror is not None:
        mirror_ids=[]; seen=set()
        for lineno,r in mirror:
            eid=r.get("event_id")
            if not isinstance(eid,str) or not eid: violations.append({"code":"mirror_invalid_event_id","line":lineno}); continue
            if eid in seen: violations.append({"code":"mirror_duplicate_event_id","line":lineno,"event_id":eid})
            else: seen.add(eid); mirror_ids.append(eid)
        missing=[x for x in mirror_ids if x not in ids]; extra=sorted(ids-seen)
        if missing: violations.append({"code":"missing_durable_events","event_ids":missing,"count":len(missing)})
        if extra: violations.append({"code":"unmirrored_durable_events","event_ids":extra,"count":len(extra)})
    return {"pass":not violations,"records":len(journal),"violations":violations,"metrics":{"tool_uses":len(uses),"tool_results":len(results),"completion_count":len(completions)}}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("journal"); ap.add_argument("--mirror"); ap.add_argument("--output"); a=ap.parse_args()
    try:
        j=load_jsonl(a.journal); m=load_jsonl(a.mirror) if a.mirror else None; report=audit(j,m)
    except (OSError,ValueError) as e:
        print(json.dumps({"pass":False,"error":str(e)},indent=2),file=sys.stderr); return 1
    text=json.dumps(report,indent=2)
    if a.output: Path(a.output).write_text(text+"\n",encoding="utf-8")
    print(text); return 0 if report["pass"] else 2
if __name__=="__main__": raise SystemExit(main())

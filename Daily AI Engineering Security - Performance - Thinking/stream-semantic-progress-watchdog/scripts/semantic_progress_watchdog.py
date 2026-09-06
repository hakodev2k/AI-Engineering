#!/usr/bin/env python3
"""Classify JSONL stream traces by semantic progress. 0=healthy, 2=stalled/deadline, 3=input error."""
from __future__ import annotations
import argparse,json,sys
SEM_DEFAULT={"text_delta","tool_call","tool_result","completion"}
def analyze(events,semantic_ms,overall_ms,semantic):
 if not events:raise ValueError("trace is empty")
 start=last_sem=last_ts=events[0]["ts_ms"]
 for i,e in enumerate(events):
  if "ts_ms" not in e or "kind" not in e:raise ValueError(f"event {i} missing ts_ms/kind")
  ts=e["ts_ms"]
  if not isinstance(ts,(int,float)):raise ValueError(f"event {i} ts_ms not numeric")
  if ts<last_ts:raise ValueError("timestamps must be monotonic")
  if ts-start>overall_ms:return {"decision":"stalled","reason":"overall_timeout","at_ms":ts,"semantic_gap_ms":ts-last_sem}
  if ts-last_sem>semantic_ms:return {"decision":"stalled","reason":"semantic_timeout","at_ms":ts,"semantic_gap_ms":ts-last_sem,"last_event_kind":e["kind"]}
  if e["kind"] in semantic:last_sem=ts
  last_ts=ts
 end=events[-1]["ts_ms"]
 if end-start>overall_ms:return {"decision":"stalled","reason":"overall_timeout","at_ms":end}
 return {"decision":"healthy","duration_ms":end-start,"final_semantic_gap_ms":end-last_sem}
def load(path):
 out=[]
 with open(path,encoding="utf-8") as f:
  for n,line in enumerate(f,1):
   if line.strip():
    try:out.append(json.loads(line))
    except json.JSONDecodeError as e:raise ValueError(f"invalid JSON line {n}: {e.msg}")
 return out
def main():
 p=argparse.ArgumentParser();p.add_argument("trace");p.add_argument("--semantic-timeout-ms",type=int,default=30000);p.add_argument("--overall-timeout-ms",type=int,default=300000);p.add_argument("--semantic-kind",action="append",dest="semantic")
 a=p.parse_args()
 if a.semantic_timeout_ms<=0 or a.overall_timeout_ms<=0:print(json.dumps({"decision":"error","error":"timeouts must be positive"}));return 3
 try:r=analyze(load(a.trace),a.semantic_timeout_ms,a.overall_timeout_ms,set(a.semantic or SEM_DEFAULT));code=0 if r["decision"]=="healthy" else 2
 except (OSError,ValueError) as e:r={"decision":"error","error":str(e)};code=3
 print(json.dumps(r,sort_keys=True));return code
if __name__=="__main__":sys.exit(main())

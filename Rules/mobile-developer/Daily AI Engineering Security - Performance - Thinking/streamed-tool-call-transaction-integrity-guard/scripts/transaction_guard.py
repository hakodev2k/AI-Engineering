#!/usr/bin/env python3
"""Validate a streamed tool-call transaction before invocation.

Input JSON:
{
  "call_id":"c1","tool":"write_file","raw_arguments":"{\"path\":\"a\"}",
  "terminal_event":true,"schema_allows_empty_object":false,
  "execution_state":"not-started","retry_count":0,
  "previous":{"call_id":null,"raw_arguments":null}
}
Exit 0 = ready/retry, 2 = invalid input, 3 = reconcile/block.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path

STATES={"not-started","started","succeeded","failed","unknown"}

def load(p:Path):
    try: v=json.loads(p.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e: raise ValueError(f"cannot read {p}: {e}") from e
    if not isinstance(v,dict): raise ValueError(f"{p} must contain an object")
    return v

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("input",type=Path); ap.add_argument("--policy",type=Path,required=True); a=ap.parse_args()
    try:
        d,p=load(a.input),load(a.policy)
        cid,tool,raw=d.get("call_id"),d.get("tool"),d.get("raw_arguments")
        terminal=d.get("terminal_event"); state=d.get("execution_state"); retries=d.get("retry_count",0)
        if not all(isinstance(x,str) and x for x in (cid,tool)): raise ValueError("call_id/tool must be non-empty strings")
        if not isinstance(raw,str): raise ValueError("raw_arguments must be string")
        if not isinstance(terminal,bool): raise ValueError("terminal_event must be boolean")
        if state not in STATES: raise ValueError("invalid execution_state")
        if not isinstance(retries,int) or isinstance(retries,bool) or retries<0: raise ValueError("retry_count must be non-negative integer")
        prev=d.get("previous") or {}
        if not isinstance(prev,dict): raise ValueError("previous must be object")
        if prev.get("call_id")==cid and isinstance(prev.get("raw_arguments"),str) and prev["raw_arguments"]!=raw:
            out={"decision":"block","reason":"call id reused with different raw arguments","call_id":cid}; print(json.dumps(out,indent=2)); return 3
        evidence=hashlib.sha256((cid+"\n"+tool+"\n"+raw).encode("utf-8")).hexdigest()
        if state in {"started","failed","unknown"}:
            out={"decision":"reconcile","reason":f"execution state is {state}; automatic replay requires explicit side-effect evidence","evidence_sha256":evidence}; print(json.dumps(out,indent=2)); return 3
        if state=="succeeded":
            out={"decision":"block","reason":"transaction already succeeded; do not execute twice","evidence_sha256":evidence}; print(json.dumps(out,indent=2)); return 3
        max_retries=int(p.get("max_retries",2))
        if p.get("require_terminal_event",True) and not terminal:
            decision="retry" if state=="not-started" and retries<max_retries else "block"
            out={"decision":decision,"reason":"stream is not terminal","evidence_sha256":evidence,"retry_count":retries}; print(json.dumps(out,indent=2)); return 0 if decision=="retry" else 3
        normalized=raw
        if not raw.strip():
            if p.get("normalize_empty_args_only_for_declared_empty_schema",True) and d.get("schema_allows_empty_object") is True:
                normalized="{}"
            else:
                decision="retry" if state=="not-started" and retries<max_retries else "block"
                out={"decision":decision,"reason":"empty arguments are not valid for this declared schema","evidence_sha256":evidence}; print(json.dumps(out,indent=2)); return 0 if decision=="retry" else 3
        try: parsed=json.loads(normalized)
        except json.JSONDecodeError as e:
            decision="retry" if state=="not-started" and retries<max_retries else "block"
            out={"decision":decision,"reason":f"arguments are not complete valid JSON: {e.msg}","evidence_sha256":evidence}; print(json.dumps(out,indent=2)); return 0 if decision=="retry" else 3
        if not isinstance(parsed,dict):
            out={"decision":"block","reason":"tool arguments must decode to an object","evidence_sha256":evidence}; print(json.dumps(out,indent=2)); return 3
        required=d.get("required_fields",[])
        if not isinstance(required,list) or not all(isinstance(x,str) for x in required): raise ValueError("required_fields must be list of strings")
        missing=[x for x in required if x not in parsed]
        if missing:
            decision="retry" if state=="not-started" and retries<max_retries else "block"
            out={"decision":decision,"reason":"missing required fields: "+", ".join(missing),"evidence_sha256":evidence}; print(json.dumps(out,indent=2)); return 0 if decision=="retry" else 3
        out={"decision":"ready","call_id":cid,"tool":tool,"arguments":parsed,"evidence_sha256":evidence,"execution_state":"not-started"}; print(json.dumps(out,indent=2)); return 0
    except (ValueError,TypeError) as e:
        print(json.dumps({"decision":"invalid","error":str(e)}),file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())

#!/usr/bin/env python3
"""Classify parallel tool calls before dispatch.

Input JSON:
{"scope_id":"turn-1","calls":[{"id":"c1","tool":"search","args":{"q":"x"},"side_effect":"read","idempotency_key":null}]}
Exit 0 = decisions produced, 2 = invalid input, 3 = blocking integrity/policy finding.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path

VALID_EFFECTS={"read","idempotent-write","non-idempotent-write"}

def load(p:Path):
    try: v=json.loads(p.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e: raise ValueError(f"cannot read {p}: {e}") from e
    if not isinstance(v,dict): raise ValueError(f"{p} must contain an object")
    return v

def canon(v):
    return json.dumps(v,sort_keys=True,separators=(",",":"),ensure_ascii=False)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("input",type=Path); ap.add_argument("--policy",type=Path,required=True); a=ap.parse_args()
    try:
        data,policy=load(a.input),load(a.policy)
        scope=data.get("scope_id"); calls=data.get("calls")
        if not isinstance(scope,str) or not scope: raise ValueError("scope_id must be non-empty string")
        if not isinstance(calls,list) or not calls: raise ValueError("calls must be non-empty list")
        max_calls=int(policy.get("max_parallel_calls",16))
        if len(calls)>max_calls: raise ValueError(f"call count exceeds max_parallel_calls={max_calls}")
        seen={}; ids={}; decisions=[]; blocking=False
        for i,c in enumerate(calls):
            if not isinstance(c,dict): raise ValueError(f"calls[{i}] must be object")
            cid,tool,args,effect=c.get("id"),c.get("tool"),c.get("args"),c.get("side_effect")
            if not isinstance(cid,str) or not cid or not isinstance(tool,str) or not tool: raise ValueError(f"calls[{i}] requires id/tool")
            if not isinstance(args,dict): raise ValueError(f"calls[{i}].args must be object")
            if effect not in VALID_EFFECTS: effect="non-idempotent-write"
            argkey=canon(args)
            if cid in ids and ids[cid] != (tool,argkey):
                decisions.append({"id":cid,"decision":"block","reason":"same call id has different tool/arguments"}); blocking=True; continue
            ids[cid]=(tool,argkey)
            raw=f"{scope}\n{tool}\n{argkey}".encode()
            fp=hashlib.sha256(raw).hexdigest()
            prior=seen.get(fp)
            if prior is None:
                seen[fp]=cid; decisions.append({"id":cid,"decision":"execute","fingerprint":fp}); continue
            if effect=="read" and policy.get("allow_read_deduplication",True):
                decisions.append({"id":cid,"decision":"suppress","representative":prior,"fingerprint":fp,"reason":"duplicate read in scope"})
            elif effect=="idempotent-write" and c.get("idempotency_key"):
                decisions.append({"id":cid,"decision":"suppress","representative":prior,"fingerprint":fp,"reason":"duplicate idempotent write"})
            else:
                decisions.append({"id":cid,"decision":"block","fingerprint":fp,"reason":"duplicate write lacks safe replay contract"}); blocking=True
        print(json.dumps({"scope_id":scope,"input_calls":len(calls),"unique_fingerprints":len(seen),"decisions":decisions},indent=2))
        return 3 if blocking else 0
    except (ValueError,TypeError) as e:
        print(json.dumps({"error":str(e)}),file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())

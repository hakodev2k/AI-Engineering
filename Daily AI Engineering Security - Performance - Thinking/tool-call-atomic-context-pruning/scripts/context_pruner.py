#!/usr/bin/env python3
"""Prune chat history by protocol-safe atomic units.

Input JSON: {"messages": [...]} where tool-call assistant messages use
`tool_calls:[{"id":"..."}]` and tool results use `role:"tool", tool_call_id:"..."`.
The script never invents missing tool results. It fails closed on malformed history.
Exit codes: 0 success, 2 invalid input/config, 4 budget cannot be met safely.
"""
from __future__ import annotations
import argparse
import json
import math
import sys
from pathlib import Path

OK, INVALID, BUDGET = 0, 2, 4


def load(path: Path) -> dict:
    try:
        value=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value,dict):
        raise ValueError(f"{path} must contain an object")
    return value


def call_ids(message: dict) -> list[str]:
    calls=message.get("tool_calls",[])
    if calls is None: calls=[]
    if not isinstance(calls,list): raise ValueError("tool_calls must be a list")
    ids=[]
    for c in calls:
        if not isinstance(c,dict) or not isinstance(c.get("id"),str) or not c["id"]:
            raise ValueError("each tool call must contain a non-empty string id")
        ids.append(c["id"])
    if len(ids)!=len(set(ids)): raise ValueError("duplicate tool call ids in one assistant message")
    return ids


def validate(messages: list[dict]) -> list[str]:
    findings=[]
    i=0
    while i<len(messages):
        m=messages[i]
        if not isinstance(m,dict) or not isinstance(m.get("role"),str):
            findings.append(f"message {i} is invalid"); i+=1; continue
        role=m["role"]
        if role=="tool":
            findings.append(f"orphan tool message at index {i}"); i+=1; continue
        if role=="assistant":
            ids=call_ids(m)
            if ids:
                seen=[]; j=i+1
                while j<len(messages) and messages[j].get("role")=="tool":
                    tid=messages[j].get("tool_call_id")
                    if not isinstance(tid,str) or not tid: findings.append(f"tool message {j} missing tool_call_id")
                    else: seen.append(tid)
                    j+=1
                if sorted(seen)!=sorted(ids):
                    findings.append(f"assistant tool-call group at {i} expects {ids} but has results {seen}")
                i=j; continue
        i+=1
    return findings


def atomic_units(messages: list[dict]) -> list[list[dict]]:
    units=[]; i=0
    while i<len(messages):
        m=messages[i]
        if m.get("role")=="assistant" and call_ids(m):
            unit=[m]; i+=1
            while i<len(messages) and messages[i].get("role")=="tool":
                unit.append(messages[i]); i+=1
            units.append(unit)
        else:
            units.append([m]); i+=1
    return units


def estimate_messages(messages: list[dict], chars_per_token: float) -> int:
    if chars_per_token<=0: raise ValueError("chars_per_token_estimate must be > 0")
    chars=len(json.dumps(messages,ensure_ascii=False,separators=(",",":")))
    return max(1,math.ceil(chars/chars_per_token))


def flatten(units: list[list[dict]]) -> list[dict]:
    return [m for u in units for m in u]


def prune(messages: list[dict], cfg: dict) -> tuple[dict,int]:
    if not isinstance(messages,list): raise ValueError("messages must be a list")
    findings=validate(messages)
    if findings and cfg.get("fail_on_invalid_input_history",True):
        raise ValueError("invalid input history: "+"; ".join(findings))
    if findings: raise ValueError("repair mode is intentionally unsupported")

    max_tokens=int(cfg.get("max_estimated_tokens",32000))
    reserve=int(cfg.get("reserved_output_tokens",4000))
    budget=max_tokens-reserve
    if budget<=0: raise ValueError("reserved_output_tokens must be smaller than max_estimated_tokens")
    cpt=float(cfg.get("chars_per_token_estimate",4.0))
    min_recent=max(0,int(cfg.get("min_recent_units",4)))
    units=atomic_units(messages)
    before=estimate_messages(messages,cpt)

    protected=set()
    if cfg.get("preserve_system_messages",True):
        protected.update(i for i,u in enumerate(units) if len(u)==1 and u[0].get("role")=="system")
    if cfg.get("preserve_latest_user_message",True):
        for i in range(len(units)-1,-1,-1):
            if len(units[i])==1 and units[i][0].get("role")=="user": protected.add(i); break
    protected.update(range(max(0,len(units)-min_recent),len(units)))

    kept=[True]*len(units)
    def current(): return flatten([u for i,u in enumerate(units) if kept[i]])
    after=estimate_messages(current(),cpt)
    dropped=0
    for i in range(len(units)):
        if after<=budget: break
        if i in protected: continue
        kept[i]=False; dropped+=1; after=estimate_messages(current(),cpt)

    out=current()
    post=validate(out)
    if post: raise ValueError("internal error: pruning produced invalid history: "+"; ".join(post))
    result={
        "messages":out,
        "metrics":{"estimated_tokens_before":before,"estimated_tokens_after":after,"input_budget":budget,"units_before":len(units),"units_dropped":dropped,"units_kept":len(units)-dropped},
        "integrity":{"input_valid":True,"output_valid":True,"orphan_tool_results":0,"unanswered_tool_calls":0}
    }
    if after>budget:
        result["decision"]="budget_unmet_without_dropping_protected_context"
        return result,BUDGET
    result["decision"]="ok"
    return result,OK


def main() -> int:
    p=argparse.ArgumentParser()
    p.add_argument("input",type=Path)
    p.add_argument("--config",type=Path,required=True)
    p.add_argument("--output",type=Path)
    args=p.parse_args()
    try:
        data,cfg=load(args.input),load(args.config)
        result,code=prune(data.get("messages"),cfg)
    except (ValueError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return INVALID
    text=json.dumps(result,ensure_ascii=False,indent=2)
    if args.output:
        try: args.output.write_text(text+"\n",encoding="utf-8")
        except OSError as exc:
            print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return INVALID
    else: print(text)
    return code

if __name__=="__main__":
    raise SystemExit(main())

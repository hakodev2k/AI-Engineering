#!/usr/bin/env python3
"""Validate observable completion semantics in JSON/JSONL model-response traces.

No hidden reasoning text is required. The validator only checks whether an observable
reasoning/thinking field is present, not its content.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from typing import Any

DEFAULT={"max_empty_retries":2,"allow_explicit_no_reply":True,"accepted_terminal_reasons":["stop","completed"],"truncation_reasons":["length","max_tokens","incomplete"],"visible_fields":["content","text"],"structured_fields":["structured_output","json_output"],"tool_fields":["tool_calls","function_calls"]}
PLACEHOLDERS={"(no response generated)","no response generated","(empty)"}

def present(v:Any)->bool:
    if v is None: return False
    if isinstance(v,str): return bool(v.strip()) and v.strip().lower() not in PLACEHOLDERS
    if isinstance(v,(list,dict,tuple,set)): return bool(v)
    return True

def classify(row:dict[str,Any],p:dict[str,Any])->str:
    reason=str(row.get("finish_reason",row.get("stop_reason","")) or "").lower()
    if reason in {str(x).lower() for x in p["truncation_reasons"]}: return "truncated"
    if any(present(row.get(k)) for k in p["visible_fields"]): return "visible"
    if any(present(row.get(k)) for k in p["tool_fields"]): return "tool"
    if any(present(row.get(k)) for k in p["structured_fields"]): return "structured"
    if row.get("explicit_no_reply") is True and p.get("allow_explicit_no_reply",False): return "no_reply"
    if reason in {str(x).lower() for x in p["accepted_terminal_reasons"]}: return "invalid_empty_terminal"
    return "nonterminal_or_unknown"

def validate(rows:list[dict[str,Any]],p:dict[str,Any])->dict[str,Any]:
    violations=[]; counts={}; recoverable=0
    cap=int(p.get("max_empty_retries",2))
    if cap<0 or cap>10: violations.append("policy:max_empty_retries must be in [0,10]")
    for i,row in enumerate(rows,1):
        if not isinstance(row,dict): violations.append(f"row_{i}:not_an_object"); continue
        c=classify(row,p); counts[c]=counts.get(c,0)+1
        retry=row.get("retry_index",0)
        try: retry=int(retry)
        except (TypeError,ValueError): violations.append(f"row_{i}:invalid_retry_index"); continue
        if c=="invalid_empty_terminal":
            if retry>=cap: violations.append(f"row_{i}:empty_terminal_retry_budget_exhausted")
            else: recoverable+=1
        elif c=="truncated":
            if row.get("marked_complete") is True: violations.append(f"row_{i}:truncation_marked_complete")
        elif c=="nonterminal_or_unknown" and row.get("marked_complete") is True:
            violations.append(f"row_{i}:unknown_outcome_marked_complete")
        if c in {"invalid_empty_terminal","truncated","nonterminal_or_unknown"} and row.get("delivered_as_success") is True:
            violations.append(f"row_{i}:invalid_outcome_delivered_as_success")
    return {"ok":not violations,"violations":violations,"counts":counts,"recoverable_empty_terminals":recoverable}

def load_rows(path:Path)->list[dict[str,Any]]:
    text=path.read_text(encoding="utf-8").strip()
    if not text: return []
    if text.startswith("["):
        data=json.loads(text)
        if not isinstance(data,list): raise ValueError("JSON root must be an array")
        return data
    rows=[]
    for n,line in enumerate(text.splitlines(),1):
        if line.strip():
            obj=json.loads(line)
            if not isinstance(obj,dict): raise ValueError(f"line {n} must be an object")
            rows.append(obj)
    return rows

def main()->int:
    ap=argparse.ArgumentParser(description=__doc__); ap.add_argument("trace",type=Path); ap.add_argument("--policy",type=Path); ap.add_argument("--json",action="store_true"); a=ap.parse_args()
    try:
        p=dict(DEFAULT)
        if a.policy:
            extra=json.loads(a.policy.read_text(encoding="utf-8"))
            if not isinstance(extra,dict): raise ValueError("policy must be an object")
            p.update(extra)
        rows=load_rows(a.trace)
    except (OSError,json.JSONDecodeError,ValueError) as e: print(f"ERROR: {e}",file=sys.stderr); return 2
    result=validate(rows,p)
    if a.json: print(json.dumps(result,indent=2))
    else:
        print("PASS" if result["ok"] else "FAIL")
        print("counts="+json.dumps(result["counts"],sort_keys=True))
        for v in result["violations"]: print(f"- {v}")
    return 0 if result["ok"] else 1

if __name__=="__main__": raise SystemExit(main())

#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from typing import Any

def load_json(path: str) -> dict[str, Any]:
    try:
        data=json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(data,dict): raise ValueError(f"{path} must contain a JSON object")
    return data

def norm_id(v: Any)->str:
    if isinstance(v,bool) or v is None or not isinstance(v,(str,int,float)):
        raise ValueError("item id must be string or number")
    return str(v)

def norm_key(v: Any)->tuple:
    if not isinstance(v,list) or not v: raise ValueError("sort_key must be a non-empty array")
    out=[]
    for x in v:
        if isinstance(x,bool) or x is None or not isinstance(x,(str,int,float)):
            raise ValueError("sort_key elements must be strings or numbers")
        out.append((type(x).__name__,x))
    return tuple(out)

def validate_trace(trace:dict[str,Any],policy:dict[str,Any])->dict[str,Any]:
    pages=trace.get("pages")
    if not isinstance(pages,list) or not pages: raise ValueError("trace.pages must be a non-empty array")
    max_pages=policy.get("max_pages",1000)
    if not isinstance(max_pages,int) or max_pages<1: raise ValueError("policy.max_pages must be a positive integer")
    if len(pages)>max_pages: raise ValueError("trace exceeds max_pages")
    findings=[]; seen_ids={}; seen_cursors={}; prev_key=None; observed=[]
    for pi,page in enumerate(pages):
        if not isinstance(page,dict): raise ValueError(f"pages[{pi}] must be an object")
        for name in ("cursor_in","cursor_out","items"):
            if name not in page: raise ValueError(f"pages[{pi}] missing {name}")
        cin,cout,items=page["cursor_in"],page["cursor_out"],page["items"]
        if cin is not None and not isinstance(cin,str): raise ValueError(f"pages[{pi}].cursor_in must be string or null")
        if cout is not None and not isinstance(cout,str): raise ValueError(f"pages[{pi}].cursor_out must be string or null")
        if not isinstance(items,list): raise ValueError(f"pages[{pi}].items must be an array")
        if policy.get("require_cursor_continuity",True) and pi>0 and cin!=pages[pi-1].get("cursor_out"):
            findings.append({"id":"cursor-discontinuity","page":pi,"message":"cursor_in does not equal previous cursor_out"})
        if cout is not None:
            if cout in seen_cursors: findings.append({"id":"cursor-cycle","page":pi,"message":f"cursor_out repeats page {seen_cursors[cout]}"})
            else: seen_cursors[cout]=pi
        for ii,item in enumerate(items):
            if not isinstance(item,dict) or "id" not in item or "sort_key" not in item:
                raise ValueError(f"pages[{pi}].items[{ii}] requires id and sort_key")
            iid=norm_id(item["id"]); key=norm_key(item["sort_key"]); observed.append(iid)
            if policy.get("require_unique_ids",True):
                if iid in seen_ids: findings.append({"id":"duplicate-item","page":pi,"item":ii,"message":f"id {iid!r} already appeared"})
                else: seen_ids[iid]=(pi,ii)
            if policy.get("require_strict_monotonic_order",True) and prev_key is not None:
                try:
                    bad=key<=prev_key
                except TypeError as exc:
                    raise ValueError("sort_key element types are not comparable across items") from exc
                if bad: findings.append({"id":"non-monotonic-order","page":pi,"item":ii,"message":"sort_key is not strictly increasing"})
            prev_key=key
    if policy.get("require_terminal_null_cursor",True) and pages[-1].get("cursor_out") is not None:
        findings.append({"id":"unterminated-pagination","page":len(pages)-1,"message":"final cursor_out must be null"})
    expected=trace.get("expected_ids")
    if expected is not None:
        if not isinstance(expected,list): raise ValueError("expected_ids must be an array")
        exp={norm_id(v) for v in expected}; obs=set(observed)
        missing=sorted(exp-obs); unexpected=sorted(obs-exp)
        if missing: findings.append({"id":"missing-items","message":f"missing ids: {missing}"})
        if unexpected: findings.append({"id":"unexpected-items","message":f"unexpected ids: {unexpected}"})
    return {"status":"pass" if not findings else "fail","pages_checked":len(pages),"items_checked":len(observed),"findings":findings}

def main()->int:
    ap=argparse.ArgumentParser()
    ap.add_argument("--trace",required=True); ap.add_argument("--policy",required=True); ap.add_argument("--out",required=True)
    a=ap.parse_args()
    try:
        report=validate_trace(load_json(a.trace),load_json(a.policy))
        p=Path(a.out); p.parent.mkdir(parents=True,exist_ok=True)
        p.write_text(json.dumps(report,indent=2,sort_keys=True)+"\n",encoding="utf-8")
        return 0 if report["status"]=="pass" else 1
    except ValueError as exc:
        print(f"pagination_cursor_gate: {exc}",file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())

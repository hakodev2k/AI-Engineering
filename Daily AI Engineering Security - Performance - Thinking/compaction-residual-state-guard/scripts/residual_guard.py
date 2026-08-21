#!/usr/bin/env python3
"""Validate residual-state manifests before context compaction.

Manifest shape:
{"items":[{"id":"...","tool":"...","status":"complete","required":true,
"recoverable":true,"sha256":"64 hex chars","reference":"store://...",
"retained_bytes":0,"omitted_bytes":1000,"reason":"needed for verification"}]}
Exit: 0 allow, 2 invalid, 3 strict block.
"""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path

HEX64=re.compile(r"^[0-9a-fA-F]{64}$")

def load(path:Path):
    try: value=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value,dict): raise ValueError(f"{path} must contain an object")
    return value

def validate(manifest,policy):
    items=manifest.get("items")
    if not isinstance(items,list): raise ValueError("items must be a list")
    req_fields=policy.get("required_fields",[])
    if not isinstance(req_fields,list) or not all(isinstance(x,str) for x in req_fields): raise ValueError("required_fields must be strings")
    findings=[]; required=0; covered=0; omitted_total=0
    seen=set()
    for i,item in enumerate(items):
        if not isinstance(item,dict): raise ValueError(f"items[{i}] must be object")
        missing=[f for f in req_fields if f not in item]
        if missing: findings.append(f"item {i} missing fields: {','.join(missing)}"); continue
        ident=item.get("id")
        if not isinstance(ident,str) or not ident.strip(): findings.append(f"item {i} invalid id"); continue
        if ident in seen: findings.append(f"duplicate id {ident}")
        seen.add(ident)
        for f in ("required","recoverable"):
            if not isinstance(item.get(f),bool): findings.append(f"{ident}: {f} must be boolean")
        for f in ("retained_bytes","omitted_bytes"):
            if not isinstance(item.get(f),(int,float)) or isinstance(item.get(f),bool) or item.get(f)<0: findings.append(f"{ident}: {f} must be non-negative number")
        omitted=item.get("omitted_bytes",0); omitted_total += omitted if isinstance(omitted,(int,float)) else 0
        if item.get("required"):
            required += 1
            inline = item.get("retained_bytes",0)>0 and item.get("omitted_bytes",0)==0
            ref=item.get("reference")
            hashed=isinstance(item.get("sha256"),str) and bool(HEX64.match(item["sha256"]))
            referenced=isinstance(ref,str) and bool(ref.strip()) and item.get("recoverable") is True
            if inline or (referenced and hashed): covered += 1
            else: findings.append(f"{ident}: required state is neither fully retained nor recoverably referenced with valid sha256")
            if item.get("omitted_bytes",0)>0 and policy.get("require_reference_for_omitted_required_state",True) and not referenced:
                findings.append(f"{ident}: omitted required state lacks recoverable reference")
            if policy.get("require_hash_for_referenced_state",True) and referenced and not hashed:
                findings.append(f"{ident}: referenced required state lacks valid sha256")
        if not isinstance(item.get("reason"),str) or not item.get("reason","").strip(): findings.append(f"{ident}: reason is required")
    coverage=1.0 if required==0 else covered/required
    decision="allow" if not findings else "block"
    return {"decision":decision,"required_items":required,"covered_required_items":covered,"required_coverage":coverage,"omitted_bytes":omitted_total,"findings":findings}

def main():
    p=argparse.ArgumentParser(); p.add_argument("manifest",type=Path); p.add_argument("--policy",type=Path,required=True); p.add_argument("--strict",action="store_true")
    a=p.parse_args()
    try: result=validate(load(a.manifest),load(a.policy))
    except (ValueError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2
    print(json.dumps(result,indent=2))
    return 3 if a.strict and result["decision"]=="block" else 0
if __name__=="__main__": raise SystemExit(main())

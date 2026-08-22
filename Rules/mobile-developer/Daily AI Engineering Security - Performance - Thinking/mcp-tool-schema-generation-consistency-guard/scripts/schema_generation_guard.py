#!/usr/bin/env python3
"""Deterministic MCP metadata-generation validator and trace analyzer.

No third-party dependencies. This utility does not execute MCP tools or network requests.
Exit codes: 0 success, 2 invalid input/catalog, 3 consistency violation.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path

VALID_TYPES = {"null", "boolean", "object", "array", "number", "string", "integer"}

def stable_hash(value) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()

def validate_schema(node, path="$"):
    errors=[]
    if isinstance(node, dict):
        t=node.get("type")
        if isinstance(t,str) and t not in VALID_TYPES:
            errors.append(f"{path}.type invalid: {t}")
        if isinstance(t,list):
            bad=[x for x in t if x not in VALID_TYPES]
            if bad: errors.append(f"{path}.type invalid members: {bad}")
        for k,v in node.items():
            if k in {"properties","patternProperties","$defs","definitions"} and isinstance(v,dict):
                for name, child in v.items(): errors += validate_schema(child, f"{path}.{k}.{name}")
            elif k in {"items","additionalProperties","contains","not","if","then","else"} and isinstance(v,(dict,list)):
                errors += validate_schema(v, f"{path}.{k}")
            elif k in {"allOf","anyOf","oneOf","prefixItems"} and isinstance(v,list):
                for i,child in enumerate(v): errors += validate_schema(child, f"{path}.{k}[{i}]")
    elif isinstance(node,list):
        for i,child in enumerate(node): errors += validate_schema(child, f"{path}[{i}]")
    return errors

def validate_catalog(path: Path) -> int:
    try: data=json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        print(json.dumps({"ok":False,"error":f"cannot read catalog: {e}"})); return 2
    tools=data.get("tools") if isinstance(data,dict) else None
    if not isinstance(tools,list):
        print(json.dumps({"ok":False,"error":"catalog.tools must be an array"})); return 2
    seen=set(); errs=[]; fingerprints={}
    for i,t in enumerate(tools):
        if not isinstance(t,dict) or not isinstance(t.get("name"),str):
            errs.append(f"tools[{i}] missing string name"); continue
        name=t["name"]
        if name in seen: errs.append(f"duplicate tool name: {name}")
        seen.add(name)
        if "outputSchema" in t:
            if not isinstance(t["outputSchema"],dict): errs.append(f"{name}: outputSchema must be object")
            else:
                errs += [f"{name}: {e}" for e in validate_schema(t["outputSchema"])]
                fingerprints[name]=stable_hash(t["outputSchema"])
    out={"ok":not errs,"catalog_hash":stable_hash(data),"tool_schema_hashes":fingerprints,"errors":errs}
    print(json.dumps(out,indent=2,sort_keys=True)); return 0 if not errs else 2

def analyze(path: Path) -> int:
    dispatch={}; violations=[]; count=0
    try:
        lines=path.read_text(encoding="utf-8").splitlines()
        for n,line in enumerate(lines,1):
            if not line.strip(): continue
            e=json.loads(line); count+=1
            rid=e.get("request_id"); kind=e.get("event")
            if not rid: violations.append({"line":n,"type":"MISSING_REQUEST_ID"}); continue
            if kind=="dispatch":
                if rid in dispatch: violations.append({"line":n,"type":"DUPLICATE_DISPATCH","request_id":rid})
                dispatch[rid]=e
            elif kind=="validate":
                d=dispatch.get(rid)
                if not d: violations.append({"line":n,"type":"VALIDATION_WITHOUT_DISPATCH","request_id":rid}); continue
                if d.get("generation_id") != e.get("generation_id"):
                    violations.append({"line":n,"type":"GENERATION_MISMATCH","request_id":rid,"dispatch":d.get("generation_id"),"validate":e.get("generation_id")})
                if d.get("schema_hash") != e.get("schema_hash"):
                    violations.append({"line":n,"type":"SCHEMA_HASH_MISMATCH","request_id":rid})
                if d.get("schema_expected") is True and not e.get("validator_present",False):
                    violations.append({"line":n,"type":"MISSING_PINNED_VALIDATOR","request_id":rid})
    except Exception as e:
        print(json.dumps({"ok":False,"error":f"cannot analyze events: {e}"})); return 2
    print(json.dumps({"ok":not violations,"events":count,"violations":violations},indent=2,sort_keys=True))
    return 0 if not violations else 3

def main():
    p=argparse.ArgumentParser()
    sub=p.add_subparsers(dest="cmd",required=True)
    a=sub.add_parser("validate-catalog"); a.add_argument("--catalog",required=True,type=Path)
    b=sub.add_parser("analyze"); b.add_argument("--events",required=True,type=Path)
    ns=p.parse_args()
    sys.exit(validate_catalog(ns.catalog) if ns.cmd=="validate-catalog" else analyze(ns.events))
if __name__=="__main__": main()

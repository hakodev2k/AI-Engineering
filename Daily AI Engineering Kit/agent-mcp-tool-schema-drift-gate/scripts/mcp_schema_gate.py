#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,sys
from pathlib import Path
from typing import Any,Dict,Iterable,List
BREAKING="breaking"; NON_BREAKING="non_breaking"
IGNORED={"description","title","$comment","examples","default"}

def load(p:Path)->Any:
    try:return json.loads(p.read_text(encoding="utf-8"))
    except FileNotFoundError as e: raise ValueError(f"input not found: {p}") from e
    except json.JSONDecodeError as e: raise ValueError(f"invalid JSON in {p}: {e}") from e

def validate(d:Any)->Dict[str,Any]:
    if not isinstance(d,dict): raise ValueError("snapshot must be object")
    d=dict(d)
    for k in ("tools","resources","prompts"):
        d.setdefault(k,[])
        if not isinstance(d[k],list): raise ValueError(f"{k} must be array")
    return d

def amap(items:Iterable[Dict[str,Any]],kind:str)->Dict[str,Dict[str,Any]]:
    out={}
    for x in items:
        if not isinstance(x,dict) or not isinstance(x.get("name"),str) or not x["name"]: raise ValueError(f"{kind} needs name")
        if x["name"] in out: raise ValueError(f"duplicate {kind}: {x['name']}")
        out[x["name"]]=x
    return out

def sig(x:Any)->Any:
    if isinstance(x,dict): return {k:sig(v) for k,v in sorted(x.items()) if k not in IGNORED}
    if isinstance(x,list): return [sig(v) for v in x]
    return x

def f(sev,kind,component,**extra):
    x={"severity":sev,"kind":kind,"component":component};x.update(extra);return x

def compare_tool(name,old,new):
    o=old.get("inputSchema",{}); n=new.get("inputSchema",{})
    if not isinstance(o,dict) or not isinstance(n,dict): return [f(BREAKING,"invalid_input_schema",f"tool:{name}")]
    op=o.get("properties",{}) if isinstance(o.get("properties",{}),dict) else {}
    np=n.get("properties",{}) if isinstance(n.get("properties",{}),dict) else {}
    orq=set(o.get("required",[]) if isinstance(o.get("required",[]),list) else [])
    nrq=set(n.get("required",[]) if isinstance(n.get("required",[]),list) else [])
    out=[]
    for p in sorted(op.keys()-np.keys()): out.append(f(BREAKING,"removed_property",f"tool:{name}",path=f"inputSchema.properties.{p}"))
    for p in sorted(nrq-orq): out.append(f(BREAKING,"new_required_property",f"tool:{name}",path=f"inputSchema.required.{p}"))
    for p in sorted(orq-nrq): out.append(f(NON_BREAKING,"property_no_longer_required",f"tool:{name}",path=f"inputSchema.required.{p}"))
    for p in sorted(np.keys()-op.keys()): out.append(f(BREAKING if p in nrq else NON_BREAKING,"added_property",f"tool:{name}",path=f"inputSchema.properties.{p}"))
    for p in sorted(op.keys()&np.keys()):
        if sig(op[p])!=sig(np[p]): out.append(f(BREAKING,"property_schema_changed",f"tool:{name}",path=f"inputSchema.properties.{p}",before=sig(op[p]),after=sig(np[p])))
    if sig(o.get("additionalProperties"))!=sig(n.get("additionalProperties")):
        out.append(f(BREAKING,"additional_properties_policy_changed",f"tool:{name}",path="inputSchema.additionalProperties"))
    return out

def compare_named(kind,old_items,new_items):
    old,new=amap(old_items,kind),amap(new_items,kind);out=[]
    for name in sorted(old.keys()-new.keys()): out.append(f(BREAKING,f"removed_{kind}",f"{kind}:{name}"))
    for name in sorted(new.keys()-old.keys()): out.append(f(NON_BREAKING,f"added_{kind}",f"{kind}:{name}"))
    for name in sorted(old.keys()&new.keys()):
        if kind=="tool": out.extend(compare_tool(name,old[name],new[name]))
        elif sig(old[name])!=sig(new[name]): out.append(f(BREAKING,f"changed_{kind}",f"{kind}:{name}",before=sig(old[name]),after=sig(new[name])))
    return out

def compare(b,c):
    findings=[]
    for k in ("tool","resource","prompt"): findings.extend(compare_named(k,b[k+"s"],c[k+"s"]))
    br=sum(x["severity"]==BREAKING for x in findings); nb=sum(x["severity"]==NON_BREAKING for x in findings)
    return {"status":"fail" if br else "pass","summary":{"breaking":br,"non_breaking":nb,"total":len(findings)},"findings":findings}

def main():
    p=argparse.ArgumentParser();p.add_argument("--baseline",required=True,type=Path);p.add_argument("--candidate",required=True,type=Path);p.add_argument("--output",required=True,type=Path);a=p.parse_args()
    try:r=compare(validate(load(a.baseline)),validate(load(a.candidate)))
    except ValueError as e: print(f"validation error: {e}",file=sys.stderr);return 2
    a.output.write_text(json.dumps(r,indent=2,sort_keys=True)+"\n",encoding="utf-8")
    if r["status"]=="fail": print(f"MCP contract gate failed: {r['summary']['breaking']} breaking finding(s)",file=sys.stderr);return 1
    print("MCP contract gate passed");return 0
if __name__=="__main__": raise SystemExit(main())

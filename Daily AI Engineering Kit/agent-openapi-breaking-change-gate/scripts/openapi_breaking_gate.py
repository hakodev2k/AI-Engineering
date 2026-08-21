#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

HTTP_METHODS={"get","put","post","delete","patch","options","head","trace"}
DEFAULT_BLOCKING={"removed-path","removed-operation","removed-response-status","required-request-property-added","request-property-type-changed","response-property-type-changed","enum-value-removed","parameter-removed","parameter-made-required"}

def load_doc(path):
    p=Path(path)
    text=p.read_text(encoding="utf-8")
    if p.suffix.lower()==".json": return json.loads(text)
    try:
        import yaml
    except ImportError as e:
        raise RuntimeError("YAML input requires PyYAML; use JSON or install pyyaml") from e
    return yaml.safe_load(text)

def load_policy(path):
    try: return load_doc(path)
    except Exception as e: raise RuntimeError(f"invalid policy: {e}")

def schema_type(schema):
    if not isinstance(schema,dict): return None
    return schema.get("type") or ("object" if "properties" in schema else None)

def deref_schema(container):
    if not isinstance(container,dict): return {}
    if "schema" in container and isinstance(container["schema"],dict): return container["schema"]
    content=container.get("content",{})
    if isinstance(content,dict):
        for media in ("application/json", "application/*+json"):
            v=content.get(media)
            if isinstance(v,dict) and isinstance(v.get("schema"),dict): return v["schema"]
        for v in content.values():
            if isinstance(v,dict) and isinstance(v.get("schema"),dict): return v["schema"]
    return {}

def parameters(path_item, op):
    items=[]
    for source in (path_item.get("parameters",[]), op.get("parameters",[])):
        if isinstance(source,list): items.extend(x for x in source if isinstance(x,dict))
    return {(x.get("name"),x.get("in")):x for x in items if x.get("name") and x.get("in")}

def add(findings, typ, loc, msg, blocking):
    findings.append({"type":typ,"location":loc,"message":msg,"blocking":typ in blocking})

def compare_schema(base, cand, loc, prefix, findings, blocking, request=False):
    bt,ct=schema_type(base),schema_type(cand)
    if bt and ct and bt!=ct:
        add(findings, f"{prefix}-property-type-changed", loc, f"type changed from {bt} to {ct}", blocking)
    bp=base.get("properties",{}) if isinstance(base,dict) else {}
    cp=cand.get("properties",{}) if isinstance(cand,dict) else {}
    if isinstance(bp,dict) and isinstance(cp,dict):
        required_c=set(cand.get("required",[]) or []) if isinstance(cand,dict) else set()
        required_b=set(base.get("required",[]) or []) if isinstance(base,dict) else set()
        if request:
            for name in sorted(required_c-required_b):
                add(findings,"required-request-property-added",f"{loc}/properties/{name}","request property became newly required",blocking)
        for name in sorted(set(bp)&set(cp)):
            bsch,csch=bp[name],cp[name]
            if isinstance(bsch,dict) and isinstance(csch,dict):
                if schema_type(bsch)!=schema_type(csch) and schema_type(bsch) and schema_type(csch):
                    add(findings,f"{prefix}-property-type-changed",f"{loc}/properties/{name}",f"type changed from {schema_type(bsch)} to {schema_type(csch)}",blocking)
                be=set(bsch.get("enum",[]) or []); ce=set(csch.get("enum",[]) or [])
                for value in sorted(be-ce,key=str):
                    add(findings,"enum-value-removed",f"{loc}/properties/{name}",f"enum value removed: {value}",blocking)

def compare(base,cand,blocking):
    findings=[]
    bpaths=base.get("paths",{}) or {}; cpaths=cand.get("paths",{}) or {}
    for path,bpi in bpaths.items():
        if path not in cpaths:
            add(findings,"removed-path",f"paths/{path}","path removed",blocking); continue
        cpi=cpaths[path]
        for method,bop in bpi.items():
            if method.lower() not in HTTP_METHODS or not isinstance(bop,dict): continue
            cop=cpi.get(method)
            if not isinstance(cop,dict):
                add(findings,"removed-operation",f"paths/{path}/{method}","operation removed",blocking); continue
            bp=parameters(bpi,bop); cp=parameters(cpi,cop)
            for key,p in bp.items():
                loc=f"paths/{path}/{method}/parameters/{key[1]}:{key[0]}"
                if key not in cp: add(findings,"parameter-removed",loc,"parameter removed",blocking); continue
                q=cp[key]
                if not p.get("required",False) and q.get("required",False): add(findings,"parameter-made-required",loc,"parameter became required",blocking)
                bt=schema_type(p.get("schema",{})); ct=schema_type(q.get("schema",{}))
                if bt and ct and bt!=ct: add(findings,"request-property-type-changed",loc,f"parameter type changed from {bt} to {ct}",blocking)
            br=deref_schema(bop.get("requestBody",{})); cr=deref_schema(cop.get("requestBody",{}))
            if br and cr: compare_schema(br,cr,f"paths/{path}/{method}/requestBody","request",findings,blocking,True)
            bresp=bop.get("responses",{}) or {}; cresp=cop.get("responses",{}) or {}
            for status,bv in bresp.items():
                if status not in cresp:
                    add(findings,"removed-response-status",f"paths/{path}/{method}/responses/{status}","response status removed",blocking); continue
                bs=deref_schema(bv); cs=deref_schema(cresp[status])
                if bs and cs: compare_schema(bs,cs,f"paths/{path}/{method}/responses/{status}","response",findings,blocking,False)
    return findings

def main(argv=None):
    ap=argparse.ArgumentParser()
    ap.add_argument("--baseline",required=True); ap.add_argument("--candidate",required=True); ap.add_argument("--policy",required=True); ap.add_argument("--output",required=True)
    args=ap.parse_args(argv)
    result={"status":"validation-error","baseline":args.baseline,"candidate":args.candidate,"findings":[],"blocking_count":0,"errors":[]}
    try:
        base=load_doc(args.baseline); cand=load_doc(args.candidate); policy=load_policy(args.policy)
        if not isinstance(base,dict) or not isinstance(cand,dict): raise RuntimeError("spec root must be an object")
        if "openapi" not in base or "openapi" not in cand: raise RuntimeError("both inputs must contain an openapi version")
        blocking=set(policy.get("blocking_changes",list(DEFAULT_BLOCKING)))
        result["findings"]=compare(base,cand,blocking)
        result["blocking_count"]=sum(1 for f in result["findings"] if f["blocking"])
        result["status"]="blocked" if result["blocking_count"] else "pass"
    except Exception as e:
        result["errors"].append(str(e))
    Path(args.output).write_text(json.dumps(result,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    return 0 if result["status"]=="pass" else (2 if result["status"]=="blocked" else 3)

if __name__=="__main__": sys.exit(main())

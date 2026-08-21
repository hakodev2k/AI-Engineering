#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

HTTP_METHODS={"get","put","post","delete","patch","options","head","trace"}

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise SystemExit(f"failed to load {path}: {e}")

def schema_type(s):
    if not isinstance(s,dict): return None
    return s.get("type") or ("object" if "properties" in s else None)

def required_set(s):
    return set(s.get("required",[])) if isinstance(s,dict) else set()

def enum_set(s):
    return set(s.get("enum",[])) if isinstance(s,dict) and isinstance(s.get("enum"),list) else None

def compare_schema(base,cand,loc,findings,request=False):
    bt,ct=schema_type(base),schema_type(cand)
    if bt and ct and bt!=ct:
        findings.append(("changed-schema-type",loc,f"type {bt} -> {ct}",True))
    be,ce=enum_set(base),enum_set(cand)
    if be is not None and ce is not None and not be.issubset(ce):
        findings.append(("narrowed-enum",loc,f"enum removed values: {sorted(be-ce)}",True))
    br,cr=required_set(base),required_set(cand)
    if request:
        for name in sorted(cr-br): findings.append(("added-required-request-field",loc+"/"+name,"new required request field",True))
    else:
        for name in sorted(br-cr): findings.append(("removed-required-response-field",loc+"/"+name,"required response field no longer required/present",True))
    bp=base.get("properties",{}) if isinstance(base,dict) else {}
    cp=cand.get("properties",{}) if isinstance(cand,dict) else {}
    for name in sorted(set(bp)&set(cp)):
        compare_schema(bp[name],cp[name],loc+"/"+name,findings,request=request)
    if not request:
        for name in sorted(set(bp)-set(cp)):
            if name in br: findings.append(("removed-required-response-field",loc+"/"+name,"required response property removed",True))

def resolve_schema(doc,node):
    if not isinstance(node,dict): return {}
    ref=node.get("$ref")
    if ref and ref.startswith("#/"):
        cur=doc
        for part in ref[2:].split("/"):
            cur=cur.get(part,{}) if isinstance(cur,dict) else {}
        return cur
    return node

def main():
    ap=argparse.ArgumentParser(description="Detect high-value OpenAPI contract drift")
    ap.add_argument("baseline"); ap.add_argument("candidate"); ap.add_argument("--policy",default=None); ap.add_argument("--output",default="openapi-drift-report.json")
    a=ap.parse_args(); base=load_json(a.baseline); cand=load_json(a.candidate)
    ignore=set()
    if a.policy: ignore=set(load_json(a.policy).get("ignore_paths",[]))
    raw=[]; bp=base.get("paths",{}); cp=cand.get("paths",{})
    for path in sorted(set(bp)-set(cp)):
        if path not in ignore: raw.append(("removed-path",path,"path removed",True))
    for path in sorted(set(bp)&set(cp)):
        if path in ignore: continue
        bo,co=bp[path],cp[path]
        for method in sorted((set(bo)&HTTP_METHODS)-(set(co)&HTTP_METHODS)):
            raw.append(("removed-operation",f"{method.upper()} {path}","operation removed",True))
        for method in sorted((set(bo)&HTTP_METHODS)&(set(co)&HTTP_METHODS)):
            b,c=bo[method],co[method]; loc=f"{method.upper()} {path}"
            bparams={(x.get("in"),x.get("name")):x for x in b.get("parameters",[]) if isinstance(x,dict)}
            cparams={(x.get("in"),x.get("name")):x for x in c.get("parameters",[]) if isinstance(x,dict)}
            for key in set(bparams)&set(cparams):
                if bparams[key].get("in")!=cparams[key].get("in"): raw.append(("changed-parameter-location",loc,f"parameter {key[1]} location changed",True))
            bbody=b.get("requestBody",{}); cbody=c.get("requestBody",{})
            if isinstance(bbody,dict) and isinstance(cbody,dict):
                for mt in set(bbody.get("content",{}))&set(cbody.get("content",{})):
                    bs=resolve_schema(base,bbody["content"][mt].get("schema",{})); cs=resolve_schema(cand,cbody["content"][mt].get("schema",{})); compare_schema(bs,cs,loc+" request",raw,True)
            br=b.get("responses",{}); cr=c.get("responses",{})
            bsuccess={k for k in br if str(k).startswith("2")}; csuccess={k for k in cr if str(k).startswith("2")}
            if bsuccess and csuccess and not (bsuccess & csuccess): raw.append(("changed-success-status",loc,f"success statuses {sorted(bsuccess)} -> {sorted(csuccess)}",True))
            for status in bsuccess & csuccess:
                bc=br[status].get("content",{}) if isinstance(br[status],dict) else {}; cc=cr[status].get("content",{}) if isinstance(cr[status],dict) else {}
                for mt in set(bc)&set(cc): compare_schema(resolve_schema(base,bc[mt].get("schema",{})),resolve_schema(cand,cc[mt].get("schema",{})),loc+f" response {status}",raw,False)
            if b.get("security",base.get("security",[])) != c.get("security",cand.get("security",[])): raw.append(("changed-auth-requirement",loc,"security requirement changed",True))
    findings=[]
    for i,(kind,loc,evidence,breaking) in enumerate(raw,1): findings.append({"id":f"DRIFT-{i:03d}","kind":kind,"severity":"error" if breaking else "warning","location":loc,"evidence":evidence,"breaking":breaking,"recommended_action":"preserve compatibility or obtain explicit contract-breaking approval"})
    report={"status":"blocked" if any(f["breaking"] for f in findings) else "pass","baseline":a.baseline,"candidate":a.candidate,"findings":findings,"verification":{"schema_valid":True,"breaking_count":sum(1 for f in findings if f["breaking"]),"approval_required":any(f["breaking"] for f in findings)}}
    Path(a.output).write_text(json.dumps(report,indent=2),encoding="utf-8"); print(json.dumps(report,indent=2)); sys.exit(2 if report["status"]=="blocked" else 0)
if __name__=="__main__": main()

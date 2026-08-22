#!/usr/bin/env python3
import argparse, json, os, re, sys
from datetime import datetime, timezone

def load(path):
    with open(path,"r",encoding="utf-8") as f: return json.load(f)

def value_type(v):
    if v is None:return "null"
    if isinstance(v,bool):return "boolean"
    if isinstance(v,(int,float)):return "number"
    if isinstance(v,list):return "array"
    if isinstance(v,dict):return "object"
    return "string"

def main():
    p=argparse.ArgumentParser(description="Build a redacted config snapshot from a JSON key/value source and optional metadata map.")
    p.add_argument("--input",required=True); p.add_argument("--policy",required=True); p.add_argument("--output",required=True)
    p.add_argument("--application",required=True); p.add_argument("--environment",required=True); p.add_argument("--kind",choices=["expected","runtime"],required=True); p.add_argument("--producer",required=True); p.add_argument("--source",required=True)
    p.add_argument("--metadata",help="Optional JSON object keyed by config key with classification, required, source, fingerprint")
    a=p.parse_args()
    try: data,policy=load(a.input),load(a.policy); meta=load(a.metadata) if a.metadata else {}
    except Exception as e: print(f"ERROR: {e}",file=sys.stderr); return 2
    if not isinstance(data,dict) or not isinstance(meta,dict): print("ERROR: input and metadata must be JSON objects",file=sys.stderr); return 2
    pats=[re.compile(x,re.I) for x in policy.get("secret_name_patterns",[])]
    entries=[]
    for key in sorted(data):
        m=meta.get(key,{}) if isinstance(meta.get(key,{}),dict) else {}
        cls=m.get("classification") or ("secret" if any(r.search(key) for r in pats) else "public")
        v=data[key]; e={"key":key,"classification":cls,"required":bool(m.get("required",False)),"present":True,"source":m.get("source",a.source),"value_type":value_type(v)}
        if cls=="secret": e["fingerprint"]=m.get("fingerprint")
        else: e["value"]=v
        entries.append(e)
    snap={"application":a.application,"environment":a.environment,"snapshot_kind":a.kind,"producer":a.producer,"generated_at":datetime.now(timezone.utc).isoformat(),"sources":[a.source],"entries":entries}
    with open(a.output,"w",encoding="utf-8") as f: json.dump(snap,f,indent=2,sort_keys=True)
    print(json.dumps({"status":"created","entries":len(entries),"output":a.output},indent=2)); return 0
if __name__=="__main__": raise SystemExit(main())

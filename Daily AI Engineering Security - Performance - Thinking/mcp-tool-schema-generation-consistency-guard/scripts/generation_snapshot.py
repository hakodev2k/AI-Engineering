#!/usr/bin/env python3
"""Build an immutable metadata-generation descriptor from a validated MCP tools catalog."""
from __future__ import annotations
import argparse, hashlib, json, sys, time
from pathlib import Path

def h(v):
    return hashlib.sha256(json.dumps(v,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()

def main():
    p=argparse.ArgumentParser(); p.add_argument("--catalog",required=True,type=Path); p.add_argument("--generation",required=True); p.add_argument("--out",required=True,type=Path); a=p.parse_args()
    try: data=json.loads(a.catalog.read_text(encoding="utf-8"))
    except Exception as e: print(f"error: {e}",file=sys.stderr); return 2
    if not isinstance(data,dict) or not isinstance(data.get("tools"),list): print("error: invalid catalog",file=sys.stderr); return 2
    tools={}
    for t in data["tools"]:
        if not isinstance(t,dict) or not isinstance(t.get("name"),str): print("error: invalid tool",file=sys.stderr); return 2
        tools[t["name"]]={"schema_hash":h(t.get("outputSchema")) if "outputSchema" in t else None,"schema_expected":"outputSchema" in t,"task_support":((t.get("execution") or {}).get("taskSupport"))}
    result={"generation_id":a.generation,"catalog_hash":h(data),"created_unix":int(time.time()),"tools":tools}
    try:
        a.out.parent.mkdir(parents=True,exist_ok=True)
        tmp=a.out.with_suffix(a.out.suffix+".tmp"); tmp.write_text(json.dumps(result,indent=2,sort_keys=True)+"\n",encoding="utf-8"); tmp.replace(a.out)
    except Exception as e: print(f"error: cannot publish snapshot: {e}",file=sys.stderr); return 3
    print(json.dumps({"ok":True,"generation_id":a.generation,"catalog_hash":result["catalog_hash"],"tools":len(tools)})); return 0
if __name__=="__main__": raise SystemExit(main())

#!/usr/bin/env python3
"""Conservative preflight for semantic side effects in read-only MCP operations."""
import argparse, json, re, sys
from pathlib import Path

WRITE_STAGES={"$out","$merge"}
SQL_RISK=re.compile(r"\b(insert|update|delete|merge|alter|drop|create|truncate|grant|revoke|copy|call|execute)\b|\bpg_(terminate_backend|cancel_backend|reload_conf)\s*\(",re.I)
CYPHER_RISK=re.compile(r"\b(create|merge|delete|detach\s+delete|set|remove|drop)\b|\bcall\b",re.I)

def classify(mode,obj):
    if mode=="documentdb":
        pipeline=obj.get("pipeline") if isinstance(obj,dict) else None
        if not isinstance(pipeline,list): return "unknown","pipeline must be a list"
        for stage in pipeline:
            if not isinstance(stage,dict): return "unknown","pipeline stage must be an object"
            keys=set(stage)
            hit=keys & WRITE_STAGES
            if hit: return "write","write-capable aggregation stage: "+",".join(sorted(hit))
        return "read","no known write-capable aggregation stage"
    query=obj.get("query") if isinstance(obj,dict) else None
    if not isinstance(query,str) or not query.strip(): return "unknown","query must be a non-empty string"
    if mode=="sql":
        if ";" in query.rstrip().rstrip(";"): return "unknown","multiple SQL statements are not accepted"
        if SQL_RISK.search(query): return "write","side-effect-capable SQL token/function"
        if not re.match(r"^\s*(select|with|explain)\b",query,re.I): return "unknown","not a recognized read query"
        return "read","recognized read query without known risky token"
    if mode=="cypher":
        if CYPHER_RISK.search(query): return "write","write/procedure-capable Cypher construct"
        if not re.match(r"^\s*(match|optional\s+match|return|with|unwind)\b",query,re.I): return "unknown","not a recognized read query"
        return "read","recognized read Cypher without known risky token"
    return "unknown","unsupported mode"

def main():
    p=argparse.ArgumentParser(); p.add_argument("--mode",choices=["documentdb","sql","cypher"],required=True); p.add_argument("--input",required=True)
    a=p.parse_args()
    try: obj=json.loads(Path(a.input).read_text(encoding="utf-8"))
    except Exception as e: print(json.dumps({"decision":"error","reason":str(e)})); return 3
    effect,reason=classify(a.mode,obj); decision="allow" if effect=="read" else "block"
    print(json.dumps({"decision":decision,"effect":effect,"reason":reason},sort_keys=True))
    return 0 if decision=="allow" else 2
if __name__=="__main__": sys.exit(main())

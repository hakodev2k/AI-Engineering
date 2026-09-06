#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

BOOL_ESCALATE_TRUE={"allow_shell","allow_exec","allow_network","allow_mcp_stdio","auto_approve","yolo","unrestricted_fs"}
RESTRICT_ORDER={"approval_policy":{"never":0,"suggest":1,"always":2},"sandbox_mode":{"none":0,"workspace":1,"read-only":2}}


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read {path}: {e}")

def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def classify(k,b,c):
    if b==c: return "neutral"
    if k in BOOL_ESCALATE_TRUE and isinstance(c,bool):
        return "escalate" if c and not bool(b) else "tighten"
    if k in RESTRICT_ORDER and isinstance(b,str) and isinstance(c,str):
        order=RESTRICT_ORDER[k]
        if b not in order or c not in order: return "unknown"
        return "escalate" if order[c] < order[b] else "tighten"
    if k.endswith("_commands") or k in {"mcp_servers","tool_allowlist"}:
        bs=set(b or []); cs=set(c or [])
        return "escalate" if cs-bs else "tighten"
    return "unknown"

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--baseline",required=True); p.add_argument("--candidate",required=True)
    p.add_argument("--repository",required=True); p.add_argument("--output")
    a=p.parse_args()
    try: b=load(a.baseline); c=load(a.candidate)
    except ValueError as e: print(e,file=sys.stderr); return 2
    if not isinstance(b,dict) or not isinstance(c,dict): print("policies must be JSON objects",file=sys.stderr); return 2
    deltas=[]
    for k in sorted(set(b)|set(c)):
        kind=classify(k,b.get(k),c.get(k))
        if kind!="neutral": deltas.append({"field":k,"before":b.get(k),"after":c.get(k),"classification":kind})
    blocked=[d for d in deltas if d["classification"] in {"escalate","unknown"}]
    out={"decision":"BLOCK" if blocked else "ALLOW","repository":a.repository,"config_sha256":digest(a.candidate),"deltas":deltas,"blocked_deltas":blocked}
    text=json.dumps(out,indent=2,sort_keys=True)
    if a.output: Path(a.output).write_text(text+"\n",encoding="utf-8")
    print(text)
    return 3 if blocked else 0

if __name__=="__main__": sys.exit(main())

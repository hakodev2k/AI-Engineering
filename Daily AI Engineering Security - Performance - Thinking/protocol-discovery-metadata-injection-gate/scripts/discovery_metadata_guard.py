#!/usr/bin/env python3
import argparse, hashlib, json, re, sys
from pathlib import Path

DEFAULT_PATTERNS=[r"ignore\s+(all\s+)?previous",r"system\s*:",r"developer\s*:",r"reveal.*(secret|token|key)",r"read.*(ssh|credential|\.env)",r"disable.*(security|approval)",r"grant.*permission",r"send.*(secret|credential|key)"]
TEXT_KEYS={"instructions","description","title","name","summary"}

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read JSON {path}: {e}")

def sha(obj):
    return hashlib.sha256(json.dumps(obj,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()

def walk(obj,path="$",out=None):
    out=[] if out is None else out
    if isinstance(obj,dict):
        for k,v in obj.items():
            p=f"{path}.{k}"
            if isinstance(v,str) and (k in TEXT_KEYS or k in {"skills","tools"}): out.append((p,v))
            walk(v,p,out)
    elif isinstance(obj,list):
        for i,v in enumerate(obj): walk(v,f"{path}[{i}]",out)
    return out

def guard(payload,policy):
    max_chars=int(policy.get("max_text_chars",4000)); patterns=policy.get("risky_patterns",DEFAULT_PATTERNS)
    compiled=[re.compile(p,re.I) for p in patterns]
    findings=[]; fields=[]
    for path,text in walk(payload):
        original_len=len(text); admitted=text[:max_chars]
        hits=[p.pattern for p in compiled if p.search(admitted)]
        if original_len>max_chars: findings.append({"path":path,"type":"length_limit","original_chars":original_len})
        if hits: findings.append({"path":path,"type":"instruction_like_content","patterns":hits})
        fields.append({"path":path,"provenance":"remote-discovery","trusted_as_instruction":False,"text":admitted})
    return {"schema_version":1,"input_sha256":sha(payload),"decision":"quarantine" if any(f["type"]=="instruction_like_content" for f in findings) else "data_only","allowed_actions":policy.get("allowed_actions",[]),"approval_required_actions":policy.get("approval_required_actions",[]),"fields":fields,"findings":findings}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("input"); ap.add_argument("--policy",required=True); ap.add_argument("--out")
    a=ap.parse_args()
    try:
        payload=load_json(a.input); policy=load_json(a.policy)
        if not isinstance(payload,dict) or not isinstance(policy,dict): raise ValueError("input and policy must be JSON objects")
        result=guard(payload,policy); text=json.dumps(result,indent=2,ensure_ascii=False)
        if a.out: Path(a.out).write_text(text+"\n",encoding="utf-8")
        else: print(text)
        return 0
    except Exception as e:
        print(f"error: {e}",file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())

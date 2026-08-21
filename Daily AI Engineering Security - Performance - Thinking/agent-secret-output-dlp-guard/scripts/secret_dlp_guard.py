#!/usr/bin/env python3
"""Deterministic pre-tool risk checks and post-tool secret redaction.

Standard library only.
Exit codes: 0 success/allow, 2 invalid input/policy, 3 denied/blocked, 4 I/O/scanner failure.
"""
from __future__ import annotations
import argparse, hashlib, json, os, re, sys
from pathlib import Path
from typing import Any


def load_json(path: str) -> dict[str, Any]:
    try:
        data=json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e:
        raise ValueError(f"invalid json {path}: {e}")
    if not isinstance(data,dict): raise ValueError("policy root must be object")
    return data


def known_secrets(policy: dict[str,Any]) -> list[tuple[str,str]]:
    names=policy.get("known_secret_env_names",[])
    exact=[]
    upper_patterns=[str(x).upper() for x in names]
    for k,v in os.environ.items():
        if not v or len(v)<4: continue
        ku=k.upper()
        if any(p in ku for p in upper_patterns): exact.append((k,v))
    exact.sort(key=lambda kv: len(kv[1]), reverse=True)
    return exact


def digest(value:str)->str:
    return hashlib.sha256(value.encode("utf-8",errors="replace")).hexdigest()[:16]


def sanitize_text(text:str, policy:dict[str,Any])->tuple[str,list[dict[str,Any]],bool]:
    findings=[]; blocked=False; spans=[]
    for name,value in known_secrets(policy):
        start=0
        while True:
            i=text.find(value,start)
            if i<0: break
            spans.append((i,i+len(value),"known-secret",f"env:{name}",value))
            start=i+len(value)
    for item in policy.get("secret_patterns",[]):
        try: rgx=re.compile(item["regex"])
        except Exception as e: raise ValueError(f"bad regex {item}: {e}")
        for m in rgx.finditer(text):
            val=m.group(0); reason=item.get("name","pattern")
            spans.append((m.start(),m.end(),reason,"pattern",val))
            if reason=="private_key_header" and policy.get("block_on_private_key",True): blocked=True
    keyrx=re.compile(policy.get("key_name_regex",r"(?i)(token|secret|password)"))
    assign=re.compile(r"(?m)^\s*([A-Za-z_][A-Za-z0-9_.-]{1,80})\s*[:=]\s*([^\s#]{4,})")
    for m in assign.finditer(text):
        if keyrx.search(m.group(1)):
            val=m.group(2); spans.append((m.start(2),m.end(2),"sensitive-assignment","key-name",val))
    # merge by preferring longest overlap
    spans.sort(key=lambda s:(s[0],-(s[1]-s[0])))
    chosen=[]; end=-1
    for s in spans:
        if s[0]>=end:
            chosen.append(s); end=s[1]
    out=[]; pos=0; repl=policy.get("replacement","<REDACTED:{reason}>")
    for a,b,reason,det,val in chosen:
        out.append(text[pos:a]); out.append(repl.format(reason=reason)); pos=b
        findings.append({"reason":reason,"detector":det,"sha256_prefix":digest(val),"length":len(val)})
    out.append(text[pos:])
    return "".join(out),findings,blocked


def precheck(args,policy):
    target=args.target or ""; low=target.lower()
    sensitive=False; reason=[]
    for pat in policy.get("sensitive_path_patterns",[]):
        if re.search(pat,target,re.I): sensitive=True; reason.append("sensitive-path")
    broad=[r"(^|[;&|]\s*)(env|printenv)(\s|$)",r"cat\s+/proc/self/environ",r"(^|[;&|]\s*)set(\s|$)",r"export\s+-p"]
    if any(re.search(p,target,re.I) for p in broad): sensitive=True; reason.append("environment-dump")
    decision="deny" if sensitive else "allow"
    print(json.dumps({"decision":decision,"reasons":sorted(set(reason)),"tool":args.tool},indent=2))
    return 3 if sensitive else 0


def sanitize(args,policy):
    p=Path(args.input)
    if not p.is_file(): print(json.dumps({"error":"input missing"}),file=sys.stderr); return 4
    raw=p.read_bytes(); maxb=int(policy.get("max_output_bytes",1048576))
    if len(raw)>maxb:
        safe={"dlp_status":"blocked","reason":"output-too-large","bytes":len(raw)}
        Path(args.output).write_text(json.dumps(safe,indent=2)+"\n",encoding="utf-8")
        if args.audit: Path(args.audit).write_text(json.dumps({"event":"blocked","reason":"output-too-large"},indent=2)+"\n",encoding="utf-8")
        return 3
    try: text=raw.decode("utf-8",errors="replace"); clean,findings,blocked=sanitize_text(text,policy)
    except Exception as e:
        Path(args.output).write_text(json.dumps({"dlp_status":"blocked","reason":"dlp_scanner_failed"},indent=2)+"\n",encoding="utf-8")
        print(json.dumps({"error":str(e)}),file=sys.stderr); return 4
    status="blocked" if blocked else ("redacted" if findings else "clean")
    payload={"dlp_status":status,"dlp_version":policy.get("version",1),"content":None if blocked else clean,"redaction_count":len(findings)}
    Path(args.output).write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    if args.audit:
        Path(args.audit).write_text(json.dumps({"event":"tool-output-dlp","status":status,"findings":findings},indent=2)+"\n",encoding="utf-8")
    return 3 if blocked else 0


def verify(args,policy):
    data=load_json(args.input); ok=data.get("dlp_status") in {"clean","redacted","blocked"} and data.get("dlp_version")==policy.get("version",1)
    print(json.dumps({"verified":ok},indent=2)); return 0 if ok else 3


def main():
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest="cmd",required=True)
    p=sub.add_parser("precheck"); p.add_argument("--tool",required=True); p.add_argument("--target",default=""); p.add_argument("--policy",required=True)
    s=sub.add_parser("sanitize"); s.add_argument("--input",required=True); s.add_argument("--output",required=True); s.add_argument("--audit"); s.add_argument("--policy",required=True)
    v=sub.add_parser("verify"); v.add_argument("--input",required=True); v.add_argument("--policy",required=True)
    a=ap.parse_args()
    try: policy=load_json(a.policy)
    except ValueError as e: print(json.dumps({"error":str(e)}),file=sys.stderr); return 2
    if a.cmd=="precheck": return precheck(a,policy)
    if a.cmd=="sanitize": return sanitize(a,policy)
    return verify(a,policy)

if __name__=="__main__": raise SystemExit(main())
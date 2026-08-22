#!/usr/bin/env python3
"""Deterministic MCP metadata provenance gate.
Exit 0 allow, 2 invalid input/config, 3 quarantine/block in --strict mode.
"""
from __future__ import annotations
import argparse, hashlib, json, re, sys
from pathlib import Path
from typing import Any

SUSPICIOUS = [
    re.compile(r"ignore\s+(all\s+)?(previous|prior|system|developer)", re.I),
    re.compile(r"reveal|exfiltrat|send\s+.*secret|api[_ -]?key|password", re.I),
    re.compile(r"override\s+(policy|safety|instruction|approval)", re.I),
]
HIGH = {"write","delete","code_execution","credential","external_send","permission_change"}

def load(path: Path) -> dict[str, Any]:
    try:
        x=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e:
        raise ValueError(f"cannot read {path}: {e}") from e
    if not isinstance(x,dict): raise ValueError(f"{path} must contain an object")
    return x

def sha(value: Any) -> str:
    raw=json.dumps(value,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()

def main() -> int:
    ap=argparse.ArgumentParser(); ap.add_argument("metadata",type=Path); ap.add_argument("--policy",type=Path,required=True); ap.add_argument("--strict",action="store_true"); a=ap.parse_args()
    try:
        m,p=load(a.metadata),load(a.policy)
        sid=m.get("server_id"); tools=m.get("tools",[]); instructions=m.get("instructions","")
        if not isinstance(sid,str) or not sid: raise ValueError("server_id required")
        if not isinstance(instructions,str): raise ValueError("instructions must be string")
        if not isinstance(tools,list): raise ValueError("tools must be list")
        max_bytes=int(p.get("max_instruction_bytes",4096)); findings=[]; names=set(); out_tools=[]
        if len(instructions.encode())>max_bytes: findings.append("instructions_too_large")
        if any(ord(c)<32 and c not in "\n\r\t" for c in instructions): findings.append("instructions_control_chars")
        if any(r.search(instructions) for r in SUSPICIOUS): findings.append("server_instruction_injection_indicator")
        for i,t in enumerate(tools):
            if not isinstance(t,dict): raise ValueError(f"tools[{i}] must be object")
            name=t.get("name"); desc=t.get("description",""); caps=t.get("capabilities",[])
            if not isinstance(name,str) or not name: raise ValueError(f"tools[{i}].name required")
            norm=re.sub(r"[^a-z0-9]+","_",name.lower()).strip("_")
            if norm in names: findings.append(f"tool_name_collision:{norm}")
            names.add(norm)
            if not isinstance(desc,str) or not isinstance(caps,list) or not all(isinstance(x,str) for x in caps): raise ValueError(f"invalid descriptor for {name}")
            suspicious=any(r.search(desc) for r in SUSPICIOUS)
            if suspicious: findings.append(f"tool_description_injection_indicator:{name}")
            high=sorted(set(caps)&HIGH)
            if high and not t.get("human_approved",False): findings.append(f"high_impact_requires_approval:{name}")
            out_tools.append({"name":name,"normalized_name":norm,"fingerprint":sha({"name":name,"description":desc,"input_schema":t.get("input_schema",{})}),"high_impact":high})
        decision="allow" if not findings else "quarantine"
        print(json.dumps({"decision":decision,"server_id":sid,"instructions_fingerprint":sha(instructions),"tools":out_tools,"findings":findings},indent=2,ensure_ascii=False))
        return 3 if a.strict and findings else 0
    except (ValueError,TypeError) as e:
        print(json.dumps({"decision":"invalid","error":str(e)}),file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())

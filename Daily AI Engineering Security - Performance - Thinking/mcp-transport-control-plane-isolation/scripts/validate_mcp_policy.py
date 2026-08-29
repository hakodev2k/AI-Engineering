#!/usr/bin/env python3
"""Static deny-by-default MCP transport policy validator."""
from __future__ import annotations
import argparse, ipaddress, json, sys
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlsplit

FORBIDDEN_HEADERS={"host","cookie","forwarded","x-forwarded-for","x-forwarded-host","x-forwarded-proto","x-real-ip","via","proxy-authorization","x-http-method-override","x-original-url","x-rewrite-url","connection","keep-alive","proxy-authenticate","te","trailer","transfer-encoding","upgrade"}
SHELLS={"sh","bash","zsh","fish","cmd","cmd.exe","powershell","pwsh"}
REMOTE={"sse","http","streamable-http"}

def bad_ip(host:str)->bool:
    try: ip=ipaddress.ip_address(host.strip("[]"))
    except ValueError: return False
    if isinstance(ip,ipaddress.IPv6Address) and ip.ipv4_mapped: ip=ip.ipv4_mapped
    return any((ip.is_private,ip.is_loopback,ip.is_link_local,ip.is_multicast,ip.is_reserved,ip.is_unspecified))

def validate_url(url:str,label:str)->list[str]:
    out=[]
    try: p=urlsplit(url)
    except ValueError as e: return [f"{label}: invalid URL: {e}"]
    if p.scheme not in {"http","https"}: out.append(f"{label}: scheme must be http or https")
    if not p.hostname: out.append(f"{label}: hostname is required")
    if p.username is not None or p.password is not None: out.append(f"{label}: URL credentials are forbidden")
    if p.hostname and bad_ip(p.hostname): out.append(f"{label}: unsafe IP-literal destination")
    raw=p.path or "/"; low=raw.lower(); decoded=unquote(raw)
    if "\\" in raw or any(x in low for x in ("%2e","%2f","%5c","%25")): out.append(f"{label}: encoded/backslash path tricks are forbidden")
    if any(seg in {".",".."} for seg in decoded.split("/")): out.append(f"{label}: dot path segments are forbidden")
    try: raw.encode("ascii")
    except UnicodeEncodeError: out.append(f"{label}: non-ASCII URL paths require explicit review")
    return out

def validate(p:dict[str,Any])->list[str]:
    e=[]; enabled=bool(p.get("mcp_enabled",False))
    if enabled and p.get("auth_required") is not True: e.append("mcp_enabled requires auth_required=true")
    limit=p.get("max_sessions_per_client")
    if enabled and (not isinstance(limit,int) or isinstance(limit,bool) or not 1<=limit<=100): e.append("max_sessions_per_client must be an integer in [1,100]")
    allowed=p.get("allowed_executables",[])
    if not isinstance(allowed,list) or not all(isinstance(x,str) and x for x in allowed): e.append("allowed_executables must be non-empty strings"); allowed=[]
    if any(Path(x).name.lower() in SHELLS for x in allowed): e.append("shell interpreters must not appear in allowed_executables")
    user=p.get("user_servers",{})
    if not isinstance(user,dict): e.append("user_servers must be an object"); user={}
    if user.get("enabled") is True:
        grants=user.get("allowed_urls",[])
        if not isinstance(grants,list) or not grants: e.append("enabled user_servers requires non-empty allowed_urls")
        else:
            for i,u in enumerate(grants): e.extend(validate_url(u,f"user_servers.allowed_urls[{i}]") if isinstance(u,str) else [f"user_servers.allowed_urls[{i}] must be a string"])
    headers=user.get("allowed_headers",[])
    if not isinstance(headers,list) or not all(isinstance(h,str) for h in headers): e.append("user_servers.allowed_headers must be a string list")
    else:
        bad=sorted({h.lower() for h in headers}&FORBIDDEN_HEADERS)
        if bad: e.append("forbidden caller-controlled headers: "+", ".join(bad))
    servers=p.get("named_servers",[])
    if not isinstance(servers,list): return e+["named_servers must be a list"]
    names=set()
    for i,s in enumerate(servers):
        label=f"named_servers[{i}]"
        if not isinstance(s,dict): e.append(f"{label} must be an object"); continue
        n=s.get("name")
        if not isinstance(n,str) or not n.strip(): e.append(f"{label}: non-empty name required")
        elif n in names: e.append(f"{label}: duplicate name {n!r}")
        else: names.add(n)
        t=s.get("transport")
        if t=="stdio":
            cmd=s.get("command")
            if not isinstance(cmd,list) or not cmd or not all(isinstance(x,str) and x for x in cmd): e.append(f"{label}: stdio command must be non-empty argv list"); continue
            exe=Path(cmd[0]).name
            if exe not in {Path(x).name for x in allowed}: e.append(f"{label}: executable {exe!r} is not allowed")
            if exe.lower() in SHELLS: e.append(f"{label}: shell interpreter is forbidden")
            if any(a.lower() in {"-c","/c","--eval","-e"} for a in cmd[1:]): e.append(f"{label}: command contains shell/eval-style argument")
            if "url" in s: e.append(f"{label}: stdio server must not define url")
        elif t in REMOTE:
            u=s.get("url")
            e.extend(validate_url(u,f"{label}.url") if isinstance(u,str) else [f"{label}: remote transport requires url"])
            if "command" in s: e.append(f"{label}: remote server must not define command")
        else: e.append(f"{label}: unsupported transport {t!r}")
    return e

def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument("policy",type=Path); ap.add_argument("--json",action="store_true"); a=ap.parse_args()
    try:
        raw=json.loads(a.policy.read_text(encoding="utf-8"))
        if not isinstance(raw,dict): raise ValueError("top-level policy must be an object")
    except (OSError,json.JSONDecodeError,ValueError) as ex: print(f"ERROR: {ex}",file=sys.stderr); return 2
    errs=validate(raw)
    if a.json: print(json.dumps({"ok":not errs,"violations":errs},indent=2))
    elif errs:
        print("FAIL"); [print(f"- {x}") for x in errs]
    else: print("PASS")
    return 1 if errs else 0

if __name__=="__main__": raise SystemExit(main())

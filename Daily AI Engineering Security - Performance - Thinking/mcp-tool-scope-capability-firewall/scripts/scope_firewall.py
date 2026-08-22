#!/usr/bin/env python3
"""Evaluate an MCP tool request against a least-privilege capability envelope.
Exit: 0 allow, 2 invalid, 4 approval required, 5 deny.
"""
from __future__ import annotations
import argparse, fnmatch, json, sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse
ALLOW, INVALID, APPROVAL, DENY = 0, 2, 4, 5

def load(path: Path) -> dict[str, Any]:
    try: data=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(data,dict): raise ValueError(f"{path} must contain JSON object")
    return data

def matches(value: str, patterns: list[str]) -> bool:
    return any(fnmatch.fnmatchcase(value,p) for p in patterns)

def path_allowed(raw: str, roots: list[str]) -> tuple[bool,str]:
    target=Path(raw).expanduser().resolve(strict=False)
    for root in roots:
        r=Path(root).expanduser().resolve(strict=False)
        try: target.relative_to(r); return True,str(target)
        except ValueError: pass
    return False,str(target)

def decide(req: dict[str,Any], policy: dict[str,Any]) -> tuple[dict[str,Any],int]:
    tool=req.get("tool"); op=req.get("operation"); target=req.get("target")
    if not isinstance(tool,str) or not tool: raise ValueError("tool required")
    if not isinstance(op,str) or not op: raise ValueError("operation required")
    if not isinstance(target,dict): raise ValueError("target object required")
    rule=policy.get("tools",{}).get(tool)
    if not isinstance(rule,dict): return {"decision":"deny","reason":"unknown_tool","tool":tool},DENY
    if op not in rule.get("operations",[]): return {"decision":"deny","reason":"operation_not_allowed","tool":tool},DENY
    normalized={}
    if "repos" in rule:
        repo=target.get("repo")
        if not isinstance(repo,str) or not matches(repo,rule["repos"]): return {"decision":"deny","reason":"repo_out_of_scope","tool":tool},DENY
        normalized["repo"]=repo
    if "branches" in rule:
        branch=target.get("branch")
        if not isinstance(branch,str) or not matches(branch,rule["branches"]): return {"decision":"deny","reason":"branch_out_of_scope","tool":tool},DENY
        normalized["branch"]=branch
    if "roots" in rule:
        raw=target.get("path")
        if not isinstance(raw,str): return {"decision":"deny","reason":"path_missing","tool":tool},DENY
        ok,resolved=path_allowed(raw,rule["roots"]); normalized["path"]=resolved
        if not ok: return {"decision":"deny","reason":"path_out_of_scope","tool":tool,"normalized_target":normalized},DENY
    if "hosts" in rule:
        raw=target.get("url")
        if not isinstance(raw,str): return {"decision":"deny","reason":"url_missing","tool":tool},DENY
        parsed=urlparse(raw); host=(parsed.hostname or "").lower()
        if parsed.scheme not in {"https"} or not host or not matches(host,[h.lower() for h in rule["hosts"]]): return {"decision":"deny","reason":"host_out_of_scope","tool":tool},DENY
        normalized["host"]=host
    result={"tool":tool,"operation":op,"normalized_target":normalized}
    if rule.get("require_approval") is True and req.get("approval") is not True:
        return result|{"decision":"approval_required","reason":"high_impact_policy"},APPROVAL
    return result|{"decision":"allow","reason":"within_capability_envelope"},ALLOW

def main() -> int:
    ap=argparse.ArgumentParser(); ap.add_argument("request",type=Path); ap.add_argument("--policy",type=Path,required=True); a=ap.parse_args()
    try: out,code=decide(load(a.request),load(a.policy))
    except (ValueError,TypeError) as exc: print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return INVALID
    print(json.dumps(out,indent=2,ensure_ascii=False)); return code
if __name__=="__main__": raise SystemExit(main())

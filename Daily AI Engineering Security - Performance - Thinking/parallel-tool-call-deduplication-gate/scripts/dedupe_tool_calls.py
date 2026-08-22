#!/usr/bin/env python3
"""Collapse equivalent parallel tool calls according to explicit policy.
Exit: 0 safe output, 2 invalid input/config, 4 review required.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path
from typing import Any


def load(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def signature(name: str, args: Any) -> str:
    raw = json.dumps({"name": name, "args": args}, sort_keys=True, separators=(",", ":"), ensure_ascii=False, allow_nan=False)
    return hashlib.sha256(raw.encode()).hexdigest()


def validate_calls(data: Any, max_calls: int) -> list[dict[str, Any]]:
    if not isinstance(data, list): raise ValueError("calls must be a JSON array")
    if len(data) > max_calls: raise ValueError(f"call count exceeds {max_calls}")
    seen_ids=set(); out=[]
    for i,c in enumerate(data):
        if not isinstance(c,dict): raise ValueError(f"call {i} must be object")
        if not isinstance(c.get("id"),str) or not c["id"]: raise ValueError(f"call {i} id required")
        if c["id"] in seen_ids: raise ValueError(f"duplicate call id {c['id']}")
        seen_ids.add(c["id"])
        if not isinstance(c.get("name"),str) or not c["name"]: raise ValueError(f"call {i} name required")
        if "args" not in c: raise ValueError(f"call {i} args required")
        signature(c["name"],c["args"])
        out.append(c)
    return out


def run(calls: list[dict[str,Any]], policy: dict[str,Any]) -> tuple[dict[str,Any],int]:
    default=policy.get("default_policy","review")
    if default not in {"collapse","allow","review"}: raise ValueError("invalid default_policy")
    tool_p=policy.get("tools",{}); max_group=int(policy.get("max_duplicate_group",8))
    groups={}
    for c in calls: groups.setdefault(signature(c["name"],c["args"]),[]).append(c)
    retained=[]; collapsed=[]; reviews=[]
    for sig,grp in groups.items():
        if len(grp)>max_group: reviews.append({"signature":sig,"ids":[x["id"] for x in grp],"reason":"duplicate_group_limit"}); continue
        cfg=tool_p.get(grp[0]["name"],{}); mode=cfg.get("policy",default)
        if mode not in {"collapse","allow","review"}: raise ValueError(f"invalid policy for {grp[0]['name']}")
        if len(grp)==1 or mode=="allow": retained.extend(grp)
        elif mode=="collapse":
            retained.append(grp[0]); collapsed.extend({"id":x["id"],"kept_id":grp[0]["id"],"signature":sig} for x in grp[1:])
        else: reviews.append({"signature":sig,"ids":[x["id"] for x in grp],"reason":"policy_review"})
    report={"retained":retained,"collapsed":collapsed,"review_required":reviews,"input_count":len(calls),"output_count":len(retained)}
    return report, 4 if reviews else 0


def main() -> int:
    ap=argparse.ArgumentParser(); ap.add_argument("calls",type=Path); ap.add_argument("--policy",type=Path,required=True); ap.add_argument("--out",type=Path)
    a=ap.parse_args()
    try:
        p=load(a.policy)
        if not isinstance(p,dict): raise ValueError("policy must be object")
        calls=validate_calls(load(a.calls),int(p.get("max_calls_per_turn",32)))
        report,code=run(calls,p)
        if a.out: a.out.write_text(json.dumps(report["retained"],indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
        print(json.dumps(report,indent=2,ensure_ascii=False)); return code
    except (ValueError,TypeError,OSError) as exc:
        print(json.dumps({"error":str(exc)}),file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())

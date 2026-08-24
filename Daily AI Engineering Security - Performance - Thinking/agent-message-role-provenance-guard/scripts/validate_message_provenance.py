#!/usr/bin/env python3
"""Validate source-to-role provenance invariants for agent context messages.

Input: one JSON object per line with id, role, source_type, origin_id, trusted, content.
Exit: 0 safe, 2 security violation, 3 malformed input.
"""
import argparse, json, re, sys
from pathlib import Path

REQ={"id","role","source_type","origin_id","trusted","content"}
ALLOWED_ROLES={"system","user","assistant","tool"}
PRIV={"user":{"user_input"},"system":{"trusted_system"}}
UNTRUSTED={"tool_result","subagent_result","advisor_result","model_output","memory","retrieved_content"}
PROTECTED=[re.compile(r"<\s*/?\s*system-reminder\b",re.I),re.compile(r"<\s*/?\s*system\b",re.I)]

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("messages",type=Path)
    ap.add_argument("--allow-protected-markup",action="store_true",help="report role/source violations but do not block protected markup")
    a=ap.parse_args()
    if not a.messages.is_file(): print(f"file not found: {a.messages}",file=sys.stderr); return 3
    violations=[]; count=0
    try:
        with a.messages.open(encoding="utf-8") as f:
            for line,raw in enumerate(f,1):
                if not raw.strip(): continue
                m=json.loads(raw); count+=1
                missing=REQ-set(m)
                if missing: raise ValueError(f"line {line}: missing {sorted(missing)}")
                if m["role"] not in ALLOWED_ROLES: raise ValueError(f"line {line}: invalid role {m['role']!r}")
                if not isinstance(m["trusted"],bool): raise ValueError(f"line {line}: trusted must be boolean")
                for k in ("id","origin_id","source_type"):
                    if not isinstance(m[k],str) or not m[k].strip(): raise ValueError(f"line {line}: {k} must be non-empty string")
                if not isinstance(m["content"],str): raise ValueError(f"line {line}: content must be string")
                role,src=m["role"],m["source_type"]
                if role in PRIV and src not in PRIV[role]: violations.append(f"line {line} id={m['id']}: {src} cannot produce role={role}")
                if role=="system" and not m["trusted"]: violations.append(f"line {line} id={m['id']}: untrusted system message")
                if role=="user" and not m["trusted"]: violations.append(f"line {line} id={m['id']}: untrusted user message")
                if src in UNTRUSTED and m["trusted"]: violations.append(f"line {line} id={m['id']}: untrusted source {src} marked trusted")
                if src in UNTRUSTED and not a.allow_protected_markup and any(p.search(m["content"]) for p in PROTECTED):
                    violations.append(f"line {line} id={m['id']}: protected control markup in {src}")
    except (OSError,json.JSONDecodeError,ValueError) as e:
        print(str(e),file=sys.stderr); return 3
    print(json.dumps({"messages":count,"violations":violations},indent=2))
    return 2 if violations else 0

if __name__=="__main__": raise SystemExit(main())

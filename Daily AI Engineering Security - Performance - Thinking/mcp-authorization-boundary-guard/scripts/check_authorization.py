#!/usr/bin/env python3
"""Deterministic MCP authorization policy evaluator. Python 3.9+, stdlib only."""
import argparse, json, sys
from pathlib import Path


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: cannot load {path}: {exc}", file=sys.stderr)
        sys.exit(2)


def deny(reason):
    print(json.dumps({"decision":"deny","reason":reason}, separators=(",",":")))
    return 1


def main():
    p=argparse.ArgumentParser()
    p.add_argument("--policy", required=True)
    p.add_argument("--principal", required=True)
    p.add_argument("--issuer", required=True)
    p.add_argument("--audience", required=True)
    p.add_argument("--resource", required=True)
    p.add_argument("--tool", required=True)
    p.add_argument("--action", required=True)
    p.add_argument("--session-owner", required=True)
    p.add_argument("--approved", action="store_true")
    a=p.parse_args(); policy=load(a.policy)
    if policy.get("fail_closed") is not True: return deny("policy must explicitly fail closed")
    if a.issuer != policy.get("expected_issuer"): return deny("issuer mismatch")
    if a.audience not in policy.get("expected_audiences",[]): return deny("audience/resource indicator mismatch")
    if a.session_owner != a.principal: return deny("session is not bound to authenticated principal")
    principal=policy.get("principals",{}).get(a.principal)
    if not principal: return deny("unknown principal")
    tool=policy.get("tools",{}).get(a.tool)
    if not tool: return deny("tool has no explicit policy")
    if a.tool not in principal.get("tools",[]): return deny("principal not granted tool")
    if a.resource not in principal.get("resources",[]): return deny("principal not granted resource")
    if a.action not in tool.get("actions",[]): return deny("action not granted for tool")
    if tool.get("approval_required") is True and not a.approved: return deny("human approval required")
    print(json.dumps({"decision":"allow","principal":a.principal,"resource":a.resource,"tool":a.tool,"action":a.action}, separators=(",",":")))
    return 0

if __name__ == "__main__": sys.exit(main())

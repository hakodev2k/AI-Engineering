#!/usr/bin/env python3
"""Preflight and verify a subagent output-channel contract.

Exit 0 accepted, 2 malformed input, 4 contract violation.
Contract fields: contract_id, accepted_channels, required_tools, empty_semantics,
fallback_channel. Result: contract_id, channel, status, payload, evidence.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path


def load(path: Path):
    try: obj=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e: raise ValueError(f"cannot read {path}: {e}") from e
    if not isinstance(obj,dict): raise ValueError(f"{path} must contain an object")
    return obj


def string_list(v,name):
    if not isinstance(v,list) or not v or not all(isinstance(x,str) and x for x in v): raise ValueError(f"{name} must be a non-empty string list")
    return v


def contract(d):
    cid=d.get("contract_id")
    if not isinstance(cid,str) or not cid: raise ValueError("contract_id required")
    channels=string_list(d.get("accepted_channels"),"accepted_channels")
    tools=d.get("required_tools",[])
    if not isinstance(tools,list) or not all(isinstance(x,str) and x for x in tools): raise ValueError("required_tools must be strings")
    empty=d.get("empty_semantics")
    if empty not in ("forbidden","verified_empty"): raise ValueError("empty_semantics must be forbidden or verified_empty")
    fallback=d.get("fallback_channel")
    if fallback is not None and (not isinstance(fallback,str) or fallback not in channels): raise ValueError("fallback_channel must be accepted or null")
    return cid,channels,tools,empty,fallback


def is_empty(payload):
    return payload in (None,"",[],{})


def main():
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest="mode",required=True)
    for mode in ("preflight","verify"):
        p=sub.add_parser(mode); p.add_argument("contract",type=Path); p.add_argument("--policy",type=Path,required=True)
        if mode=="preflight": p.add_argument("--tools",type=Path,required=True)
        else: p.add_argument("--result",type=Path,required=True)
    a=ap.parse_args()
    try:
        c=load(a.contract); policy=load(a.policy); cid,channels,required,empty_semantics,fallback=contract(c)
        allowed=set(policy.get("allowed_channels",["final_text","structured_tool","artifact"]))
        violations=[]
        if any(ch not in allowed for ch in channels): violations.append("contract uses disallowed channel")
        if policy.get("require_fallback_channel",True) and fallback is None and len(channels)>1: violations.append("fallback_channel required")
        if a.mode=="preflight":
            tools_obj=load(a.tools); available=tools_obj.get("tools",[])
            if not isinstance(available,list) or not all(isinstance(x,str) for x in available): raise ValueError("tools.json must contain string list 'tools'")
            missing=sorted(set(required)-set(available))
            if missing: violations.append("missing required tools: "+", ".join(missing))
            status="block" if violations else "allow"
        else:
            r=load(a.result)
            if r.get("contract_id") != cid: violations.append("contract_id mismatch")
            channel=r.get("channel")
            if channel not in channels: violations.append("result channel not accepted")
            status_value=r.get("status")
            if status_value not in ("verified","verified_empty","partial","contract_failure"): violations.append("invalid result status")
            payload=r.get("payload")
            if is_empty(payload):
                if empty_semantics != "verified_empty" or status_value != "verified_empty": violations.append("ambiguous empty result")
                evidence=r.get("evidence")
                if policy.get("require_explicit_empty_status",True) and (not isinstance(evidence,list) or not evidence): violations.append("verified_empty requires evidence")
            elif status_value == "verified_empty": violations.append("verified_empty status conflicts with non-empty payload")
            if status_value in ("partial","contract_failure"): violations.append(f"result status is {status_value}")
            status="rejected" if violations else status_value
        print(json.dumps({"decision":status,"contract_id":cid,"violations":violations},indent=2))
        return 4 if violations else 0
    except (ValueError,TypeError) as e:
        print(json.dumps({"decision":"invalid","error":str(e)}),file=sys.stderr); return 2

if __name__ == "__main__": raise SystemExit(main())

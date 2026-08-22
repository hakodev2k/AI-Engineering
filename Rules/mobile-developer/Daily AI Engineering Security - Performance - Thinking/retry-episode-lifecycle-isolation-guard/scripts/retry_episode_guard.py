#!/usr/bin/env python3
"""Validate retry episode lifecycle.

Event: {failure_class, operation, state_fingerprint, recovered?, strategy}
Ledger: {episodes:[{id,key,attempts,last_strategy,status}]}
Exit 0 retry/new episode, 2 invalid, 3 change strategy, 4 stop.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path


def load(path: Path):
    try: value=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value,dict): raise ValueError(f"{path} must contain an object")
    return value


def episode_key(event, fields):
    vals=[]
    for f in fields:
        v=event.get(f)
        if not isinstance(v,str) or not v: raise ValueError(f"{f} must be non-empty string")
        vals.append(v)
    raw="\x1f".join(vals).encode()
    return hashlib.sha256(raw).hexdigest()[:16]


def main():
    p=argparse.ArgumentParser(); p.add_argument("event",type=Path); p.add_argument("--ledger",type=Path,required=True); p.add_argument("--policy",type=Path,required=True)
    a=p.parse_args()
    try:
        e,l,policy=load(a.event),load(a.ledger),load(a.policy)
        episodes=l.get("episodes",[])
        if not isinstance(episodes,list) or not all(isinstance(x,dict) for x in episodes): raise ValueError("ledger.episodes must be array of objects")
        fc=e.get("failure_class")
        if not isinstance(fc,str) or not fc: raise ValueError("failure_class must be non-empty string")
        if fc in set(policy.get("terminal_failure_classes",[])):
            print(json.dumps({"decision":"stop","reason":"terminal failure class","failure_class":fc},indent=2)); return 4
        if fc not in set(policy.get("retryable_failure_classes",[])):
            print(json.dumps({"decision":"stop","reason":"failure class not retryable","failure_class":fc},indent=2)); return 4
        fields=policy.get("episode_key_fields",[])
        if not isinstance(fields,list) or not fields: raise ValueError("episode_key_fields required")
        key=episode_key(e,fields)
        active=None
        for ep in reversed(episodes):
            if ep.get("key")==key and ep.get("status","active")=="active": active=ep; break
        recovered=e.get("recovered",False)
        if not isinstance(recovered,bool): raise ValueError("recovered must be boolean")
        if recovered:
            print(json.dumps({"decision":"close_episode","episode_key":key,"reset":True},indent=2)); return 0
        attempts=int(active.get("attempts",0)) if active else 0
        if attempts >= int(policy.get("max_attempts_per_episode",3)):
            print(json.dumps({"decision":"stop","episode_key":key,"attempts":attempts,"reason":"episode budget exhausted"},indent=2)); return 4
        strategy=e.get("strategy","")
        if not isinstance(strategy,str): raise ValueError("strategy must be string")
        threshold=int(policy.get("require_strategy_change_after_identical_failures",2))
        if active and attempts >= threshold and strategy and strategy==active.get("last_strategy"):
            print(json.dumps({"decision":"change_strategy","episode_key":key,"attempts":attempts,"reason":"identical recovery strategy repeated"},indent=2)); return 3
        total_active=sum(1 for x in episodes if x.get("status","active")=="active")
        if not active and total_active >= int(policy.get("max_episodes_per_turn",6)):
            print(json.dumps({"decision":"stop","reason":"turn episode budget exhausted"},indent=2)); return 4
        print(json.dumps({"decision":"retry","episode_key":key,"attempt":attempts+1,"new_episode":active is None},indent=2)); return 0
    except (ValueError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())

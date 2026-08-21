#!/usr/bin/env python3
import argparse, hashlib, json, sys
from datetime import datetime, timezone
from pathlib import Path

REQUIRED = ["session_id","turn_id","request_id","tool_call_id","action_digest","policy_digest","created_at","expires_at","nonce"]
TERMINAL_BAD = {"cancelled","revoked","expired","completed"}

def load(path):
    try:
        data=json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read JSON {path}: {e}")
    if not isinstance(data, dict): raise ValueError("envelope must be an object")
    return data

def parse_ts(value):
    if not isinstance(value,str): raise ValueError("timestamp must be string")
    return datetime.fromisoformat(value.replace("Z","+00:00")).astimezone(timezone.utc)

def decision(code, reason, **extra):
    out={"decision":code,"reason":reason,**extra}
    print(json.dumps(out, sort_keys=True))

def main():
    p=argparse.ArgumentParser(description="Fail-closed approval envelope correlation verifier")
    p.add_argument("--request", required=True)
    p.add_argument("--response", required=True)
    args=p.parse_args()
    try:
        req, resp = load(args.request), load(args.response)
        missing=[k for k in REQUIRED if k not in req or k not in resp]
        if missing:
            decision("reject-mismatch","missing-required-fields",missing=sorted(set(missing))); return 2
        for k in REQUIRED:
            if req[k] != resp[k]:
                decision("reject-mismatch",f"field-mismatch:{k}"); return 3
        state=str(req.get("state","pending")).lower()
        if state in TERMINAL_BAD:
            decision("reject-revoked",f"request-state:{state}"); return 4
        if bool(req.get("consumed",False)):
            decision("reject-duplicate","request-already-consumed"); return 5
        now=datetime.now(timezone.utc)
        if parse_ts(req["expires_at"]) <= now:
            decision("reject-stale","request-expired"); return 6
        if parse_ts(req["created_at"]) > now:
            decision("reject-mismatch","created-at-in-future"); return 7
        decision("accept","exact-live-match",request_id=req["request_id"]); return 0
    except ValueError as e:
        decision("review","invalid-input",error=str(e)); return 8
    except Exception as e:
        decision("review","unexpected-error",error=str(e)); return 9

if __name__ == "__main__": sys.exit(main())

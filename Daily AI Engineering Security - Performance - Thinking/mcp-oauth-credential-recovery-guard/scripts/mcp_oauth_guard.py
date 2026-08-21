#!/usr/bin/env python3
import argparse, json, sys, time
from pathlib import Path

SECRET_KEYS = {"access_token", "refresh_token", "client_secret", "authorization_code"}

def load_json(path):
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        print(json.dumps({"status":"error","reason":str(e)}))
        sys.exit(1)
    if not isinstance(data, dict):
        print(json.dumps({"status":"error","reason":"credential must be an object"}))
        sys.exit(1)
    return data

def merge_tokens(current, refreshed):
    out = dict(current)
    for k, v in refreshed.items():
        if v is not None:
            out[k] = v
    # OAuth refresh responses may legally omit a new refresh token.
    if "refresh_token" not in refreshed and "refresh_token" in current:
        out["refresh_token"] = current["refresh_token"]
    if "scope" not in refreshed and "scope" in current:
        out["scope"] = current["scope"]
    out["version"] = int(current.get("version", 0)) + 1
    return out

def safe_summary(data):
    return {k:("<redacted>" if k in SECRET_KEYS and v is not None else v) for k,v in data.items()}

def check_state(cred, session_version, safety_window):
    version = int(cred.get("version", 0))
    if session_version < version:
        return 2, {"status":"rehydrate_required","credential_version":version}
    expires_at = cred.get("expires_at")
    if expires_at is not None:
        try:
            remaining = float(expires_at) - time.time()
        except (TypeError, ValueError):
            return 1, {"status":"error","reason":"invalid expires_at"}
        if remaining <= safety_window:
            if cred.get("refresh_token"):
                return 2, {"status":"refresh_required","expires_in_seconds":round(remaining,3)}
            return 3, {"status":"reauthorization_required","reason":"no_refresh_token"}
    return 0, {"status":"ready","credential_version":version}

def main():
    p = argparse.ArgumentParser(description="Deterministic MCP OAuth credential-state guard")
    sub = p.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("check-state")
    c.add_argument("--credential", required=True)
    c.add_argument("--session-version", required=True, type=int)
    c.add_argument("--safety-window", type=int, default=60)
    m = sub.add_parser("merge-refresh")
    m.add_argument("--credential", required=True)
    m.add_argument("--refresh-response", required=True)
    args = p.parse_args()

    if args.cmd == "check-state":
        cred = load_json(args.credential)
        code, result = check_state(cred, args.session_version, args.safety_window)
        print(json.dumps(result, sort_keys=True))
        return code

    current = load_json(args.credential)
    refreshed = load_json(args.refresh_response)
    merged = merge_tokens(current, refreshed)
    print(json.dumps(safe_summary(merged), sort_keys=True))
    return 0

if __name__ == "__main__":
    sys.exit(main())

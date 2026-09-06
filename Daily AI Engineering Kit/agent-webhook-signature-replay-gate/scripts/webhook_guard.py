#!/usr/bin/env python3
import argparse, hashlib, hmac, json, sys
from pathlib import Path


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def signed_payload(fmt, timestamp, raw_body):
    if fmt != "{timestamp}.{raw_body}":
        raise ValueError("unsupported signed_payload_format")
    return f"{timestamp}.{raw_body}".encode("utf-8")


def compute_signature(secret, timestamp, raw_body, policy):
    if policy.get("algorithm") != "hmac-sha256":
        raise ValueError("only hmac-sha256 is supported")
    digest = hmac.new(secret.encode("utf-8"), signed_payload(policy["signed_payload_format"], timestamp, raw_body), hashlib.sha256).digest()
    enc = policy.get("signature_encoding", "hex")
    if enc == "hex":
        return digest.hex()
    raise ValueError("unsupported signature_encoding")


def verify(secret, timestamp, now, raw_body, supplied, policy):
    tol = int(policy["timestamp_tolerance_seconds"])
    try:
        ts = int(timestamp); current = int(now)
    except (TypeError, ValueError):
        return False, "invalid-timestamp"
    if abs(current - ts) > tol:
        return False, "stale-timestamp"
    try:
        expected = compute_signature(secret, ts, raw_body, policy)
    except ValueError as e:
        return False, str(e)
    if not isinstance(supplied, str) or not hmac.compare_digest(expected, supplied.lower()):
        return False, "invalid-signature"
    return True, "verified"


def cmd_fixture(args):
    policy = load_json(args.policy); fixture = load_json(args.fixture)
    required = ["secret", "timestamp", "now", "webhook_id", "raw_body", "signature"]
    missing = [k for k in required if k not in fixture]
    if missing:
        print(json.dumps({"status":"failed","error":"missing fixture fields","fields":missing})); return 2
    if policy.get("require_replay_id", True) and not fixture.get("webhook_id"):
        print(json.dumps({"status":"failed","error":"missing replay id"})); return 2
    ok, reason = verify(fixture["secret"], fixture["timestamp"], fixture["now"], fixture["raw_body"], fixture["signature"], policy)
    print(json.dumps({"status":"verified" if ok else "failed","reason":reason}, sort_keys=True))
    return 0 if ok else 2


def main():
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest="cmd",required=True)
    p=sub.add_parser("verify-fixture"); p.add_argument("--policy",required=True); p.add_argument("--fixture",required=True); p.set_defaults(fn=cmd_fixture)
    a=ap.parse_args()
    try: return a.fn(a)
    except (OSError, json.JSONDecodeError, KeyError, ValueError) as e:
        print(f"webhook_guard: {e}", file=sys.stderr); return 3

if __name__ == "__main__":
    raise SystemExit(main())

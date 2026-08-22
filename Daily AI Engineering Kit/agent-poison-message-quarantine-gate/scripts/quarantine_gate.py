#!/usr/bin/env python3
import argparse, hashlib, json, sys
from datetime import datetime, timezone
from pathlib import Path

CATEGORIES={"timeout","rate-limit","temporary-unavailable","validation","deserialization","business-rule","unknown-contract"}

def load(p):
    with open(p,encoding="utf-8") as f:return json.load(f)
def canonical(o): return json.dumps(o,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
def digest(v): return hashlib.sha256(v if isinstance(v,bytes) else v.encode()).hexdigest()
def validate_policy(p):
    errors=[]
    if p.get("version")!=1: errors.append("version must be 1")
    n=p.get("max_transient_retries");
    if not isinstance(n,int) or n<0 or n>10: errors.append("max_transient_retries must be 0..10")
    for k in ("retryable_categories","immediate_quarantine_categories"):
        vals=p.get(k)
        if not isinstance(vals,list) or any(v not in CATEGORIES for v in vals): errors.append(f"invalid {k}")
    if set(p.get("retryable_categories",[])) & set(p.get("immediate_quarantine_categories",[])): errors.append("category sets overlap")
    if not isinstance(p.get("max_body_bytes"),int) or p.get("max_body_bytes",0)<=0: errors.append("max_body_bytes must be positive")
    return errors
def validate_failure(f):
    req=("message_id","source","failure_category","attempt","payload","error_type","error_message")
    e=[f"missing {k}" for k in req if k not in f]
    if f.get("failure_category") not in CATEGORIES:e.append("unsupported failure_category")
    if not isinstance(f.get("attempt"),int) or f.get("attempt",0)<1:e.append("attempt must be >=1")
    return e
def make_envelope(policy,f):
    raw=f["payload"].encode()
    if len(raw)>policy["max_body_bytes"]: raise ValueError("payload exceeds max_body_bytes")
    category=f["failure_category"]
    if category in policy["retryable_categories"] and f["attempt"]<=policy["max_transient_retries"]: raise ValueError("failure is still retryable; quarantine not yet allowed")
    env={"schema_version":1,"message_id":f["message_id"],"source":f["source"],"failure_category":category,"attempt":f["attempt"],"payload_sha256":digest(raw),"quarantined_at":datetime.now(timezone.utc).isoformat(),"evidence":{"error_type":f["error_type"],"error_message":f["error_message"]},"replay":{"approved":False,"outcome":"not-attempted"}}
    if policy.get("store_raw_body"): env["payload"]=f["payload"]
    env["integrity_sha256"]=digest(canonical(env))
    return env
def verify(policy,e):
    errors=[]
    required=("schema_version","message_id","source","failure_category","attempt","payload_sha256","quarantined_at","evidence","integrity_sha256")
    errors += [f"missing {k}" for k in required if k not in e]
    if errors:return errors
    expected=e["integrity_sha256"]; copy=dict(e); copy.pop("integrity_sha256",None)
    if digest(canonical(copy))!=expected: errors.append("integrity_sha256 mismatch")
    if "payload" in e and digest(e["payload"])!=e["payload_sha256"]: errors.append("payload_sha256 mismatch")
    r=e.get("replay",{})
    if r.get("approved"):
        if policy.get("require_replay_approval") and not r.get("approved_by"): errors.append("approved replay missing approved_by")
        if policy.get("require_independent_verifier") and (not r.get("verified_by") or r.get("verified_by")==r.get("approved_by")): errors.append("independent verified_by required")
        if r.get("environment") not in policy.get("allowed_replay_environments",[]): errors.append("replay environment not allowed")
    return errors
def main():
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest="cmd",required=True)
    p=sub.add_parser("validate-policy");p.add_argument("policy")
    p=sub.add_parser("quarantine");p.add_argument("--policy",required=True);p.add_argument("--failure",required=True);p.add_argument("--out",required=True)
    p=sub.add_parser("verify-envelope");p.add_argument("--policy",required=True);p.add_argument("envelope")
    a=ap.parse_args()
    try:
        if a.cmd=="validate-policy": errs=validate_policy(load(a.policy))
        elif a.cmd=="quarantine":
            pol=load(a.policy); errs=validate_policy(pol); f=load(a.failure); errs+=validate_failure(f)
            if not errs: Path(a.out).write_text(json.dumps(make_envelope(pol,f),indent=2)+"\n",encoding="utf-8")
        else: pol=load(a.policy); errs=validate_policy(pol); errs+=verify(pol,load(a.envelope))
        if errs:
            for x in errs: print(x,file=sys.stderr)
            return 2
        return 0
    except (OSError,json.JSONDecodeError,ValueError) as ex: print(str(ex),file=sys.stderr);return 3
if __name__=="__main__": raise SystemExit(main())

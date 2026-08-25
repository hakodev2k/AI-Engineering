#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit
REQ=("principal","server_origin","request_id","target_url","nonce","issued_at","expires_at")
def tm(v):
 d=datetime.fromisoformat(v.replace("Z","+00:00"));
 if d.tzinfo is None: raise ValueError("timestamp_timezone_required")
 return d.astimezone(timezone.utc)
def origin(u,local=False):
 p=urlsplit(u); h=(p.hostname or "").lower()
 if p.username or p.password: raise ValueError("userinfo_not_allowed")
 if not h: raise ValueError("missing_host")
 if p.scheme!="https" and not(local and p.scheme=="http" and h in {"localhost","127.0.0.1","::1"}): raise ValueError("https_required")
 port=p.port; default=(p.scheme=="https" and port in (None,443)) or (p.scheme=="http" and port in (None,80))
 return f"{p.scheme}://{h if default else f'{h}:{port}'}"
def payload(r):
 miss=[k for k in REQ if not r.get(k)]
 if miss: raise ValueError("missing_fields:"+",".join(miss))
 local=bool(r.get("allow_localhost_http")); issued=tm(r["issued_at"]); exp=tm(r["expires_at"])
 if exp<=issued: raise ValueError("invalid_expiry")
 return {"principal":str(r["principal"]),"server_origin":origin(r["server_origin"],local),"request_id":str(r["request_id"]),"target_origin":origin(r["target_url"],local),"nonce":str(r["nonce"]),"issued_at":issued.isoformat(),"expires_at":exp.isoformat()}
def dg(p): return hashlib.sha256(json.dumps(p,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def issue(r,now):
 p=payload(r)
 if tm(p["expires_at"])<=now: raise ValueError("binding_expired")
 return {"status":"allow","target_origin":p["target_origin"],"binding_digest":dg(p)}
def complete(r,now):
 p=payload(r)
 if tm(p["expires_at"])<=now: raise ValueError("binding_expired")
 if not r.get("expected_digest") or r["expected_digest"]!=dg(p): raise ValueError("binding_digest_mismatch")
 if str(r.get("completion_principal",""))!=p["principal"]: raise ValueError("principal_mismatch")
 if origin(r.get("completion_target_url",r["target_url"]),bool(r.get("allow_localhost_http")))!=p["target_origin"]: raise ValueError("origin_drift")
 if r.get("nonce_consumed"): raise ValueError("replay_detected")
 return {"status":"allow","binding_digest":r["expected_digest"],"consume_nonce":True}
def main():
 ap=argparse.ArgumentParser(); ap.add_argument("mode",choices=("issue","complete")); ap.add_argument("--record",required=True); ap.add_argument("--now"); a=ap.parse_args()
 try:
  r=json.loads(Path(a.record).read_text()); now=tm(a.now) if a.now else datetime.now(timezone.utc); out=issue(r,now) if a.mode=="issue" else complete(r,now); print(json.dumps(out,sort_keys=True)); return 0
 except (OSError,json.JSONDecodeError,ValueError,TypeError) as e:
  print(json.dumps({"status":"block","reason":str(e)}),file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())

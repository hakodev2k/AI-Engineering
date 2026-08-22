#!/usr/bin/env python3
import argparse, hashlib, json, os, sqlite3, sys
from datetime import datetime, timezone

DB = os.environ.get("IDEMPOTENCY_DB", ".agent/idempotency.sqlite3")
TERMINAL = {"succeeded", "failed_nonretryable"}

def now(): return datetime.now(timezone.utc).isoformat()
def canonical(v): return json.dumps(v, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
def fingerprint(intent):
    material = {"operation": intent["operation"], "target": intent["target"], "arguments": intent["arguments"]}
    return hashlib.sha256(canonical(material).encode()).hexdigest()
def validate(i):
    required = {"idempotency_key","operation","target","arguments","max_retries","requires_approval","reconciliation"}
    missing = required - set(i)
    if missing: raise ValueError("missing fields: " + ", ".join(sorted(missing)))
    if not isinstance(i["arguments"], dict): raise ValueError("arguments must be object")
    if not isinstance(i["max_retries"], int) or not 0 <= i["max_retries"] <= 2: raise ValueError("max_retries must be 0..2")
    if not isinstance(i["requires_approval"], bool): raise ValueError("requires_approval must be boolean")
    if not str(i["idempotency_key"]).strip(): raise ValueError("empty idempotency_key")
    text = canonical(i).lower()
    for marker in ["password\":", "token\":", "secret\":", "private_key\":", "connection_string\":"]:
        if marker in text: raise ValueError("intent appears to contain a secret field; use a secret reference")

def connect():
    parent = os.path.dirname(DB)
    if parent: os.makedirs(parent, exist_ok=True)
    c = sqlite3.connect(DB, timeout=10, isolation_level=None)
    c.execute("PRAGMA journal_mode=WAL")
    c.execute("""CREATE TABLE IF NOT EXISTS intents(
      key TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, status TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0, max_retries INTEGER NOT NULL,
      result_ref TEXT, last_error TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)""")
    return c

def out(**kw): print(json.dumps(kw, sort_keys=True))
def claim(path):
    i=json.load(open(path, encoding="utf-8")); validate(i); fp=fingerprint(i); c=connect(); key=i["idempotency_key"]
    c.execute("BEGIN IMMEDIATE")
    r=c.execute("SELECT fingerprint,status,attempts,max_retries,result_ref FROM intents WHERE key=?",(key,)).fetchone()
    if not r:
        c.execute("INSERT INTO intents VALUES(?,?,?,?,?,?,?,?,?)",(key,fp,"in_progress",1,i["max_retries"],None,None,now(),now())); c.commit(); out(status="claimed",key=key,fingerprint=fp,attempt=1); return 0
    oldfp,status,attempts,maxr,result=r
    if oldfp != fp: c.rollback(); out(status="fingerprint_conflict",key=key); return 3
    if status == "succeeded": c.rollback(); out(status="already_succeeded",key=key,result_ref=result); return 0
    if status in ("in_progress","ambiguous"): c.rollback(); out(status=status,key=key); return 4
    if status == "failed_nonretryable": c.rollback(); out(status=status,key=key); return 5
    if status != "failed_retryable": c.rollback(); out(status="invalid_state",key=key); return 6
    if attempts >= 1 + maxr: c.rollback(); out(status="retry_exhausted",key=key,attempts=attempts); return 7
    attempts += 1; c.execute("UPDATE intents SET status='in_progress',attempts=?,last_error=NULL,updated_at=? WHERE key=?",(attempts,now(),key)); c.commit(); out(status="claimed",key=key,fingerprint=fp,attempt=attempts); return 0

def transition(key,status,result=None,error=None):
    c=connect(); c.execute("BEGIN IMMEDIATE"); r=c.execute("SELECT status FROM intents WHERE key=?",(key,)).fetchone()
    if not r: c.rollback(); out(status="missing",key=key); return 2
    if r[0] != "in_progress": c.rollback(); out(status="invalid_transition",key=key,current=r[0]); return 3
    c.execute("UPDATE intents SET status=?,result_ref=?,last_error=?,updated_at=? WHERE key=?",(status,result,error,now(),key)); c.commit(); out(status=status,key=key,result_ref=result); return 0

def status(key):
    c=connect(); r=c.execute("SELECT key,fingerprint,status,attempts,max_retries,result_ref,last_error,created_at,updated_at FROM intents WHERE key=?",(key,)).fetchone()
    if not r: out(status="missing",key=key); return 2
    out(**dict(zip(["key","fingerprint","status","attempts","max_retries","result_ref","last_error","created_at","updated_at"],r))); return 0

def main():
    p=argparse.ArgumentParser(); s=p.add_subparsers(dest="cmd",required=True)
    q=s.add_parser("claim"); q.add_argument("--intent",required=True)
    for name in ["complete","fail","ambiguous","status"]:
        q=s.add_parser(name); q.add_argument("--key",required=True)
        if name=="complete": q.add_argument("--result-ref",required=True)
        if name in ("fail","ambiguous"): q.add_argument("--error",required=True)
        if name=="fail": q.add_argument("--retryable",action="store_true")
    a=p.parse_args()
    try:
        if a.cmd=="claim": return claim(a.intent)
        if a.cmd=="complete": return transition(a.key,"succeeded",result=a.result_ref)
        if a.cmd=="fail": return transition(a.key,"failed_retryable" if a.retryable else "failed_nonretryable",error=a.error)
        if a.cmd=="ambiguous": return transition(a.key,"ambiguous",error=a.error)
        return status(a.key)
    except (OSError,ValueError,json.JSONDecodeError,sqlite3.Error) as e:
        out(status="error",error=str(e)); return 10
if __name__=="__main__": sys.exit(main())

#!/usr/bin/env python3
import argparse, hashlib, json, sqlite3, sys, time
from pathlib import Path

def read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc

def stable_key(operation, require_explicit=True):
    required=("namespace","operation","idempotency_key")
    missing=[k for k in required if not operation.get(k)]
    if missing and require_explicit:
        raise ValueError("missing stable identity fields: "+",".join(missing))
    payload={k:operation.get(k) for k in ("namespace","operation","idempotency_key","target")}
    canonical=json.dumps(payload,sort_keys=True,separators=(",",":"),ensure_ascii=False)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

def connect(path):
    db=sqlite3.connect(path, timeout=10, isolation_level=None)
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("CREATE TABLE IF NOT EXISTS claims (key TEXT PRIMARY KEY, namespace TEXT NOT NULL, operation TEXT NOT NULL, idem TEXT NOT NULL, status TEXT NOT NULL, attempts INTEGER NOT NULL, claimed_at REAL NOT NULL, updated_at REAL NOT NULL, result TEXT)")
    return db

def claim(db, operation, policy, now=None):
    now=time.time() if now is None else now
    key=stable_key(operation, policy.get("require_explicit_idempotency_key",True))
    max_attempts=int(policy.get("max_attempts",3)); stale=float(policy.get("stale_claim_seconds",900))
    db.execute("BEGIN IMMEDIATE")
    try:
        row=db.execute("SELECT status,attempts,claimed_at,result FROM claims WHERE key=?",(key,)).fetchone()
        if row is None:
            db.execute("INSERT INTO claims VALUES (?,?,?,?,?,?,?,?,?)",(key,operation["namespace"],operation["operation"],operation["idempotency_key"],"in_progress",1,now,now,None))
            db.execute("COMMIT")
            return {"ok":True,"decision":"execute","key":key,"attempt":1}
        status,attempts,claimed_at,result=row
        if status=="completed":
            db.execute("COMMIT")
            return {"ok":True,"decision":"reuse","key":key,"attempt":attempts,"result":json.loads(result) if result else None}
        age=now-claimed_at
        if status=="in_progress" and age < stale:
            db.execute("COMMIT")
            return {"ok":False,"decision":"wait","key":key,"attempt":attempts,"age_seconds":round(age,3)}
        if attempts >= max_attempts:
            db.execute("COMMIT")
            return {"ok":False,"decision":"blocked","key":key,"attempt":attempts,"reason":"max_attempts_exhausted"}
        if status=="in_progress" and not policy.get("allow_stale_reclaim",False):
            db.execute("COMMIT")
            return {"ok":False,"decision":"blocked","key":key,"attempt":attempts,"reason":"stale_claim_requires_review"}
        attempts+=1
        db.execute("UPDATE claims SET status='in_progress', attempts=?, claimed_at=?, updated_at=? WHERE key=?",(attempts,now,now,key))
        db.execute("COMMIT")
        return {"ok":True,"decision":"execute","key":key,"attempt":attempts}
    except Exception:
        db.execute("ROLLBACK"); raise

def complete(db, operation, result, policy, now=None):
    now=time.time() if now is None else now
    key=stable_key(operation, policy.get("require_explicit_idempotency_key",True))
    encoded=json.dumps(result,sort_keys=True,separators=(",",":"),ensure_ascii=False)
    if len(encoded.encode("utf-8")) > int(policy.get("store_result_inline_max_bytes",16384)):
        raise ValueError("result exceeds inline storage limit; store a reference instead")
    db.execute("BEGIN IMMEDIATE")
    try:
        row=db.execute("SELECT status FROM claims WHERE key=?",(key,)).fetchone()
        if row is None:
            raise ValueError("cannot complete unclaimed operation")
        if row[0]=="completed":
            existing=db.execute("SELECT result FROM claims WHERE key=?",(key,)).fetchone()[0]
            db.execute("COMMIT")
            return {"ok":True,"decision":"reuse","key":key,"result":json.loads(existing) if existing else None}
        db.execute("UPDATE claims SET status='completed', updated_at=?, result=? WHERE key=?",(now,encoded,key))
        db.execute("COMMIT")
        return {"ok":True,"decision":"completed","key":key,"result":result}
    except Exception:
        db.execute("ROLLBACK"); raise

def status(db, operation, policy):
    key=stable_key(operation, policy.get("require_explicit_idempotency_key",True))
    row=db.execute("SELECT status,attempts,claimed_at,updated_at,result FROM claims WHERE key=?",(key,)).fetchone()
    if row is None: return {"ok":True,"decision":"absent","key":key}
    return {"ok":True,"decision":row[0],"key":key,"attempt":row[1],"claimed_at":row[2],"updated_at":row[3],"result":json.loads(row[4]) if row[4] else None}

def main():
    ap=argparse.ArgumentParser(description="Durable idempotency claim envelope")
    ap.add_argument("--db",required=True); ap.add_argument("--policy",default="config/policy.json")
    sub=ap.add_subparsers(dest="cmd",required=True)
    for name in ("claim","status"):
        p=sub.add_parser(name); p.add_argument("--operation",required=True)
    p=sub.add_parser("complete"); p.add_argument("--operation",required=True); p.add_argument("--result",required=True)
    args=ap.parse_args()
    try:
        Path(args.db).parent.mkdir(parents=True,exist_ok=True)
        policy=read_json(args.policy); operation=read_json(args.operation); db=connect(args.db)
        if args.cmd=="claim": out=claim(db,operation,policy)
        elif args.cmd=="complete": out=complete(db,operation,read_json(args.result),policy)
        else: out=status(db,operation,policy)
        print(json.dumps(out,indent=2,sort_keys=True)); return 0 if out.get("ok") else 3
    except Exception as exc:
        print(json.dumps({"ok":False,"error":str(exc)}),file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())

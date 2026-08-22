#!/usr/bin/env python3
import argparse, hashlib, json, os, sqlite3, sys, time

def digest(data: bytes) -> str: return hashlib.sha256(data).hexdigest()
def main():
    p=argparse.ArgumentParser(description='Atomic webhook replay/idempotency gate')
    p.add_argument('--db', default='.ai-webhook-gate.sqlite3')
    p.add_argument('--key', required=True)
    p.add_argument('--payload', required=True, help='Payload file; use - for stdin')
    p.add_argument('--retention', type=int, default=86400)
    p.add_argument('--processing-ttl', type=int, default=300)
    p.add_argument('--complete', action='store_true', help='Mark an already claimed key complete')
    a=p.parse_args()
    if not a.key.strip() or len(a.key)>200 or a.retention<1 or a.processing_ttl<1: return 2
    raw=sys.stdin.buffer.read() if a.payload=='-' else open(a.payload,'rb').read()
    h=digest(raw); now=int(time.time())
    con=sqlite3.connect(a.db, timeout=10, isolation_level=None)
    con.execute('PRAGMA journal_mode=WAL')
    con.execute('CREATE TABLE IF NOT EXISTS webhook_claims (k TEXT PRIMARY KEY, hash TEXT NOT NULL, state TEXT NOT NULL, created INTEGER NOT NULL, updated INTEGER NOT NULL)')
    con.execute('DELETE FROM webhook_claims WHERE updated < ?', (now-a.retention,))
    con.execute('BEGIN IMMEDIATE')
    row=con.execute('SELECT hash,state,updated FROM webhook_claims WHERE k=?',(a.key,)).fetchone()
    if a.complete:
        if not row or row[0]!=h: con.rollback(); print(json.dumps({'status':'rejected','key':a.key,'payload_hash':h,'evidence':['missing-or-mismatched-claim'],'verification':'failed'})); return 4
        con.execute("UPDATE webhook_claims SET state='complete',updated=? WHERE k=?",(now,a.key)); con.commit(); print(json.dumps({'status':'accepted','key':a.key,'payload_hash':h,'evidence':['claim-marked-complete'],'verification':'passed'})); return 0
    if row:
        if row[0]!=h: con.rollback(); print(json.dumps({'status':'rejected','key':a.key,'payload_hash':h,'evidence':['idempotency-key-payload-mismatch'],'verification':'failed'})); return 4
        if row[1]=='complete' or now-row[2] < a.processing_ttl: con.rollback(); print(json.dumps({'status':'duplicate','key':a.key,'payload_hash':h,'evidence':['existing-claim:'+row[1]],'verification':'passed'})); return 3
        con.execute("UPDATE webhook_claims SET state='processing',updated=? WHERE k=?",(now,a.key)); con.commit(); print(json.dumps({'status':'accepted','key':a.key,'payload_hash':h,'evidence':['stale-processing-claim-recovered'],'verification':'passed'})); return 0
    con.execute("INSERT INTO webhook_claims VALUES (?,?,'processing',?,?)",(a.key,h,now,now)); con.commit(); print(json.dumps({'status':'accepted','key':a.key,'payload_hash':h,'evidence':['atomic-claim-created'],'verification':'passed'})); return 0
if __name__=='__main__': sys.exit(main())

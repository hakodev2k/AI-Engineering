#!/usr/bin/env python3
import os, sqlite3, sys
DB=os.environ.get("IDEMPOTENCY_DB", ".agent/idempotency.sqlite3")
allowed={"in_progress","succeeded","failed_retryable","failed_nonretryable","ambiguous"}
if not os.path.exists(DB):
    print(f"ledger not found: {DB}", file=sys.stderr); sys.exit(2)
try:
    c=sqlite3.connect(DB)
    rows=c.execute("SELECT key,fingerprint,status,attempts,max_retries,result_ref FROM intents").fetchall()
    errors=[]
    for key,fp,status,attempts,maxr,result in rows:
        if status not in allowed: errors.append(f"{key}: invalid status {status}")
        if len(fp)!=64: errors.append(f"{key}: invalid fingerprint")
        if attempts < 1 or attempts > 1+maxr: errors.append(f"{key}: invalid attempts {attempts}/{maxr}")
        if status=="succeeded" and not result: errors.append(f"{key}: success missing result_ref")
    if errors:
        print("\n".join(errors), file=sys.stderr); sys.exit(1)
    print(f"ledger verified: {len(rows)} record(s)"); sys.exit(0)
except sqlite3.Error as e:
    print(f"ledger error: {e}", file=sys.stderr); sys.exit(3)

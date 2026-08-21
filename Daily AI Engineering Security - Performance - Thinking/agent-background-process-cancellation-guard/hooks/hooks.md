# Hooks

## Pre-launch registration
**Trigger:** before any background process/subagent command is spawned.  
**Action:** allocate task ID + nonce; prepare durable registry record; require a supported isolation adapter.  
**Command/script:** `python scripts/process_guard.py register --task-id <id> --parent-id <parent> --pid <pid> --start <start-id> --pgid <pgid> --nonce <nonce>` after spawn identity is known; host integration should make registration and launch failure-safe.  
**Expected result:** inspectable ownership record.  
**Failure behavior:** do not allow untracked background mode; fall back to foreground or fail explicitly.

## Heartbeat
**Trigger:** every configured heartbeat interval while task is authorized.  
**Action:** refresh lease only when identity still matches.  
**Command/script:** `python scripts/process_guard.py heartbeat --task-id <id>`  
**Expected result:** fresh lease and audit event.  
**Failure behavior:** mark health degraded; reaper will reconcile after lease expiry.

## Pre-cancel
**Trigger:** user stop, parent stop, timeout, shutdown.  
**Action:** set state to cancelling and inspect owned process identity.  
**Command/script:** `python scripts/process_guard.py inspect --task-id <id>`  
**Expected result:** identity-confirmed target set or an ambiguity error.  
**Failure behavior:** no destructive signal on ambiguity.

## Cancel enforcement
**Trigger:** successful pre-cancel identity check.  
**Action:** perform bounded cancellation via runtime/OS adapter; script supplies authoritative owned target data.  
**Expected result:** zero live owned descendants within policy deadline.  
**Failure behavior:** mark orphaned/needs-human; force escalation only if policy explicitly enables it.

## Pre-completion barrier
**Trigger:** immediately before final success/completion signal.  
**Action:** verify all required owned processes are terminal/gone.  
**Command/script:** `python scripts/process_guard.py gate --task-id <id>`  
**Expected result:** exit 0.  
**Failure behavior:** block completion and enter reconciliation.

## Shutdown hook
**Trigger:** graceful runtime shutdown.  
**Action:** reconcile all records owned by the runtime instance, request cancellation, then verify; do not rely on this hook as the sole safety mechanism.  
**Failure behavior:** independent stale-lease reaper remains responsible after crash.

## Reaper hook
**Trigger:** host supervisor scan.  
**Action:** `python scripts/process_guard.py stale` and reconcile expired records.  
**Expected result:** each stale record classified with current identity evidence.  
**Failure behavior:** ambiguous identity becomes report-only/needs-human.

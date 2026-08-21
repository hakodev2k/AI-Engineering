# Lease Lifecycle Hooks

## Pre-task ownership hook
**Trigger:** before first protected mutation.  
**Action:** inspect store, canonicalize resource scope, acquire lease.  
**Command:** `python scripts/lease_store.py acquire --store <store.json> --resource <key> --owner <id> --scope-json <scope.json> --lease-seconds 120`  
**Expected:** active lease with unique ID and fencing token.  
**Failure:** active owner exists → block.  
**Blocking:** yes.

## Pre-mutation fencing hook
**Trigger:** immediately before every protected write.  
**Action:** run `python scripts/evaluate-mutation-gate.py --store <store.json> --intent <intent.json> --policy config/lease-policy.json`.  
**Expected:** `verified`.  
**Failure:** any mismatch/expiry → stop write.  
**Blocking:** yes.

## Heartbeat hook
**Trigger:** before configured heartbeat interval expires while work remains.  
**Action:** renew using exact owner/lease/token.  
**Failure:** retry transient store failure once; on second failure stop mutations.  
**Blocking:** yes for further mutations.

## Recovery hook
**Trigger:** task resumes without proven current ownership or observes stale lease.  
**Action:** run takeover evaluator and required independent review/approval; acquire a new lease rather than reviving old lease.  
**Blocking:** yes.

## Post-task release hook
**Trigger:** protected work and task-specific verification finish.  
**Action:** release exact lease.  
**Failure:** preserve evidence; do not claim clean release until store confirms it.  
**Blocking:** yes for ownership-complete status.

## Final validation hook
**Trigger:** before declaring workflow verified.  
**Action:** `python scripts/validate-lease-state.py --store <store.json>` plus task-specific verification.  
**Expected:** validator passes and no current ownership contradiction exists.

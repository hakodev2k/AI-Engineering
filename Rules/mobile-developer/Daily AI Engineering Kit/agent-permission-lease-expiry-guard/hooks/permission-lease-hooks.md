# Permission Lease Hooks

## Pre-privileged-call
**Trigger:** immediately before an elevated tool/API call.  
**Action:** `python scripts/evaluate-permission-gate.py --lease <lease.json> --action <action.json>`  
**Expected:** decision `allow`, exit 0.  
**Failure:** block call. Never widen scope automatically.  
**Blocking:** yes.

## Post-privileged-call
**Trigger:** after the capability was exercised.  
**Action:** `python scripts/consume-permission-lease.py --lease <lease.json>` and record operation verification evidence.  
**Expected:** use count increments exactly once.  
**Failure:** block further privileged calls until reconciled.  
**Blocking:** yes.

## Operation-close
**Trigger:** completion, cancellation, expiry, or incident.  
**Action:** revoke/expire lease; collect authoritative revocation evidence.  
**Expected:** lease non-active.  
**Failure:** bounded lookup/revoke retry <=2, then escalation.  
**Blocking:** yes for high-risk completion.

## Final-verification
**Trigger:** before reporting verified success.  
**Action:** `python scripts/evaluate-final-gate.py --lease <lease.json> --action <action.json> [--review <review.json>] [--revocation-evidence <revocation.json>]`  
**Expected:** `verified`.  
**Blocking:** yes.

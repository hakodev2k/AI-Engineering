# Approval Context Hooks

## Pre-approval capture
**Trigger:** before asking a human to approve an approval-required action.  
**Preconditions:** final plan/resources/commands/permissions/environment are known.  
**Action:** build context JSON and run `python3 scripts/fingerprint-context.py context.json --output context-fingerprint.json`.  
**Expected:** deterministic SHA-256 context fingerprint.  
**Failure:** block approval request until missing/ambiguous fields are resolved.  
**Blocking:** yes.

## Post-edit invalidation
**Trigger:** any code/config/plan/resource/command/permission/environment change after approval.  
**Action:** reconstruct current context; mark prior approval unusable until drift evaluation proves the exact fingerprint remains unchanged.  
**Failure:** never assume non-materiality from prose alone.  
**Blocking:** yes for approval-required actions.

## Pre-side-effect drift check
**Trigger:** immediately before executing the approved side effect.  
**Command:** `python3 scripts/evaluate-context-drift.py approved-context.json current-context.json --output drift.json`  
**Expected:** exit `0`, status `unchanged`.  
**Failure:** exit `3` drifted or `2` invalid; preserve drift evidence and stop.  
**Blocking:** yes.

## Pre-high-risk independent review
**Trigger:** high/critical action after unchanged drift result.  
**Action:** independent verifier recomputes fingerprint and emits review bound to it.  
**Expected:** reviewer differs from executor and status is `approved`.  
**Failure:** block and preserve findings.  
**Blocking:** yes.

## Final approval gate
**Trigger:** last step before effectful execution.  
**Command:** `python3 scripts/evaluate-final-gate.py current-context.json approval.json --review review.json` for high/critical; omit review only where policy does not require it.  
**Expected:** exit `0`, status `verified`.  
**Failure:** exit `3` blocked or `2` invalid; do not execute.  
**Blocking:** yes.

## Post-execution receipt
**Trigger:** after an attempted side effect.  
**Action:** store actual tool/API result separately from gate evidence. If outcome is ambiguous, reconcile before retry.  
**Blocking:** blocks claims of successful execution when outcome is unknown.

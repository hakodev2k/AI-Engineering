# Lifecycle Hooks

## Pre-task validation
**Trigger:** investigation starts.  
**Preconditions:** message ID and environment are known.  
**Action:** confirm repository is readable, production connections are read-only, and no replay command is queued.  
**Expected result:** safe investigation context.  
**Failure:** block execution; permission/environment failures are not bypassed.  
**Blocking:** yes.

## Post-evidence verification
**Trigger:** investigator produces evidence JSON.  
**Preconditions:** three evidence classes are claimed.  
**Action:** run `python scripts/verify_outbox.py <evidence.json>`.  
**Expected result:** exit code 0.  
**Failure:** preserve artifact and hand to Verification Agent as failed/inconclusive.  
**Blocking:** yes.

## Pre-recovery approval
**Trigger:** proposed action includes production replay, delete, schema/config change, or permission elevation.  
**Action:** stop and request explicit human approval containing message ID, action, duplicate risk, ordering risk, and rollback/containment plan.  
**Failure:** no approval means no action.  
**Blocking:** yes.

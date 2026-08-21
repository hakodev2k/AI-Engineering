# Lifecycle Hooks

## Pre-task validation
**Trigger:** before investigation or edit.  
**Preconditions:** repository root is available.  
**Action:** read `config/lock-policy.yaml`; confirm lock key/resource scope and required test environment are identifiable.  
**Expected result:** context is sufficient and no production mutation is needed.  
**Failure behavior:** block with `blocked-context`.  
**Blocking:** yes.

## Post-edit verification
**Trigger:** after any lock implementation edit.  
**Preconditions:** dependencies and local/test Redis are available when integration tests require them.  
**Action:** run formatter/build/project tests, then targeted contention/expiry/owner-mismatch tests.  
**Expected result:** all checks exit zero.  
**Failure behavior:** preserve output; allow one evidence-based correction cycle only.  
**Blocking:** yes.

## Final package verification
**Trigger:** before declaring the kit verified.  
**Action:** run `python scripts/verify_package.py .` from this package directory.  
**Expected result:** `package verification passed`.  
**Failure behavior:** fix missing/broken references before completion.  
**Blocking:** yes.

## Production approval hook
**Trigger:** proposal includes force unlock, lock scope change, disabling fencing, or lease above 120 seconds.  
**Action:** stop and record explicit human approval.  
**Failure behavior:** no action is performed.  
**Blocking:** yes.

# Lifecycle Hooks

## Pre-task validation
**Trigger:** before investigation or verification.  
**Preconditions:** repository context and write evidence are available.  
**Action:** confirm correlation ID, entity ID, read URL, expected value, and non-destructive read access.  
**Command:** validate the request JSON by running `python scripts/consistency_gate.py --request <request.json>` only after the endpoint is approved for read-only use.  
**Expected result:** inputs are complete and the verification target is explicit.  
**Failure behavior:** block execution on missing identifiers, malformed input, or write-only endpoints.  
**Blocking:** yes.

## Post-evidence verification
**Trigger:** after a consistency gate run.  
**Preconditions:** `consistency-result.json` exists.  
**Action:** inspect `status`, attempt evidence, versions, and retry count.  
**Expected result:** `verified` only when the expected value and version are observed.  
**Failure behavior:** preserve evidence and return to the single allowed investigation re-entry.  
**Blocking:** yes.

## Final package verification
**Trigger:** before package release or copy into another repository.  
**Command:** `python scripts/verify_package.py`.  
**Expected result:** exit code 0 and `status=verified`.  
**Failure behavior:** block release until missing/banned artifacts are corrected.  
**Blocking:** yes.

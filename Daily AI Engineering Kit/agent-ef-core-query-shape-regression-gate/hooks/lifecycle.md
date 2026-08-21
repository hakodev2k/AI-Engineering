# Lifecycle Hooks

## Pre-change scan
**Trigger:** before editing an EF Core query involved in the task.  
**Action:** run the scanner and preserve the baseline JSON.  
**Expected result:** baseline exists even when findings are present.  
**Failure:** retry once for tool failure; otherwise block performance claims.  
**Blocking:** yes for verified-remediation workflows.

## Post-edit scan
**Trigger:** after each material query-shape edit.  
**Action:** rerun `scripts/scan_ef_queries.py` with the same policy.  
**Expected result:** no new unexplained blocking findings.  
**Failure:** return to investigation; maximum two remediation attempts.  
**Blocking:** yes.

## Build/test hook
**Trigger:** after a candidate remediation.  
**Action:** run repository build and targeted tests for the affected path.  
**Expected result:** build and targeted tests pass.  
**Failure:** preserve output; retry only once for transient environment failures.  
**Blocking:** yes.

## Approval hook
**Trigger:** proposed schema/index change, global query-filter removal, production config change, breaking contract, or unproven tracking change on a write path.  
**Action:** stop and request explicit human approval outside autonomous execution.  
**Blocking:** yes.

## Final verification hook
**Trigger:** before declaring success.  
**Action:** Query Verifier reviews final diff/evidence and `python scripts/verify_package.py` validates kit integrity.  
**Expected result:** `verified` task status and package verification pass.  
**Failure:** report incomplete/inconclusive.  
**Blocking:** yes.

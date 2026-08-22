# Lifecycle Hooks

## Pre-task transaction scan
**Trigger:** before planning a transaction-sensitive change.  
**Preconditions:** repository root is readable and Python 3 is available.  
**Action:** run `python scripts/scan-transaction-risk.py <repo> --json`.  
**Expected result:** scanner output is preserved as investigation evidence.  
**Failure behavior:** a scanner tool error blocks automated progression; retry once, then mark `blocked`. Heuristic findings themselves do not block until reviewed.  
**Blocking:** tool failure yes; risk signal no.

## Post-edit targeted verification
**Trigger:** after source or test edits.  
**Preconditions:** project-specific build/test commands are known.  
**Action:** run targeted tests for rollback, retry, duplicate delivery, or concurrency as applicable, then the relevant broader test/build command. Re-run the scanner.  
**Expected result:** tests pass and no unexplained new high-risk signal is introduced.  
**Failure behavior:** preserve logs and enter the bounded fix/retest loop.  
**Blocking:** yes.

## Final assessment validation
**Trigger:** before reporting completion.  
**Preconditions:** assessment JSON exists and verification evidence has been recorded.  
**Action:** run `python scripts/validate-assessment.py <assessment.json>` and inspect the final git diff.  
**Expected result:** validator exits 0, diff is reviewed, and status is `pass`.  
**Failure behavior:** correct the assessment or source/test issue if retry budget remains; otherwise fail/stop.  
**Blocking:** yes.

## Approval boundary hook
**Trigger:** a proposed action matches `approval_required_for` in `config/transaction-gate.yaml`.  
**Preconditions:** none.  
**Action:** stop and request explicit human approval; do not execute the action.  
**Expected result:** approval is recorded before work resumes.  
**Failure behavior:** remain `needs-approval`. Never elevate permissions or bypass the boundary.  
**Blocking:** yes.

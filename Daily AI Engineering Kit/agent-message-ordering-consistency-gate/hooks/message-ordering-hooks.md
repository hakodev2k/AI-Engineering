# Message Ordering Hooks

## Pre-task risk scan
**Trigger:** before editing a message publisher/consumer/retry/version/concurrency path.  
**Preconditions:** repository and target path readable.  
**Action:** run `python3 scripts/scan-ordering-risk.py <target>`.  
**Expected result:** scanner output is captured as baseline evidence.  
**Failure behavior:** scanner execution errors block until fixed or escalated; findings with exit code 1/2 are evidence and do not by themselves authorize edits.  
**Blocking:** execution failure yes; risk findings feed the workflow gate.

## Post-edit ordering scan
**Trigger:** after relevant edits.  
**Preconditions:** edited files saved.  
**Action:** rerun `python3 scripts/scan-ordering-risk.py <target>` and compare with baseline.  
**Expected result:** no new unexplained high-risk ordering patterns.  
**Failure behavior:** new high-risk findings block completion until resolved or explicitly approved where applicable.  
**Blocking:** yes for unresolved high-risk findings.

## Final assessment validation
**Trigger:** before workflow completion.  
**Preconditions:** assessment JSON populated with evidence-backed verification fields.  
**Action:** run `python3 scripts/validate-assessment.py <assessment.json>`.  
**Expected result:** exit code 0 and `assessment valid`.  
**Failure behavior:** return to assessment/test stage; do not change booleans merely to satisfy validation.  
**Blocking:** yes.

## Test hook
**Trigger:** after implementation and on each fix-retest attempt.  
**Preconditions:** project test command is known.  
**Action:** execute project-specific build/tests plus scenarios for out-of-order, duplicate replay, stale event, and parallel consumers.  
**Expected result:** all required scenarios pass.  
**Failure behavior:** preserve logs and enter bounded fix-retest loop, maximum 2 attempts.  
**Blocking:** yes.

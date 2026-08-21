# Lifecycle Hooks

## Pre-task repository validation
**Trigger:** before investigation.  
**Preconditions:** repository root exists.  
**Action:** verify target files are readable and identify changed scope.  
**Command/script:** repository-native status/diff commands plus `python scripts/scan-cancellation-risk.py <repo-root> --json`.  
**Expected result:** scope and scanner evidence are available.  
**Failure behavior:** retry transient tool failure at most 2 times; otherwise block.  
**Blocks execution:** yes when repository/scope cannot be established.

## Post-edit cancellation scan
**Trigger:** after implementation edits.  
**Preconditions:** edited files are saved.  
**Action:** re-run cancellation risk scan and compare with pre-edit findings.  
**Command/script:** `python scripts/scan-cancellation-risk.py <repo-root> --json`.  
**Expected result:** no new confirmed high-risk cancellation defect.  
**Failure behavior:** enter workflow fix/retest loop.  
**Blocks execution:** yes for confirmed high/critical defects.

## Targeted test hook
**Trigger:** after scan review.  
**Preconditions:** repository test command is known.  
**Action:** run tests covering cancellation timing and downstream token observation.  
**Command/script:** project-native targeted test command.  
**Expected result:** targeted tests pass and canceled work terminates as intended.  
**Failure behavior:** preserve output and retry fixes at most 2 cycles.  
**Blocks execution:** yes.

## Final assessment validation
**Trigger:** before completion.  
**Preconditions:** assessment JSON exists and verifier completed review.  
**Action:** validate contract.  
**Command/script:** `python scripts/validate-assessment.py <assessment.json>`.  
**Expected result:** exit code 0.  
**Failure behavior:** correct assessment evidence; do not alter verification flags without proof.  
**Blocks execution:** yes.

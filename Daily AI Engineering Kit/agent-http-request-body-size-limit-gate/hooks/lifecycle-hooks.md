# Hooks: Request Body Size Gate

## Pre-task repository validation
**Trigger:** before investigation.  
**Preconditions:** repository path exists.  
**Action:** run `python scripts/scan-body-size-risk.py <repo> --output scan-before.json`.  
**Expected result:** deterministic advisory baseline is captured.  
**Failure behavior:** invalid input blocks; heuristic findings do not block automatically.  
**Blocking:** only tool/input failure blocks.

## Post-edit risk scan
**Trigger:** after implementation edits.  
**Preconditions:** repository remains readable.  
**Action:** run `python scripts/scan-body-size-risk.py <repo> --output scan-after.json`.  
**Expected result:** new/global disabling or buffering patterns are visible for review.  
**Failure behavior:** preserve output and retry once for transient environment failure.  
**Blocking:** scanner execution failure blocks verification; findings require review.

## Targeted request tests
**Trigger:** after edits and before independent verification.  
**Preconditions:** local test server/test harness is available.  
**Action:** run repository-specific normal, near-limit, oversized, and relevant chunked/streaming tests.  
**Expected result:** intended valid request succeeds; oversized request rejects deterministically without unintended side effects.  
**Failure behavior:** fix/retest maximum 2 cycles.  
**Blocking:** yes.

## Approval guard
**Trigger:** proposed production config/deployment, infrastructure, security-control weakening, breaking API change, or large dependency upgrade.  
**Action:** stop and request explicit approval outside this autonomous workflow.  
**Expected result:** no dangerous mutation occurs without approval.  
**Failure behavior:** status `needs-approval`.  
**Blocking:** yes.

## Final assessment validation
**Trigger:** before completion.  
**Preconditions:** `assessment.json` exists.  
**Action:** run `python scripts/validate-assessment.py assessment.json`.  
**Expected result:** exit code 0.  
**Failure behavior:** correct contract only when supported by evidence; do not fabricate flags.  
**Blocking:** yes.

# Hooks

## PreImplementation

**Trigger:** before any hotfix edit.

**Preconditions:** `hotfix-plan.json` exists.

**Action:**

`python scripts/validate-hotfix-plan.py --plan hotfix-plan.json --policy config/containment-policy.json`

**Expected result:** exit code 0.

**Failure behavior:** block implementation and preserve validator output.

**Blocking:** yes.

## PostEditDiffContainment

**Trigger:** after edits and before verification.

**Preconditions:** `changed-files.txt` contains one repository-relative changed path per line.

**Action:**

`python scripts/inspect-hotfix-diff.py --plan hotfix-plan.json --changed-files changed-files.txt --output diff-report.json`

**Expected result:** no unexpected or forbidden changed path.

**Failure behavior:** block verification until scope is corrected or explicitly re-approved.

**Blocking:** yes.

## PostVerificationGate

**Trigger:** after targeted and negative-control checks plus reviewer record.

**Action:**

`python scripts/evaluate-containment-gate.py --plan hotfix-plan.json --diff diff-report.json --verification verification-result.json --review reviewer-record.json --policy config/containment-policy.json --output containment-result.json`

**Expected result:** output status `verified`.

**Failure behavior:** preserve all evidence; do not deploy or mark the task verified.

**Blocking:** yes.

## PostIncidentFollowUp

**Trigger:** after service restoration when temporary exceptions exist.

**Action:** inspect `temporary_exceptions` in the plan and create or link follow-up work before expiry.

**Expected result:** every exception remains owned and time-bounded.

**Failure behavior:** flag lifecycle debt; do not silently convert a temporary bypass into permanent behavior.

**Blocking:** blocks final incident closure when policy requires follow-up ownership.
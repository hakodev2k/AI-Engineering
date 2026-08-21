# Lifecycle Hooks

## Pre-task validation
**Trigger:** Before investigation.
**Preconditions:** Repository path and target scope known.
**Action:** Confirm paths exist; identify changed files; run the scanner on scoped source files.
**Command:** `python scripts/scan-lock-risk.py <paths> --json`
**Expected result:** Scanner completes and output is preserved.
**Failure behavior:** Missing path blocks execution. Transient tool failure may be retried once.
**Blocking:** Yes for invalid scope; no for scanner high-risk findings, which become investigation inputs.

## Post-edit contention scan
**Trigger:** After each implementation attempt.
**Preconditions:** Candidate changes exist.
**Action:** Rerun `scripts/scan-lock-risk.py` on changed synchronization paths.
**Expected result:** No unexplained new high-risk pattern.
**Failure behavior:** New high-risk findings return the workflow to review/fix within the retry budget.
**Blocking:** Yes.

## Post-edit build and test
**Trigger:** After candidate implementation.
**Preconditions:** Repository provides relevant build/test commands.
**Action:** Run the smallest relevant build, unit/integration tests, and concurrency/contention test or equivalent signal.
**Expected result:** All required checks pass and candidate evidence is captured.
**Failure behavior:** Return to Execute; maximum two fix–retest attempts total.
**Blocking:** Yes.

## Final assessment validation
**Trigger:** Before independent verification and completion.
**Preconditions:** Assessment JSON exists.
**Action:** `python scripts/validate-assessment.py <assessment.json>`.
**Expected result:** Exit code 0 and `assessment valid`.
**Failure behavior:** Correct the assessment or remediation; do not report pass.
**Blocking:** Yes.

## Final independent verification
**Trigger:** After deterministic checks pass.
**Preconditions:** Before/after evidence, test output, scanner output, and diff are available.
**Action:** Hand off to `subagents/contention-verifier.md`.
**Expected result:** Independent decision supports `pass`.
**Failure behavior:** Retry only if verifier identifies an actionable fix within remaining budget; otherwise stop with fail/blocked/needs-approval.
**Blocking:** Yes.

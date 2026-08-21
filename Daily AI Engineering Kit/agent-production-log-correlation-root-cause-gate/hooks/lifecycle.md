# Lifecycle Hooks

## Pre-task validation
**Trigger:** Before investigation.

**Preconditions:** Repository and exported logs are locally accessible.

**Action:** Confirm configured policy exists, input log files exist, production write mode is disabled, and output directory is writable.

**Command:** `python scripts/correlate_logs.py --help`

**Expected result:** Exit code 0 and usage displayed.

**Failure behavior:** Block investigation until local tooling/input is valid.

## Post-collection evidence validation
**Trigger:** After log correlation.

**Action:** Run `python scripts/verify_package.py --evidence artifacts/log-correlation-evidence.json`.

**Expected result:** Schema shape, required fields, redaction scan, and evidence references pass.

**Failure behavior:** Block analyst handoff. Preserve validation errors. Maximum one retry after correcting deterministic formatting/input issues.

## Post-edit verification
**Trigger:** After any authorized candidate code change.

**Action:** Run project-specific formatter, focused tests, and relevant build/test suite defined by the host repository.

**Expected result:** All required commands pass and outputs are preserved in the report.

**Failure behavior:** Candidate change is not verified. Maximum two fix-test retries.

## Final verification
**Trigger:** Before declaring completion.

**Action:** Verification Agent checks evidence, causal chain, test output, diff scope, remaining risks, and approval boundaries.

**Expected result:** Report contains explicit verification status.

**Failure behavior:** Block `verified successfully`; report `failed` or `blocked` instead.

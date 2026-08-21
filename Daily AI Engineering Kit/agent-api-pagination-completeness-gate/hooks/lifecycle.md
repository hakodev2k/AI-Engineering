# Lifecycle Hooks

## Pre-task validation
**Trigger:** before any pagination investigation or remediation.
**Preconditions:** repository is available and policy file exists.
**Action:** run `python scripts/verify_package.py`; confirm the target endpoint is read-only for the planned run and secrets are external.
**Expected result:** package verification exits 0 and no production mutation is required.
**Failure behavior:** block execution until missing package/configuration issues are corrected.
**Blocking:** yes.

## Post-edit regression check
**Trigger:** after pagination-related source or test edits.
**Preconditions:** project test command is known.
**Action:** run focused pagination tests, then inspect changed files for unrelated modifications.
**Expected result:** focused tests pass and diff is scoped.
**Failure behavior:** allow at most two test-fix-retest attempts; preserve failures after each attempt.
**Blocking:** yes.

## Final pagination verification
**Trigger:** before declaring the task complete.
**Preconditions:** safe endpoint/fixture and required credentials exist.
**Action:** run `python scripts/pagination_gate.py` with repository-specific arguments; validate `pagination-result.json` against `schemas/pagination-result.schema.json` when a JSON Schema validator is available.
**Expected result:** status is `verified-complete`, loopsDetected is 0, and errors is empty.
**Failure behavior:** return `partial` or `blocked` with evidence; never convert a failed check to success.
**Blocking:** yes.

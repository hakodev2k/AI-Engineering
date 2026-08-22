# Lifecycle Hooks

## Pre-task policy validation
- **Trigger:** before implementation or tuning starts.
- **Preconditions:** `config/bulkhead-policy.yaml` exists.
- **Action:** run `python scripts/validate_bulkhead.py --policy config/bulkhead-policy.yaml`.
- **Expected result:** exit code 0 and `VALID`.
- **Failure behavior:** block execution; preserve validator output.
- **Blocking:** yes.

## Post-edit tests
- **Trigger:** after implementation or policy edits.
- **Preconditions:** Python 3.10+ is available.
- **Action:** run `python -m unittest tests/test_validate_bulkhead.py` plus repository-specific tests for changed modules.
- **Expected result:** all tests pass.
- **Failure behavior:** allow at most 2 fix/retest cycles; then stop with evidence.
- **Blocking:** yes.

## Final diff safety check
- **Trigger:** before completion.
- **Preconditions:** working tree/diff is available.
- **Action:** inspect changed files for unbounded queues/retries, removed timeouts/cancellation, secrets, production deployment/config changes, or unrelated edits.
- **Expected result:** no blocking violation.
- **Failure behavior:** block completion and require correction or approval where applicable.
- **Blocking:** yes.

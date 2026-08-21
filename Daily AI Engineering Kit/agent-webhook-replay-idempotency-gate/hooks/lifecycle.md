# Lifecycle Hooks

## Pre-task repository validation
Trigger: before exploration. Preconditions: repository root available. Action: confirm webhook entry point, tests and version-control status are readable. Expected: evidence paths captured. Failure: block if repository/target cannot be identified. Blocking: yes.

## Post-edit focused tests
Trigger: after implementation edits. Preconditions: local test environment available. Action: run repository-specific focused tests and `python -m pytest tests/test_webhook_gate.py`. Expected: zero exit code. Failure: preserve output; deterministic failures return to implementation, transient environment failures retry at most twice. Blocking: yes.

## Post-edit package validation
Trigger: after package/config changes. Action: run `python scripts/verify_package.py`. Expected: `package verified` and zero exit code. Failure: fix missing/broken references before proceeding. Blocking: yes.

## Pre-completion diff inspection
Trigger: before independent verification completion. Action: inspect changed files for unrelated edits, raw payload/secret logging, race-prone check-then-insert, and approval-required operations. Expected: no unexplained changes. Failure: return to implementation or stop at approval checkpoint. Blocking: yes.

## Final verification
Trigger: before status `verified`. Action: Verification Agent reruns relevant build/tests and concurrency/duplicate/mismatch scenarios. Expected: evidence-backed pass. Failure: one return cycle allowed, maximum two total verification cycles. Blocking: yes.

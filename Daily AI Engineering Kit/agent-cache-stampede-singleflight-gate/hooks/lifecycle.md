# Lifecycle Hooks

## Pre-task validation
**Trigger:** before investigation or edits.
**Preconditions:** repository is available locally.
**Action:** confirm cache implementation, key builder, and origin loader are in scope; confirm no production mutation is required.
**Expected result:** scope and test command are known.
**Failure behavior:** block execution if the cache path cannot be identified.

## Post-edit concurrency gate
**Trigger:** after implementation changes.
**Preconditions:** concurrency evidence JSON exists.
**Action:** run `python scripts/stampede_gate.py <evidence.json>`.
**Expected result:** exit code 0.
**Failure behavior:** block completion and preserve evidence; maximum two implementation retries.

## Test hook
**Trigger:** before verification handoff.
**Action:** run `python -m pytest tests/test_stampede_gate.py` plus repository-native tests for changed cache paths.
**Expected result:** all tests pass.
**Failure behavior:** block verification.

## Final verification
**Trigger:** before task completion.
**Action:** independent Verification Agent checks origin-call count, waiter termination, failure release, diff scope, cache-key semantics, and approval boundaries.
**Expected result:** evidence-based pass.
**Failure behavior:** task remains executed but not verified.

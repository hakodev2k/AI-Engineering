# Skill: Verify Saga Recovery

## Purpose
Prove that retry and compensation logic preserves business invariants under partial failure.

## When to use
After implementation or before release of saga/recovery changes.

## Inputs
Validated saga plan, changed files, test commands, simulation evidence.

## Procedure
1. Confirm the plan still matches current code.
2. Run deterministic plan validation and simulation.
3. Exercise success, duplicate delivery, timeout-after-send, crash-after-local-commit, downstream failure, compensation failure, and repeated compensation cases where applicable.
4. Confirm retries never exceed policy limits.
5. Confirm external outcomes are reconciled before replaying ambiguous actions.
6. Confirm compensation order respects dependencies.
7. Confirm repeated compensation is idempotent.
8. Inspect the final diff for unrelated changes.
9. Require independent review for the final `verified` status.

## Expected output
Verification report with status `verified`, `blocked`, or `failed`, evidence paths, failed scenarios, and remaining risks.

## Verification
Success requires deterministic validation plus repository tests proving the relevant failure windows.

## Failure handling
Transient environment/tool failures may be retried at most twice. Deterministic test or invariant failures are not blindly retried.

## Stop conditions
Stop before destructive or production-affecting compensation without explicit approval.

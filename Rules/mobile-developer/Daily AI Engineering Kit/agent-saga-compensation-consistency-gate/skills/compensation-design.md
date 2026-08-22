# Skill: Compensation Design

## Purpose
Design the smallest safe compensation and reconciliation behavior for a mapped saga.

## Inputs
A completed saga assessment, business invariants, provider contracts, and existing tests.

## Process
1. For each side effect, define the invariant that must hold after compensation.
2. Prefer semantic compensation (cancel, refund, release, revoke, mark-void) over destructive reversal.
3. Specify the compensation command, idempotency key, retry policy, and success receipt.
4. Define how an uncertain original outcome is reconciled before compensating.
5. Order compensations by reverse committed dependency order unless domain rules require another sequence.
6. Mark irreversible or high-risk compensations as approval-required.
7. Add tests for: failure before commit, failure after commit, duplicate forward call, duplicate compensation, timeout with unknown outcome, partial compensation failure, and resume after crash.
8. Re-run the deterministic gate and inspect the final diff.

## Expected output
Updated saga plan, implementation/test changes, and verification evidence.

## Verification
The workflow can prove one of: completed, compensated, blocked for approval, or failed with preserved evidence; it must never silently finish with unknown state.

## Failure handling
After three compensation attempts, stop automatic retries, preserve receipts/errors, and escalate to reconciliation/manual review.

# Skill: Repair Message Ordering

## Purpose
Implement the smallest safe correction after an ordering violation is evidenced.

## Inputs
Investigation evidence, root-cause statement, affected code paths, acceptance invariant, and existing tests.

## Preconditions
The ordering scope and sequence authority are known. If they are not, return to `investigate-ordering.md`.

## Process
1. Choose one repair boundary: producer sequence assignment, partition routing, consumer stale-message guard, idempotency, serialized aggregate mutation, or retry-path correction.
2. State why the chosen boundary fixes the evidenced failure and what it does not guarantee.
3. Add a regression test reproducing the failure before changing behavior when feasible.
4. Implement the smallest change without broad transport/config changes.
5. Ensure duplicate delivery remains safe; ordering checks are not a substitute for idempotency.
6. Exercise ordered, duplicate, gap, reversed, concurrent, and retry/redelivery cases relevant to the transport.
7. Capture post-change evidence and run the deterministic gate.
8. Run project build/tests and inspect the diff for unrelated edits.
9. Hand off to the Verification Agent; the implementer cannot be the sole verifier.

## Expected output
Minimal code/config delta, regression tests, before/after evidence, and explicit residual risk.

## Verification
The original reproduction no longer violates the business invariant, relevant test suites pass, and the evidence gate returns `pass` for expected ordered traces.

## Failure handling
For a failed test, inspect evidence and make at most two repair iterations. Do not weaken the test or ordering policy to obtain green status. Escalate after the second failed repair.

## Approval stop
Stop before production config changes, queue purge, sequence-state rewrite, destructive data repair, or disabling checks.

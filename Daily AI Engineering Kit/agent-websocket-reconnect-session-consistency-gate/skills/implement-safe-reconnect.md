# Skill: Implement Safe Reconnect

## Purpose
Apply the smallest safe change that restores reconnect consistency.

## Inputs
Explorer findings, acceptance criteria, relevant tests, reconnect policy.

## Preconditions
A specific failure mode and expected invariant are identified.

## Allowed tools
Repository editing, formatter/linter, unit/integration tests, local WebSocket test server, trace validator.

## Constraints
One hypothesis per implementation cycle. Maximum three implementation cycles.

## Procedure
1. Select the highest-confidence failure hypothesis.
2. Define the invariant to restore, such as single reconnect loop, single subscription restoration, monotonic checkpoint, or valid session refresh.
3. Change the smallest owning component.
4. Add or update a regression test reproducing the original disconnect timing.
5. Run targeted tests.
6. Capture a reconnect trace.
7. Run `scripts/validate_reconnect_trace.py`.
8. Inspect the diff for unrelated edits.
9. If failure remains, preserve evidence and test the next hypothesis.
10. Stop after three failed cycles and escalate.

## Expected output
Minimal diff, regression test, trace, validation result, remaining risk.

## Verification
Passing code tests plus validator status `verified`; neither alone is sufficient.

## Failure handling
Transient environment/tool failures: maximum two retries. Deterministic test failures require code or hypothesis change before retry.

## Stop conditions
Stop before production deployment, security weakening, public protocol break, secret/config change, or large dependency upgrade without approval.

# Remediate Distributed Lock Safety

## Purpose
Implement the smallest change that prevents stale owners, unsafe release, unbounded lease renewal, and overlapping critical sections.

## Inputs
Verified investigation report, acceptance criteria, backend capabilities, existing tests.

## Preconditions
Root cause is evidenced. Required approval exists for backend/config/production changes.

## Procedure
1. Preserve existing behavior with a failing regression test.
2. Give every acquisition a cryptographically strong unique owner token or backend-provided lease identity.
3. Make release atomic and conditional on current ownership; never GET-then-DELETE across separate operations when another owner can race.
4. Make renewal conditional on ownership and bound total renewals/lifetime.
5. If expired holders can still write shared state, introduce monotonically increasing fencing tokens and reject older tokens at the protected resource where feasible.
6. Keep critical work cancellation-aware and shorter than the lease budget; move slow external calls outside the lock when correctness allows.
7. Add jittered bounded acquisition retries; do not spin.
8. Preserve exception evidence and release only the lease actually owned.
9. Run contention, expiry and stale-owner tests plus project build/tests.
10. Inspect the diff for unrelated changes and record residual risks.

## Expected output
Minimal implementation diff, regression tests, and updated evidence report.

## Verification
An independent verifier must confirm the implementation rather than relying only on the implementing agent.

## Failure handling
A failed test-fix loop is limited to two implementation retries. After that, stop with evidence and unresolved hypotheses.

## Stop conditions
Stop for destructive recovery, production rollout, lock backend replacement, schema changes, or security weakening pending human approval.

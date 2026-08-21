# Skill: Safe Lock Remediation

## Purpose
Implement the smallest change that makes Redis lock ownership, expiry, and stale-holder behavior explicit and verifiable.

## Inputs
Approved investigation findings, affected call sites, test commands, lock policy.

## Preconditions
The protected resource, lock scope, and failure mode are known. Any production force-unlock or scope change has explicit approval.

## Process
1. Baseline current tests and capture failures.
2. Introduce opaque owner tokens and atomic compare-and-release if missing.
3. Introduce atomic compare-and-renew if renewal is required.
4. Add a monotonic fencing token for side effects that can outlive the lease.
5. Make ownership loss cancel or stop protected work.
6. Keep retries bounded to policy and surface acquisition failure.
7. Add tests for two contenders, owner mismatch, expiry, stale fencing token, renewal, and cancellation.
8. Run formatting, unit tests, integration tests, and diff inspection.
9. Verify no unrelated API, schema, infrastructure, or permission change occurred.
10. Hand off to an independent verifier with evidence.

## Expected output
Code changes, tests, command results, residual risk, and approval record where applicable.

## Verification
A change is not complete until contention and expiry tests demonstrate that at most the current valid holder is authorized to commit protected state.

## Failure handling
Retry transient local Redis/test startup failures at most twice. Code/test failures are not blindly retried; preserve output, diagnose, make one evidence-based correction, rerun, then escalate if still failing.

## Stop conditions
Stop on lost ownership, missing approval, unexpected destructive diff, unbounded critical-section duration, or inability to verify fencing for a non-idempotent side effect.

# Verify DNS Failover

## Purpose
Prove that clients recover from address/endpoint change within stated availability expectations rather than merely proving that DNS resolves once.

## Inputs
Approved test environment, hostname, expected failover mechanism, TTL/refresh expectations, client implementation, and acceptance window.

## Process
1. Record baseline resolution and successful application request.
2. Identify the supported failover mechanism and expected propagation/recovery window.
3. Confirm the test is non-production or obtain explicit approval before any infrastructure mutation.
4. Trigger only the approved test-environment failover mechanism.
5. Re-run resolution at bounded intervals and record address sets and timestamps.
6. Exercise a fresh client and a long-lived client separately.
7. Verify TLS hostname validation and application-level success after transition.
8. Confirm clients do not remain pinned to retired addresses beyond the acceptance window.
9. Restore the test environment if the approved procedure requires it.
10. Produce verification status with measured recovery time.

## Verification
Pass only when resolution changes as expected, TLS remains valid, requests recover within the defined window, and no forbidden address is used.

## Failure handling
Maximum two verification retries after transient lookup/network failures. Do not mask a deterministic failure by extending TTLs/timeouts.

## Stop conditions
Stop on production mutation without approval, unexpected address scope, certificate mismatch, exhausted retries, or ambiguous recovery evidence.

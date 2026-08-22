# Singleflight Remediation

## Purpose
Implement the smallest safe change that coalesces concurrent cache misses for the same logical key.

## Inputs
Confirmed finding, target cache key, origin loader, policy from `config/policy.yaml`.

## Preconditions
The key must be stable and the origin loader must be safe to execute once for many waiters.

## Procedure
1. Preserve existing cache key semantics.
2. Add per-key request coalescing around the miss loader.
3. Bound lock acquisition and origin execution using policy timeouts.
4. Ensure the leader releases ownership in success, cancellation, and exception paths.
5. Propagate the leader result to waiters without duplicating origin calls.
6. Add stale-while-revalidate when a safe stale value exists.
7. Add bounded jitter to TTLs where synchronized expiry is possible.
8. Add negative caching only for outcomes explicitly safe to cache.
9. Add counters for leaders, waiters, timeouts, stale serves, origin failures, and duplicate loads.
10. Add concurrency tests and failure tests before declaring complete.

## Verification
Under a concurrent test of at least 20 same-key callers, the origin loader executes once per coalesced window; all waiters terminate within configured bounds; exceptions do not leave a stuck lock.

## Failure handling
After two failed implementation/test cycles, stop, preserve logs and diff, and escalate with the unresolved failure.

## Stop conditions
Stop before any production cache flush, cluster reconfiguration, or high-impact TTL change requiring approval.

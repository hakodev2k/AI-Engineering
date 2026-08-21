# Lease Analysis

## Purpose
Determine whether a queue consumer can safely process work that may outlive the broker visibility timeout or lock duration.

## When to use
Use before changing queue worker concurrency, retry behavior, handler duration, visibility timeout, message settlement, or lease-renewal code.

## Inputs
- Queue provider and lease/visibility semantics.
- Current visibility timeout or lock duration.
- P50/P95/P99 handler duration.
- Renewal mechanism and maximum lock duration.
- Delivery-count and dead-letter policy.
- Idempotency strategy.

## Preconditions
Repository and runtime configuration are readable. Production mutation is not required.

## Allowed tools
Repository search, test runner, local scripts, logs, metrics, queue documentation, read-only cloud/API inspection.

## Constraints
Do not purge queues, replay dead letters, delete messages, or change production settings without approval.

## Procedure
1. Identify receive, handler, renewal, settlement, retry, and dead-letter entry points.
2. Record the configured visibility timeout and provider maximum lease duration.
3. Compare handler P95/P99 duration against the renewal threshold.
4. Trace how ownership is represented: receipt handle, lock token, pop receipt, ETag, or equivalent.
5. Verify renewal uses the latest ownership token returned by the provider.
6. Identify every path that completes, abandons, releases, dead-letters, or loses the message.
7. Confirm processing is idempotent or guarded by an idempotency key before any external side effect.
8. Form hypotheses for duplicate delivery, premature visibility, stale-token renewal, and late settlement.
9. Validate each hypothesis with a focused test or deterministic simulation.
10. Produce evidence with file paths, settings, timings, and observed outcomes.

## Expected output
Facts, hypotheses, evidence, affected component, risk, recommended change, and verification status.

## Verification
A finding is confirmed only by code/config evidence plus a reproducible test, log, metric, or provider contract.

## Failure handling
If provider semantics are unknown, stop implementation and request official contract evidence. If production-only evidence is required, use read-only telemetry.

## Stop conditions
Stop when ownership semantics remain ambiguous, required credentials are unavailable, or the proposed fix requires production configuration change without approval.

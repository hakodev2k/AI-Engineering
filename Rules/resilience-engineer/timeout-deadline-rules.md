# Timeout and Deadline Rules

## Purpose
Bound work so slow dependencies cannot turn latency degradation into resource exhaustion and cascading failure.

## Scope
Applies to synchronous calls, asynchronous operations, database queries, queue consumers, background jobs, and distributed request chains.

## MUST
- External and cross-process operations MUST have explicit finite timeouts.
- Nested operations MUST respect the caller's remaining end-to-end deadline where the platform supports propagation.
- Timeout values MUST be based on service objectives, measured latency distributions, and recovery behavior rather than arbitrary constants.
- Timeout events MUST be distinguishable in telemetry from application errors and cancellations.
- Expired work MUST release scarce resources promptly where cancellation is safe.

## MUST NOT
- MUST NOT configure infinite waits on critical production paths.
- MUST NOT set each downstream timeout equal to the full user-facing latency budget in a multi-hop chain.
- MUST NOT automatically retry timed-out non-idempotent operations without establishing outcome safety.

## SHOULD
- Deadline propagation SHOULD be preferred to unrelated per-hop timers for request chains.
- Timeout policies SHOULD include reasonable jitter or coordination controls when synchronized expiry could amplify load.

## Exceptions
Long-running operations may exceed interactive deadlines only when intentionally modeled as asynchronous work with bounded execution, progress visibility, and recovery semantics.

## Verification
Inspect client and server configuration, trace deadline propagation, test slow and hung dependencies, and verify resource usage returns to normal after timeout storms.